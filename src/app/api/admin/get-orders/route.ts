// app/api/admin/get-orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/order.model'


export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const paymentStatus = searchParams.get('paymentStatus') || ''
    const search = searchParams.get('search') || ''

    const query: Record<string, unknown> = {}

    if (status && status !== 'all') query.orderStatus = status
    if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * limit
    const totalOrders = await Order.countDocuments(query)
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 })
  }
}


// app/api/admin/update-order/route.ts  ← PUT this in a separate file
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