// app/api/admin/update-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/order.model'


export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { orderId, orderStatus, paymentStatus } = body

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 })
    }

    const updateData: Record<string, string> = {}
    if (orderStatus) updateData.orderStatus = orderStatus
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true }
    ).populate('userId', 'name email phone')

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, order: updatedOrder })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 })
  }
}
















// // app/api/admin/update-order/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import connectDB from '@/lib/db'
// import Order from '@/models/order.model'


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


