import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/lib/db"
import Order from "@/models/order.model"
import DeliveryAssignment from "@/models/deliveryAssignment.model"
import User from "@/models/user.models"
import emitEventHandler from "@/lib/emitEventHandler"

export async function PUT(req: NextRequest) {
  try {
    console.log(" [PUT /api/admin/update-order]")

    await connectDB()

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { orderId, status, isPaid } = await req.json()

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID required" },
        { status: 400 }
      )
    }

    //  Get order
    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      )
    }

    //  Update basic fields
    if (status !== undefined) order.status = status
    if (isPaid !== undefined) order.isPaid = isPaid

    //  BROADCAST LOGIC
    if (status === "out for delivery" && !order.assignment) {
      console.log("🚚 Broadcasting order for delivery")

      const { latitude, longitude } = order.address || {}

      if (latitude && longitude) {
        //  Find nearby delivery boys
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
        })

        console.log("📍 Found nearby delivery boys:", nearByDeliveryBoys.length)

        const nearByIds = nearByDeliveryBoys.map((b) => b._id.toString()) //  Convert to string

        //  Filter busy delivery boys
        const busyAssignments = await DeliveryAssignment.find({
          assignedTo: { $in: nearByIds },
          status: { $nin: ["broadcasted", "completed", "failed"] },
        })

        const busyIds = new Set(
          busyAssignments.map((a) => a.assignedTo?.toString())
        )

        const availableDeliveryBoys = nearByDeliveryBoys.filter(
          (b) => !busyIds.has(b._id.toString())
        )

        console.log(" Available delivery boys:", availableDeliveryBoys.length)

        const candidates = availableDeliveryBoys.map((b) => b._id.toString()) //  String

        if (candidates.length > 0) {
          //  Create assignment with string IDs
          const deliveryAssignment = await DeliveryAssignment.create({
            order: order._id,
            broadcastedTo: candidates, //  Array of strings
            status: "broadcasted",
          })

          order.assignment = deliveryAssignment._id

          console.log("📢 Broadcasting to delivery boys...")

          //  Emit socket event
          await emitEventHandler("new-delivery-request", {
            orderId: order._id,
            assignmentId: deliveryAssignment._id,
            orderTotal: order.totalAmount,
            paymentMethod: order.paymentMethod,
            address: order.address,
            items: order.items,
            candidates: availableDeliveryBoys.map((b) => ({
              id: b._id.toString(), //  String
              name: b.name,
              mobile: b.mobile,
            })),
          })
        } else {
          console.log("⚠️ No available delivery boys")
        }
      }
    }

    //  Sync assignment status
    if (status && order.assignment) {
      const statusMap: Record<
        string,
        "broadcasted" | "assigned" | "completed" | "failed"
      > = {
        delivered: "completed",
        cancelled: "completed",
        "out for delivery": "broadcasted", //  Don't set to assigned here
      }

      const newStatus = statusMap[status]
      if (newStatus) {
        await DeliveryAssignment.findByIdAndUpdate(order.assignment, {
          status: newStatus,
        })
      }
    }

    await order.save()

    console.log(" Order updated")

    //  Emit event
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("❌ Update order error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    )
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


