import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db'
import DeliveryAssignment from '@/models/deliveryAssignment.model'

export async function GET(req: NextRequest) {
  try {
    console.log(' [GET /api/delivery/get-assignments] - CALLED')

    await connectDB()

    const session = await auth()
    const userId = session?.user?.id

    console.log('👤 User:', userId)

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
          assignments: [],
        },
        { status: 401 }
      )
    }

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: { $in: [userId] },
      status: { $in: ['broadcasted', 'assigned'] },
    })
      .populate({
        path: 'order',
        select: '_id totalAmount status address paymentMethod items userId',
      })

      // ADD THIS
      .populate({
        path: 'broadcastedTo',
        select: 'name phone',
      })

      // ADD THIS
      .populate({
        path: 'assignedTo',
        select: 'name phone',
      })

      .sort({ createdAt: -1 })

    console.log(' Found:', assignments.length)

    return NextResponse.json(
      {
        success: true,
        assignments: assignments || [],
        count: assignments.length,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(' ERROR:', error)
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
        assignments: [],
      },
      { status: 500 }
    )
  }
}




