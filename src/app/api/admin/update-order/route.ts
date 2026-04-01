// app/api/admin/update-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/order.model'


export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { orderId, status, isPaid } = body  // ← match the frontend's field names

    console.log("BODY:", body)

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 })
    }

    if (status === undefined && isPaid === undefined) {
      return NextResponse.json({ success: false, message: 'No data to update' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {}

    if (status !== undefined) updateData.status = status
    if (isPaid !== undefined) updateData.isPaid = isPaid  // ← boolean, not a string

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true }  // ← use `new: true` instead of returnDocument
    )

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, order: updatedOrder })

  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 })
  }
}












