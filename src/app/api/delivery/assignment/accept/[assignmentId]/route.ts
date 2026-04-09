import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import emitEventHandler from "@/lib/emitEventHandler";
import User from "@/models/user.models";

export async function GET(
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

    // 1. Find the assignment
    const assignment = await DeliveryAssignment.findById(assignmentId).populate("order");
    if (!assignment) {
      return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 });
    }

    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        { success: false, message: "Assignment already taken or cancelled" },
        { status: 400 }
      );
    }

    // 2. Mark assignment as accepted by this delivery boy
    assignment.status = "accepted";
    assignment.deliveryBoy = new mongoose.Types.ObjectId(session.user.id);
    await assignment.save();

    // 3. Find the delivery boy's socket info to send live-tracking data
    const deliveryBoy = await User.findById(session.user.id);

    // 4. Notify the customer that delivery boy accepted
    //    Get customer's socketId from User model
    const order = await Order.findById(assignment.order._id);
    const customer = await User.findById(order?.userId);

    if (customer?.socketId) {
      await emitEventHandler(
        "delivery-accepted",
        {
          assignmentId: assignment._id,
          orderId: order?._id,
          deliveryBoy: {
            name: deliveryBoy?.name,
            phone: deliveryBoy?.phone,
          },
        },
        customer.socketId
      );
    }

    // 5. Notify all OTHER delivery boys that order is taken (remove from their list)
    const allDeliveryBoys = await User.find({ role: "delivery", _id: { $ne: session.user.id } });
    for (const boy of allDeliveryBoys) {
      if (boy.socketId) {
        await emitEventHandler("assignment-taken", { assignmentId }, boy.socketId);
      }
    }

    const populated = await DeliveryAssignment.findById(assignmentId).populate("order");

    return NextResponse.json({ success: true, assignment: populated });
  } catch (error: any) {
    console.error("[accept-assignment]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}








// import { auth } from "@/auth";
// import connectDB from "@/lib/db";
// import DeliveryAssignment from "@/models/deliveryAssignment.model";
// import Order from "@/models/order.model";
// import { NextRequest, NextResponse } from "next/server";
// import emitEventHandler from "@/lib/emitEventHandler";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();

//     const { id } = params;
//     const session = await auth();
//     const deliveryBoyId = session?.user?.id;

//     if (!deliveryBoyId) {
//       return NextResponse.json({ message: "unauthorized" }, { status: 401 });
//     }

//     const assignment = await DeliveryAssignment.findById(id).populate("order");

//     if (!assignment) {
//       return NextResponse.json({ message: "assignment not found" }, { status: 404 });
//     }

//     if (assignment.status !== "broadcasted") {
//       return NextResponse.json({ message: "assignment expired" }, { status: 400 });
//     }

//     const alreadyAssigned = await DeliveryAssignment.findOne({
//       assignedTo: deliveryBoyId,
//       status: { $nin: ["broadcasted", "completed"] },
//     });

//     if (alreadyAssigned) {
//       return NextResponse.json(
//         { message: "you are already assigned to another order" },
//         { status: 400 }
//       );
//     }

//     assignment.assignedTo = deliveryBoyId;
//     assignment.status = "accepted";
//     assignment.acceptedAt = new Date();
//     await assignment.save();

//     const order = await Order.findById(assignment.order).populate("user");
//     if (!order) {
//       return NextResponse.json({ message: "order not found" }, { status: 404 });
//     }

//     order.assignedDeliveryBoy = deliveryBoyId;
//     await order.save();

//     // Remove this delivery boy from other broadcasted assignments
//     await DeliveryAssignment.updateMany(
//       {
//         _id: { $ne: assignment._id },
//         broadcastTo: deliveryBoyId,  // ← fixed from broadcastedTo
//         status: "broadcasted",
//       },
//       {
//         $pull: { broadcastTo: deliveryBoyId },  // ← fixed from broadcastedTo
//       }
//     );

//     // Notify the customer via their socket
//     const customerSocketId = order.user?.socketId;
//     await emitEventHandler("order-accepted", {
//       orderId: order._id,
//       assignmentId: assignment._id,
//       deliveryBoyId,
//       message: "Your order has been accepted and is on the way!",
//     }, customerSocketId);

//     return NextResponse.json(
//       { message: "order accepted successfully", orderId: order._id },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Accept error:", error);
//     return NextResponse.json({ message: "accept assignment error" }, { status: 500 });
//   }
// }