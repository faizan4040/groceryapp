import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/lib/db"
import DeliveryAssignment from "@/models/deliveryAssignment.model"
import emitEventHandler from "@/lib/emitEventHandler"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    await connectDB()

    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // FIX: await params
    const { assignmentId } = await params

    console.log("🚫 REJECT API CALLED:", assignmentId, userId)

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, message: "Assignment ID missing" },
        { status: 400 }
      )
    }

    const assignment = await DeliveryAssignment.findOneAndUpdate(
      {
        _id: assignmentId,
        status: "broadcasted",
        broadcastedTo: userId,
        rejectedBy: { $ne: userId },
      },
      {
        $addToSet: { rejectedBy: userId },
      },
      { new: true }
    )

    if (!assignment) {
      return NextResponse.json(
        { success: false, message: "Already rejected or not available" },
        { status: 409 }
      )
    }

    const broadcastedTo = (assignment.broadcastedTo || []).map(String)
    const rejectedBy = (assignment.rejectedBy || []).map(String)

    if (
      broadcastedTo.length > 0 &&
      rejectedBy.length >= broadcastedTo.length
    ) {
      assignment.status = "failed"
      await assignment.save()

      await emitEventHandler("assignment-failed", {
        assignmentId: assignment._id.toString(),
      })
    }

    await emitEventHandler("delivery-rejected", {
      assignmentId: assignment._id.toString(),
      deliveryBoyId: userId,
    })

    return NextResponse.json({
      success: true,
      message: "Rejected successfully",
    })
  } catch (error: any) {
    console.error("Reject error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
      },
      { status: 500 }
    )
  }
}