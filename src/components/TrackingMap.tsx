'use client'

import { useEffect, useRef, useState } from 'react'
import { getSocket } from '@/lib/socket'

interface Props {
  orderId: string
  deliveryLat?: number
  deliveryLng?: number
  destinationLat: number
  destinationLng: number
}

const TrackingMap = ({ orderId, destinationLat, destinationLng }: Props) => {
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const mapDivRef = useRef<HTMLDivElement>(null)
  const [eta] = useState("30 minutes")
  const [status, setStatus] = useState("Delivery boy on the way")

  useEffect(() => {
    if (typeof window === 'undefined' || !mapDivRef.current) return

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      if (mapRef.current) return // already initialised

      // Custom biker icon
      const bikerIcon = L.divIcon({
        html: `<div style="
          background:#16a34a;
          border:3px solid white;
          border-radius:50%;
          width:36px;height:36px;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;
          box-shadow:0 2px 8px rgba(0,0,0,0.3)
        ">🚴</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        className: '',
      })

      const destIcon = L.divIcon({
        html: `<div style="
          background:#dc2626;
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          width:28px;height:28px;
          box-shadow:0 2px 8px rgba(0,0,0,0.3)
        "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: '',
      })

      const map = L.map(mapDivRef.current!).setView(
        [destinationLat, destinationLng],
        14
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // Destination marker
      L.marker([destinationLat, destinationLng], { icon: destIcon })
        .addTo(map)
        .bindPopup('Delivery address')

      // Biker marker (starts at destination, will update via socket)
      markerRef.current = L.marker([destinationLat, destinationLng], {
        icon: bikerIcon,
      })
        .addTo(map)
        .bindPopup('Delivery boy')

      mapRef.current = map
    })
  }, [destinationLat, destinationLng])

  useEffect(() => {
    const socket = getSocket()

    socket.on(`location-update-${orderId}`, ({ latitude, longitude }: any) => {
      if (markerRef.current && mapRef.current) {
        const newLatLng = [latitude, longitude]
        markerRef.current.setLatLng(newLatLng as any)
        mapRef.current.panTo(newLatLng as any)
      }
    })

    socket.on(`order-delivered-${orderId}`, () => {
      setStatus("Order delivered!")
    })

    return () => {
      socket.off(`location-update-${orderId}`)
      socket.off(`order-delivered-${orderId}`)
    }
  }, [orderId])

  return (
    <div className="w-full">
      {/* Status bar */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">{status}</p>
          <p className="text-green-100 text-xs mt-0.5">Estimated arrival: {eta}</p>
        </div>
        <span className="text-2xl">🚴</span>
      </div>

      {/* Map */}
      <div
        ref={mapDivRef}
        style={{ height: '420px', width: '100%' }}
        className="rounded-b-xl overflow-hidden border border-green-100"
      />
    </div>
  )
}

export default TrackingMap