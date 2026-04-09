import { auth } from "@/auth";
// app/api/delivery/get-assignments/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch assignments that are:
    // - broadcasted and NOT rejected by this delivery boy
    // - OR accepted by this delivery boy
    const assignments = await DeliveryAssignment.find({
      $or: [
        {
          status: "broadcasted",
          rejectedBy: { $nin: [userId] },
        },
        {
          status: "accepted",
          deliveryBoy: userId,
        },
        {
          status: "delivered",
          deliveryBoy: userId,
        },
      ],
    })
      .populate("order")
      .sort({ createdAt: -1 });

    return NextResponse.json(assignments);
  } catch (error: any) {
    console.error("[get-assignments]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// import { auth } from "@/auth";
// import connectDB from "@/lib/db";
// import DeliveryAssignment from "@/models/deliveryAssignment.model";
// import { NextResponse } from "next/server";


// export async function GET(){
//     try{
//         await connectDB()
//         const session = await auth()
//         const assignments = await DeliveryAssignment.find({
//             brodcastedTo:session?.user?.id,
//             status:"brodcasted"
//         }).populate("order")
//         return NextResponse.json(
//             assignments,{status:200}
//         )

//     } catch (error){ 
//         return NextResponse.json(
//             {message:`get assignments error ${error}`},
//             {status:200}
//         )
//     }
// }