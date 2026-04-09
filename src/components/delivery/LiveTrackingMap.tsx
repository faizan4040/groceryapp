'use client'

// components/delivery/LiveTrackingMap.tsx
// Customer-facing live tracking page — listens to socket for delivery location updates

import { useEffect, useRef, useState } from 'react'
import { getSocket } from '@/lib/socket'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('../delivery/MapView'), { ssr: false })

interface LiveTrackingMapProps {
  orderId: string
  destinationLat?: number | null
  destinationLng?: number | null
}

const LiveTrackingMap = ({ orderId, destinationLat, destinationLng }: LiveTrackingMapProps) => {
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isDelivered, setIsDelivered] = useState(false)
  const [deliveryBoyInfo, setDeliveryBoyInfo] = useState<{ name?: string; phone?: string } | null>(null)

  useEffect((): any => {
    const socket = getSocket()

    // Delivery boy accepted
    socket.on('delivery-accepted', (data: any) => {
      if (data.orderId === orderId) {
        setDeliveryBoyInfo(data.deliveryBoy)
      }
    })

    // Location updates
    socket.on('delivery-location-update', (data: any) => {
      if (data.orderId === orderId) {
        setDeliveryLocation({ lat: data.latitude, lng: data.longitude })
      }
    })

    // Order delivered
    socket.on('order-delivered', (data: any) => {
      if (data.orderId === orderId) {
        setIsDelivered(true)
      }
    })

    return () => {
      socket.off('delivery-accepted')
      socket.off('delivery-location-update')
      socket.off('order-delivered')
    }
  }, [orderId])

  if (isDelivered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-black text-emerald-600">Order Delivered!</h2>
        <p className="text-gray-500">Your groceries have arrived. Enjoy!</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {deliveryBoyInfo && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">🛵</div>
          <div>
            <p className="text-sm font-bold text-gray-800">{deliveryBoyInfo.name ?? 'Delivery Partner'}</p>
            <p className="text-xs text-gray-500">{deliveryBoyInfo.phone ?? ''}</p>
            <p className="text-xs text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              On the way to you
            </p>
          </div>
        </div>
      )}

      {!deliveryLocation && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-sm text-amber-700 font-medium text-center">
          ⏳ Waiting for delivery partner to start moving…
        </div>
      )}

      <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <MapView
          deliveryLocation={deliveryLocation}
          destinationLat={destinationLat ?? null}
          destinationLng={destinationLng ?? null}
        />
      </div>

      <p className="text-[11px] text-gray-400 text-center">
        Map updates every 5 seconds · Powered by OpenStreetMap
      </p>
    </div>
  )
}

export default LiveTrackingMap