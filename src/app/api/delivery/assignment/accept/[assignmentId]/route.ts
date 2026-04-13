import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db'
import DeliveryAssignment from '@/models/deliveryAssignment.model'
import Order from '@/models/order.model'
import emitEventHandler from '@/lib/emitEventHandler'

export async function POST(
  request: Request,
  context: { params: Promise<{ assignmentId: string }> } // 👈 FIX
) {
  try {
    await connectDB()

    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    //  MUST await params
    const { assignmentId } = await context.params

    console.log('🔥 PARAMS:', assignmentId)

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, message: 'Assignment ID missing from URL' },
        { status: 400 }
      )
    }

    const assignment = await DeliveryAssignment.findOneAndUpdate(
      {
        _id: assignmentId,
        status: 'broadcasted',
        broadcastedTo: userId,
      },
      {
        status: 'assigned',
        assignedTo: String(userId),
        acceptedAt: new Date(),
      },
      { new: true }
    ).populate('order')

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: 'Already taken or not available' },
        { status: 409 }
      )
    }

    if (assignment.order?._id) {
      await Order.findByIdAndUpdate(assignment.order._id, {
        assignment: assignment._id,
      })
    }

    try {
      await emitEventHandler('delivery-accepted', {
        assignmentId: String(assignment._id),
        deliveryBoyId: String(userId),
        orderId: String(assignment.order?._id),
      })
    } catch (e) {
      console.warn(' Socket emit warning:', e)
    }

    return NextResponse.json({
      success: true,
      message: 'Order accepted!',
    })
  } catch (error: unknown) {
    console.error(' Accept error:', error)

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    )
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