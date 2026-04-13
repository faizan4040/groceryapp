// ════════════════════════════════════════════════════════════════════
// FILE: app/api/delivery/assignment/reject/[assignmentId]/route.ts
// ════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db'
import DeliveryAssignment from '@/models/deliveryAssignment.model'
import emitEventHandler from '@/lib/emitEventHandler'

export async function POST(
  request: Request,
  context: { params: { assignmentId: string } }
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

    // FIXED: match folder name
    const assignmentId = context?.params?.assignmentId

    console.log(' PARAMS:', context?.params)

    if (!assignmentId) {
      return NextResponse.json(
        { success: false, message: 'Assignment ID missing from URL' },
        { status: 400 }
      )
    }

    console.log(' Reject called — assignmentId:', assignmentId, 'userId:', userId)

    // Atomic update (no duplicate reject)
    const assignment = await DeliveryAssignment.findOneAndUpdate(
      {
        _id: assignmentId,
        status: 'broadcasted',
        broadcastedTo: userId,
        rejectedBy: { $ne: userId },
      },
      {
        $addToSet: { rejectedBy: String(userId) },
      },
      { new: true }
    )

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Already rejected or not available',
        },
        { status: 409 }
      )
    }

    // Check if all delivery boys rejected
    const broadcastedTo = (assignment.broadcastedTo || []).map(String)
    const rejectedBy = (assignment.rejectedBy || []).map(String)

    if (
      broadcastedTo.length > 0 &&
      rejectedBy.length >= broadcastedTo.length
    ) {
      assignment.status = 'failed'
      await assignment.save()

      // Emit failure event
      try {
        await emitEventHandler('assignment-failed', {
          assignmentId: String(assignment._id),
        })
      } catch (e) {
        console.warn(' Socket emit warning:', e)
      }
    }

    // Remove from UI instantly
    try {
      await emitEventHandler('delivery-rejected', {
        assignmentId: String(assignment._id),
        deliveryBoyId: String(userId),
      })
    } catch (e) {
      console.warn(' Socket emit warning:', e)
    }

    return NextResponse.json({
      success: true,
      message: 'Order rejected',
    })
  } catch (error: unknown) {
    console.error(' Reject error:', error)

    const message =
      error instanceof Error ? error.message : 'Server error'

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    )
  }
}





