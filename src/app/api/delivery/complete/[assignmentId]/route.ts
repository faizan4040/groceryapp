import { auth } from "@/auth";
// app/api/delivery/complete/[assignmentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";

import emitEventHandler from "@/lib/emitEventHandler";
import User from "@/models/user.models";

export async function POST(
  req: NextRequest,
  { params }: { params: { assignmentId: string } }
) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { assignmentId } = params;

    const assignment = await DeliveryAssignment.findById(assignmentId).populate("order");
    if (!assignment) {
      return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 });
    }

    // Update assignment status
    assignment.status = "delivered";
    await assignment.save();

    // Update order status to delivered + mark paid if COD
    const order = await Order.findByIdAndUpdate(
      assignment.order._id,
      { status: "delivered" },
      { new: true }
    );

    // Notify customer
    const customer = await User.findById(order?.userId);
    if (customer?.socketId) {
      await emitEventHandler(
        "order-delivered",
        { orderId: order?._id, message: "Your order has been delivered! 🎉" },
        customer.socketId
      );
    }

    return NextResponse.json({ success: true, message: "Marked as delivered" });
  } catch (error: any) {
    console.error("[complete-delivery]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}