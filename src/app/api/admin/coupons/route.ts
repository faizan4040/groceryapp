import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import couponsModel from "@/models/coupons.model";

// GET: Fetch all coupons
export async function GET() {
  try {
    await connectDB();
    const coupons = await couponsModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ coupons }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST: Create a new coupon
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Basic validation
    if (!body.code || !body.discountValue || !body.expiryDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newCoupon = await couponsModel.create(body);
    return NextResponse.json({ message: "Coupon created", coupon: newCoupon }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}