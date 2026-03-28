import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Field is `userId` (matches frontend buildPayload)
    const { userId, items, paymentMethod, totalAmount, address } = body;

    if (!userId || !items?.length || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!address.fullName || !address.mobile || !address.fullAddress) {
      return NextResponse.json(
        { success: false, message: "Invalid address details" },
        { status: 400 }
      );
    }

    /* ──────────────────────────────────────────
       COD — create order immediately
    ────────────────────────────────────────── */
    if (paymentMethod === "cod") {
      const newOrder = await Order.create({
        user: userId,
        items,
        paymentMethod,
        totalAmount: Number(totalAmount),   // ensure Number
        address,
        paymentStatus: "pending",
        isPaid: false,
      });

      return NextResponse.json({
        success: true,
        message: "Order placed with Cash on Delivery",
        orderId: newOrder._id,
      });
    }

    /* ──────────────────────────────────────────
       ONLINE — create Razorpay order
    ────────────────────────────────────────── */
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(Number(totalAmount) * 100),  // ₹ → paise
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });

    // Save order in DB before showing checkout (payment may still fail)
    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount:     Number(totalAmount),
      address,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus:   "pending",
      isPaid:          false,
    });

    return NextResponse.json({
      success:         true,
      message:         "Razorpay order created",
      orderId:         newOrder._id,          // DB order id (for verify route)
      razorpayOrderId: razorpayOrder.id,      // Razorpay order id
      amount:          razorpayOrder.amount,  // in paise
      currency:        razorpayOrder.currency,
      key:             process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    console.error("ORDER/PAYMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}