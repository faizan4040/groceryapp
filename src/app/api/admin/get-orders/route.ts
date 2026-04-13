import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db'
import Order from '@/models/order.model'
import DeliveryAssignment from '@/models/deliveryAssignment.model'
import User from '@/models/user.models'
import emitEventHandler from '@/lib/emitEventHandler'

export async function GET(req: NextRequest) {
  try {
    console.log(' [GET /api/admin/get-orders]')

    await connectDB()

    // Check auth
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const paymentStatus = searchParams.get('paymentStatus') || ''
    const search = searchParams.get('search') || ''

    console.log('🔍 Params:', { orderId, page, limit, status, paymentStatus, search })

    // ── SINGLE ORDER (for modal) ──────────────────────────────────
    if (orderId) {
      console.log('📍 Fetching single order:', orderId)

      const order = await Order.findById(orderId)
        .populate({
          path: 'assignment',
          model: 'DeliveryAssignment',
          select: 'broadcastedTo assignedTo status acceptedAt createdAt',
        })
        .populate({
          path: 'userId',
          select: 'name email mobile avatar',
        })
        .lean()

      if (!order) {
        console.log(' Order not found')
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        )
      }

      console.log(' Order fetched')

      return NextResponse.json(
        { success: true, order },
        { status: 200 }
      )
    }

    // ── LIST VIEW (table) ────────────────────────────────────────
    console.log('📥 Fetching orders list')

    const query: Record<string, any> = {}

    // Status filter
    if (status && status !== 'all') {
      query.status = status
    }

    // Payment status filter
    if (paymentStatus === 'paid') {
      query.isPaid = true
    } else if (paymentStatus === 'unpaid') {
      query.isPaid = false
    }

    // Search filter
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.mobile': { $regex: search, $options: 'i' } },
        { paymentMethod: { $regex: search, $options: 'i' } },
      ]
    }

    console.log(' Query:', JSON.stringify(query))

    const skip = (page - 1) * limit
    const totalOrders = await Order.countDocuments(query)

    const orders = await Order.find(query)
      .populate({
        path: 'assignment',
        model: 'DeliveryAssignment',
        select: 'status assignedTo acceptedAt',
      })
      .populate({
        path: 'userId',
        select: 'name email mobile',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    console.log(' Found', orders.length, 'orders')

    return NextResponse.json(
      {
        success: true,
        orders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          totalPages: Math.ceil(totalOrders / limit),
        },
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error(' Get orders error:', error.message)
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log(' [PUT /api/admin/get-orders]')

    await connectDB()

    // Check auth
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId, status, isPaid } = await req.json()

    console.log(' Update params:', { orderId, status, isPaid })

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID required' },
        { status: 400 }
      )
    }

    // Get current order
    const order = await Order.findById(orderId)

    if (!order) {
      console.log(' Order not found')
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order fields
    if (status !== undefined) {
      console.log(' Changing status:', order.status, '→', status)
      order.status = status
    }

    if (isPaid !== undefined) {
      console.log(' Changing isPaid:', order.isPaid, '→', isPaid)
      order.isPaid = isPaid
    }

    // BROADCAST LOGIC when "out for delivery"
    if (status === 'out for delivery' && !order.assignment) {
      console.log(' Broadcasting order for delivery')

      const { latitude, longitude } = order.address || {}

      if (latitude && longitude) {
        // Find nearby delivery boys
        const nearByDeliveryBoys = await User.find({
          role: 'deliveryBoy',
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [Number(longitude), Number(latitude)],
              },
              $maxDistance: 10000, // 10 km
            },
          },
        })

        console.log(' Found nearby delivery boys:', nearByDeliveryBoys.length)

        if (nearByDeliveryBoys.length === 0) {
          console.log(' No delivery boys nearby')
          await order.save()
          return NextResponse.json(
            { 
              success: true, 
              message: 'Order updated, but no delivery boys available', 
              order 
            },
            { status: 200 }
          )
        }

        const candidateIds = nearByDeliveryBoys.map((b) => b._id.toString())

        // Find busy delivery boys
        const busyAssignments = await DeliveryAssignment.find({
          assignedTo: { $in: candidateIds },
          status: { $nin: ['broadcasted', 'completed', 'failed'] },
        })

        const busySet = new Set(busyAssignments.map((a) => a.assignedTo?.toString()))

        const availableBoys = nearByDeliveryBoys.filter(
          (b) => !busySet.has(b._id.toString())
        )

        console.log(' Available delivery boys:', availableBoys.length)

        if (availableBoys.length === 0) {
          console.log(' All nearby delivery boys are busy')
          await order.save()
          return NextResponse.json(
            { 
              success: true, 
              message: 'Order updated, but all delivery boys are busy', 
              order 
            },
            { status: 200 }
          )
        }

        // Create assignment
        const candidateStrings = availableBoys.map((b) => b._id.toString())

        const assignment = await DeliveryAssignment.create({
          order: order._id,
          broadcastedTo: candidateStrings, // Array of strings
          status: 'broadcasted',
        })

        order.assignment = assignment._id

        console.log('📢 Broadcasting to', candidateStrings.length, 'delivery boys')

        // Emit socket event
        try {
          await emitEventHandler('new-delivery-request', {
            orderId: order._id,
            assignmentId: assignment._id,
            orderTotal: order.totalAmount,
            paymentMethod: order.paymentMethod,
            address: order.address,
            items: order.items,
            candidates: availableBoys.map((b) => ({
              id: b._id.toString(),
              name: b.name,
              mobile: b.mobile,
            })),
          })
          console.log(' Socket event emitted')
        } catch (err: any) {
          console.log(' Socket emit warning:', err.message)
        }
      }
    }

    // Sync assignment status
    if (status && order.assignment) {
      console.log('🔗 Syncing assignment status')

      const statusMap: Record<string, 'broadcasted' | 'assigned' | 'completed' | 'failed'> = {
        'delivered': 'completed',
        'cancelled': 'completed',
        'out for delivery': 'broadcasted',
      }

      const newAssignmentStatus = statusMap[status]

      if (newAssignmentStatus) {
        console.log(' Updating assignment to:', newAssignmentStatus)
        await DeliveryAssignment.findByIdAndUpdate(
          order.assignment,
          { status: newAssignmentStatus }
        )
      }
    }

    //  Save order
    await order.save()

    console.log(' Order updated successfully')

    //  Emit status update event
    try {
      await emitEventHandler('order-status-update', {
        orderId: order._id,
        status: order.status,
      })
      console.log(' Status update event emitted')
    } catch (err: any) {
      console.log(' Status update event warning:', err.message)
    }

    return NextResponse.json(
      { success: true, message: 'Order updated successfully', order },
      { status: 200 }
    )

  } catch (error: any) {
    console.error(' Update order error:', error.message)
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}








