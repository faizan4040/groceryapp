import connectDB from "@/lib/db";
import couponsModel from "@/models/coupons.model";
import { NextResponse } from "next/server";


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const deletedCoupon = await couponsModel.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Coupon deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}