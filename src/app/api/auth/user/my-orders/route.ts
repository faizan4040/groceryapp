import { auth } from '@/auth';
import connectDB from '@/lib/db';
import Order from '@/models/order.model';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const sessionUserId = session.user.id;

    const userOrders = await Order.find({
      userId: new mongoose.Types.ObjectId(sessionUserId), 
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(userOrders, { status: 200 });

  } catch (error) {
    console.error('my-orders error:', error);
    return NextResponse.json(
      { message: `Get all orders error: ${error}` },
      { status: 500 }
    );
  }
}

