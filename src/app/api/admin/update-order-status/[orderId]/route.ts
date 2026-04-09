import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.models";

import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await connectDB();

    const { orderId } = params;
    const { status } = await req.json();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 400 }
      );
    }

    // update order status
    order.status = status;

    let deliveryBoysPayload: any[] = [];

    // assign delivery if needed
    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;

      // find nearby delivery boys
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000, // 10 km
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      // find busy delivery boys
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((b) => String(b)));

      // filter available delivery boys
      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);

      // no delivery boys available
      if (candidates.length === 0) {
        await order.save();

        await emitEventHandler("order-status-update",{ orderId:order._id, status:order.status})

        return NextResponse.json(
          { success: false, message: "No delivery boys available" },
          { status: 200 }
        );
      }

      // create assignment
      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastTo: candidates,
        status: "broadcasted",
      });

      order.assignment = deliveryAssignment._id;

      // prepare payload
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));
    }

    await order.save();
    await order.populate("user");
    
    await emitEventHandler("order-status-update",{ orderId:order._id, status:order.status})

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        assignment: order.assignment,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: `Update status error: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
