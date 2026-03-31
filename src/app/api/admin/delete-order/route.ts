// app/api/admin/delete-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Order from '@/models/order.model'


export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 })
    }

    const deleted = await Order.findByIdAndDelete(orderId)

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Delete order error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete order' }, { status: 500 })
  }
}