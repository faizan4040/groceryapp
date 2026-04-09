// app/api/delivery/reject/[assignmentId]/route.ts
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import mongoose from "mongoose";   // ← add this
import DeliveryAssignment from "@/models/deliveryAssignment.model";

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

    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ success: false, message: "Assignment not found" }, { status: 404 });
    }

    // Add this delivery boy to rejectedBy list (so they don't see it again)
    if (!assignment.rejectedBy) assignment.rejectedBy = [];
    assignment.rejectedBy.push(new mongoose.Types.ObjectId(session.user.id));

    // If everyone rejected, mark as failed (optional logic)
    await assignment.save();

    return NextResponse.json({ success: true, message: "Rejected" });
  } catch (error: any) {
    console.error("[reject-assignment]", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}





// import { auth } from "@/auth";
// import connectDB from "@/lib/db";
// import DeliveryAssignment from "@/models/deliveryAssignment.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(
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

//     const assignment = await DeliveryAssignment.findById(id);

//     if (!assignment) {
//       return NextResponse.json({ message: "assignment not found" }, { status: 404 });
//     }

//     // Remove this delivery boy from broadcastTo list
//     assignment.broadcastTo = assignment.broadcastTo.filter(
//       (id: any) => String(id) !== String(deliveryBoyId)
//     );

//     // If no more candidates, mark as failed
//     if (assignment.broadcastTo.length === 0) {
//       assignment.status = "failed";
//     }

//     await assignment.save();

//     return NextResponse.json({ message: "order rejected" }, { status: 200 });
//   } catch (error) {
//     console.error("Reject error:", error);
//     return NextResponse.json({ message: "reject assignment error" }, { status: 500 });
//   }
// }