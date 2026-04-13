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

    // Get order
    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      )
    }

    // Update fields
    if (status !== undefined) order.status = status
    if (isPaid !== undefined) order.isPaid = isPaid

    // BROADCAST LOGIC (FIXED FOR MULTIPLE ORDERS)
    if (status === "out for delivery" && !order.assignment) {
      console.log(" Broadcasting order...")

      const { latitude, longitude } = order.address || {}

      if (latitude && longitude) {
        //  Find ALL nearby delivery boys (NO BUSY FILTER )
        const nearByDeliveryBoys = await User.find({
          role: "deliveryBoy",
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [Number(longitude), Number(latitude)],
              },
              $maxDistance: 10000, // 10km
            },
          },
        })

        console.log(" Found delivery boys:", nearByDeliveryBoys.length)

        if (nearByDeliveryBoys.length > 0) {
          //  Create assignment (MULTIPLE ORDERS ALLOWED)
          const deliveryAssignment = await DeliveryAssignment.create({
            order: order._id,
            broadcastedTo: nearByDeliveryBoys.map((b) => b._id), // ObjectId
            status: "broadcasted",
          })

          order.assignment = deliveryAssignment._id

          console.log(" Sending socket event...")

          //  Emit socket event to ALL delivery boys
          await emitEventHandler("new-delivery-request", {
            orderId: order._id,
            assignmentId: deliveryAssignment._id,
            orderTotal: order.totalAmount,
            paymentMethod: order.paymentMethod,
            address: order.address,
            items: order.items,
            candidates: nearByDeliveryBoys.map((b) => ({
              id: b._id.toString(),
              name: b.name,
              mobile: b.mobile,
            })),
          })
        } else {
          console.log(" No delivery boys found nearby")
        }
      }
    }

    //  ASSIGNMENT STATUS SYNC
    if (status && order.assignment) {
      if (status === "delivered") {
        console.log(" Delivered → completing assignment")

        await DeliveryAssignment.findByIdAndUpdate(order.assignment, {
          status: "completed",
        })
      }

      if (status === "cancelled") {
        console.log(" Cancelled → failing assignment")

        await DeliveryAssignment.findByIdAndUpdate(order.assignment, {
          status: "failed",
        })
      }
    }

    await order.save()

    console.log(" Order updated")

    //  Emit order update
    await emitEventHandler("order-status-update", {
      orderId: order._id,
      status: order.status,
    })

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    })
  } catch (error: any) {
    console.error(" Update order error:", error)

    return NextResponse.json(
      { success: false, message: error?.message || "Server error" },
      { status: 500 }
    )
  }
}