// import { NextRequest, NextResponse } from 'next/server'
// import connectDB from '@/lib/db'
// import Order from '@/models/order.model'


// export async function GET(req: NextRequest) {
//   try {
//     await connectDB()

//     const { searchParams } = new URL(req.url)
//     const page = parseInt(searchParams.get('page') || '1')
//     const limit = parseInt(searchParams.get('limit') || '10')
//     const status = searchParams.get('status') || ''
//     const paymentStatus = searchParams.get('paymentStatus') || ''
//     const search = searchParams.get('search') || ''

//     const query: Record<string, unknown> = {}

//     if (status && status !== 'all') query.orderStatus = status
//     if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus
//     if (search) {
//       query.$or = [
//         { orderId: { $regex: search, $options: 'i' } },
//         { 'shippingAddress.name': { $regex: search, $options: 'i' } },
//         { 'shippingAddress.email': { $regex: search, $options: 'i' } },
//       ]
//     }

//     const skip = (page - 1) * limit
//     const totalOrders = await Order.countDocuments(query)
//     const orders = await Order.find(query)
//       .populate('userId', 'name email phone')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean()

//     return NextResponse.json({
//       success: true,
//       orders,
//       pagination: {
//         total: totalOrders,
//         page,
//         limit,
//         totalPages: Math.ceil(totalOrders / limit),
//       },
//     })
//   } catch (error) {
//     console.error('Get orders error:', error)
//     return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 })
//   }
// }


// // app/api/admin/update-order/route.ts  ← PUT this in a separate file
// export async function PUT(req: NextRequest) {
//   try {
//     await connectDB()
//     const body = await req.json()
//     const { orderId, orderStatus, paymentStatus } = body

//     if (!orderId) {
//       return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 })
//     }

//     const updateData: Record<string, string> = {}
//     if (orderStatus) updateData.orderStatus = orderStatus
//     if (paymentStatus) updateData.paymentStatus = paymentStatus

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { $set: updateData },
//       { new: true }
//     ).populate('userId', 'name email phone')

//     if (!updatedOrder) {
//       return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
//     }

//     return NextResponse.json({ success: true, order: updatedOrder })
//   } catch (error) {
//     console.error('Update order error:', error)
//     return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 })
//   }
// }