// app/api/socket/update-location/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import emitEventHandler from "@/lib/emitEventHandler";
import User from "@/models/user.models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, location } = await req.json();
    // location = { type: "Point", coordinates: [longitude, latitude] }

    // Update delivery boy's location in DB
    await User.findByIdAndUpdate(userId, { location });

    // Find active assignment for this delivery boy
    const activeAssignment = await DeliveryAssignment.findOne({
      deliveryBoy: userId,
      status: "accepted",
    }).populate("order");

    if (activeAssignment) {
      const order = await Order.findById(activeAssignment.order._id);
      const customer = await User.findById(order?.userId);

      // Push live location to the customer
      if (customer?.socketId) {
        await emitEventHandler(
          "delivery-location-update",
          {
            assignmentId: activeAssignment._id,
            orderId: order?._id,
            latitude: location.coordinates[1],
            longitude: location.coordinates[0],
          },
          customer.socketId
        );
      }

      // Also push to admin broadcast (no socketId = all)
      await emitEventHandler("admin-delivery-location", {
        assignmentId: activeAssignment._id,
        orderId: order?._id,
        deliveryBoyId: userId,
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[update-location]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}













// import connectDB from "@/lib/db";
// import User from "@/models/user.models";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest){
//     try{
//         await connectDB()
//         const {userId, location}=await req.json()
//         if(!userId || !location){
//             return NextResponse.json(
//                 {message:"missing userId or location"},
//                 {status:400}
//             )
//         }

//         const user=await User.findByIdAndUpdate(userId,(location))
//         if(!user){
//             return NextResponse.json(
//                 { message: "user not found" },
//                 { status: 400 }
//             )
//         }
//          return NextResponse.json(
//                 { message: "location updated" },
//                 { status: 400 }
//             )
//     }catch(error){
//          return NextResponse.json(
//             { message:`update location error $(error)` },
//             { status: 500 }
//          )
//     }
// }





