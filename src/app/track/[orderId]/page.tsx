import { auth } from "@/auth";
// app/track/[orderId]/page.tsx
// Customer order tracking page — shows live map when order is out for delivery

import { redirect } from "next/navigation"
import connectDB from "@/lib/db"
import Order from "@/models/order.model"
import LiveTrackingMap from "@/components/delivery/LiveTrackingMap"

interface Props {
  params: { orderId: string }
}

export default async function TrackOrderPage({ params }: Props) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  await connectDB()
  const order = await Order.findById(params.orderId).lean() as any

  if (!order || order.userId.toString() !== session.user.id) {
    redirect("/orders")
  }

  const isOutForDelivery = ["out for delivery", "shipped"].includes(order.status)

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-1">Track Order</h1>
      <p className="text-sm text-gray-400 font-mono mb-6">#{params.orderId.slice(-10)}</p>

      {isOutForDelivery ? (
        <LiveTrackingMap
          orderId={params.orderId}
          destinationLat={order.address?.latitude ?? null}
          destinationLng={order.address?.longitude ?? null}
        />
      ) : (
        <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-semibold">Live tracking starts when your order is out for delivery.</p>
          <p className="text-sm mt-1 text-gray-400">Current status: <span className="font-bold capitalize">{order.status}</span></p>
        </div>
      )}
    </div>
  )
}