import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      dbOrderId,           // our MongoDB order _id
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !dbOrderId) {
      return NextResponse.json(
        { success: false, message: "Missing verification fields" },
        { status: 400 }
      );
    }

    /* ── HMAC-SHA256 signature verification ── */
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment signature mismatch — possible fraud" },
        { status: 400 }
      );
    }

    /* ── Mark order as paid ── */
    await Order.findByIdAndUpdate(dbOrderId, {
      isPaid:            true,
      paymentStatus:     "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error: any) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}