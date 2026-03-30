import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("🟡 ORDER PAYLOAD RECEIVED:", JSON.stringify(body, null, 2));

    const { userId, items, paymentMethod, totalAmount, address } = body;

    // ── Detailed validation with specific error messages ──
    if (!userId) {
      console.error("❌ userId is missing or falsy:", userId);
      return NextResponse.json(
        { success: false, message: "userId is missing" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(String(userId))) {
      console.error("❌ Invalid userId format:", userId);
      return NextResponse.json(
        { success: false, message: "Invalid userId format" },
        { status: 400 }
      );
    }

    if (!items?.length) {
      return NextResponse.json(
        { success: false, message: "Items are required" },
        { status: 400 }
      );
    }

    if (!paymentMethod || !["cod", "online"].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Invalid paymentMethod (cod | online)" },
        { status: 400 }
      );
    }

    if (!totalAmount || isNaN(Number(totalAmount))) {
      return NextResponse.json(
        { success: false, message: "Invalid totalAmount" },
        { status: 400 }
      );
    }

    if (!address?.fullName || !address?.mobile || !address?.fullAddress) {
      return NextResponse.json(
        { success: false, message: "Incomplete address: fullName, mobile and fullAddress are required" },
        { status: 400 }
      );
    }

    // ── User check ──
    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ No user found for id:", userId);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ── Validate & sanitize items ──
    const validatedItems = items.map((item: any, i: number) => {
      if (!item.grocery || !mongoose.Types.ObjectId.isValid(String(item.grocery))) {
        throw new Error(`Invalid grocery id at index ${i}: "${item.grocery}"`);
      }
      return {
        grocery:  new mongoose.Types.ObjectId(String(item.grocery)),
        name:     item.name     || "Item",
        price:    Number(item.price)    || 0,
        quantity: Number(item.quantity) || 1,
        unit:     item.unit  || "unit",
        image:    item.image || "",
      };
    });

    const parsedTotal = Number(totalAmount);

    // ── COD ──
    if (paymentMethod === "cod") {
      const newOrder = await Order.create({
        user:          userId,
        items:         validatedItems,
        paymentMethod: "cod",
        totalAmount:   parsedTotal,
        address,
        isPaid:        false,
      });

      console.log(" COD ORDER CREATED:", newOrder._id);

      return NextResponse.json({
        success: true,
        message: "Order placed with Cash on Delivery",
        orderId: newOrder._id,
      });
    }

    // ── Online / Razorpay ──
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, message: "Razorpay is not configured on the server" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(parsedTotal * 100),
      currency: "INR",
      receipt:  `receipt_${Date.now()}`,
    });

    const newOrder = await Order.create({
      user:            userId,
      items:           validatedItems,
      paymentMethod:   "online",
      totalAmount:     parsedTotal,
      address,
      razorpayOrderId: razorpayOrder.id,
      isPaid:          false,
    });

    console.log(" ONLINE ORDER CREATED:", newOrder._id);

    return NextResponse.json({
      success:         true,
      message:         "Razorpay order created",
      orderId:         newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
      key:             process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    console.error("🔴 ORDER ERROR:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}