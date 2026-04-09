import { auth } from "@/auth";
// app/api/admin/update-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";            // your DB connect helper
import Order from "@/models/order.model";    // your Order model
import DeliveryAssignment from "@/models/deliveryAssignment.model";
     // to find available delivery boys
import emitEventHandler from "@/lib/emitEventHandler";
import User from "@/models/user.models";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { orderId, status, isPaid } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: "orderId is required" }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, isPaid },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // ── When admin sets order to "out for delivery" → broadcast to delivery boys ──
    if (status === "out for delivery") {
      // 1. Find available delivery boys (role: "delivery")
      const deliveryBoys = await User.find({ role: "delivery" });

      if (deliveryBoys.length > 0) {
        // 2. Create a DeliveryAssignment document
        const assignment = await DeliveryAssignment.create({
          order: order._id,
          status: "broadcasted",
          deliveryBoy: null,
        });

        const populatedAssignment = await DeliveryAssignment.findById(assignment._id).populate("order");

        // 3. Broadcast to ALL delivery boys via socket (they see Accept/Reject)
        //    We emit to each delivery boy's socketId stored in their user doc
        for (const boy of deliveryBoys) {
          if (boy.socketId) {
            await emitEventHandler("new-assignment", populatedAssignment, boy.socketId);
          }
        }
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("[update-order]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}




// // app/api/admin/update-order/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import connectDB from '@/lib/db'
// import Order from '@/models/order.model'


// export async function PUT(req: NextRequest) {
//   try {
//     await connectDB()
//     const body = await req.json()
//     const { orderId, status, isPaid } = body  

//     console.log("BODY:", body)

//     if (!orderId) {
//       return NextResponse.json({ success: false, message: 'Order ID required' }, { status: 400 })
//     }

//     if (status === undefined && isPaid === undefined) {
//       return NextResponse.json({ success: false, message: 'No data to update' }, { status: 400 })
//     }

//     const updateData: Record<string, unknown> = {}

//     if (status !== undefined) updateData.status = status
//     if (isPaid !== undefined) updateData.isPaid = isPaid  // ← boolean, not a string

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { $set: updateData },
//       { new: true, runValidators: true }  // ← use `new: true` instead of returnDocument
//     )

//     if (!updatedOrder) {
//       return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 })
//     }

//     return NextResponse.json({ success: true, order: updatedOrder })

//   } catch (error) {
//     console.error('Update order error:', error)
//     return NextResponse.json({ success: false, message: 'Failed to update order' }, { status: 500 })
//   }
// }


