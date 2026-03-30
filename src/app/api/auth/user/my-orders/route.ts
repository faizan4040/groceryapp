import { auth } from '@/auth';
import connectDB from '@/lib/db';
import Order from '@/models/order.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Use find (not findOne) to get ALL orders for this user
    // Sort newest first, populate user details
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Return empty array (not 400) when no orders — frontend handles it gracefully
    return NextResponse.json(orders, { status: 200 });

  } catch (error) {
    console.error('my-orders error:', error);
    return NextResponse.json(
      { message: `Get all orders error: ${error}` },
      { status: 500 }
    );
  }
}