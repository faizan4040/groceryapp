import connectDB from '@/lib/db';
import { Payment } from '@/models/payments.model';
import { NextResponse } from 'next/server';


// GET: Fetch all payments for the Table
export async function GET() {
  try {
    await connectDB();
    
    // Use .populate('items') or .populate('orderId') 
    // depending on how your schema is linked
    const payments = await Payment.find()
      .populate('cartItems') 
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, payments }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: Update status (Refund/Return logic)
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ message: "Missing ID or Status" }, { status: 400 });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      payment: updatedPayment 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}