import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import couponsModel from "@/models/coupons.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
    }

    // Find coupon (case-insensitive)
    const coupon = await couponsModel.findOne({ 
      code: code.toUpperCase().trim() 
    });

    // Does it exist?
    if (!coupon) {
      return NextResponse.json({ message: "Invalid coupon code" }, { status: 404 });
    }

    // Is it active?
    if (!coupon.isActive) {
      return NextResponse.json({ message: "This coupon is no longer active" }, { status: 400 });
    }

    // Is it expired?
    if (new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ message: "This coupon has expired" }, { status: 400 });
    }

    // Usage limit reached?
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ message: "Coupon usage limit reached" }, { status: 400 });
    }

    // Minimum purchase check
    if (cartTotal && coupon.minPurchase > 0 && cartTotal < coupon.minPurchase) {
      return NextResponse.json({ 
        message: `Minimum purchase of ₹${coupon.minPurchase} required` 
      }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Don't discount more than cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return NextResponse.json({
      valid: true,
      coupon: {
        code:          coupon.code,
        discountType:  coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}