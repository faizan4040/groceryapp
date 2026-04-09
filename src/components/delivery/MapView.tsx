'use client'

// components/delivery/MapView.tsx
// Leaflet-based live map — dynamically imported (no SSR)
// Shows: delivery boy current location + customer destination + route line

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  deliveryLocation: { lat: number; lng: number } | null
  destinationLat: number | null
  destinationLng: number | null
}

const MapView = ({ deliveryLocation, destinationLat, destinationLng }: MapViewProps) => {
  const mapRef     = useRef<any>(null)
  const mapElRef   = useRef<HTMLDivElement>(null)
  const boyMarker  = useRef<any>(null)
  const destMarker = useRef<any>(null)
  const polyline   = useRef<any>(null)

  // ── Initialize map ──
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return

    const L = require('leaflet')

    // Fix default icon paths broken by webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })

    const initialCenter =
      deliveryLocation
        ? [deliveryLocation.lat, deliveryLocation.lng]
        : destinationLat && destinationLng
        ? [destinationLat, destinationLng]
        : [20.5937, 78.9629] // India centre fallback

    mapRef.current = L.map(mapElRef.current).setView(initialCenter, 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current)

    // Delivery boy icon (green bike)
    const bikeIcon = L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)">🛵</div>`,
      iconSize:   [36, 36],
      iconAnchor: [18, 18],
    })

    // Destination icon (red pin)
    const destIcon = L.divIcon({
      className: '',
      html: `<div style="width:36px;height:36px;background:#ef4444;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"><span style="transform:rotate(45deg);font-size:16px">📦</span></div>`,
      iconSize:   [36, 36],
      iconAnchor: [18, 36],
    })

    // Add delivery boy marker
    if (deliveryLocation) {
      boyMarker.current = L.marker([deliveryLocation.lat, deliveryLocation.lng], { icon: bikeIcon })
        .addTo(mapRef.current)
        .bindPopup('🛵 Delivery Boy')
    }

    // Add destination marker
    if (destinationLat && destinationLng) {
      destMarker.current = L.marker([destinationLat, destinationLng], { icon: destIcon })
        .addTo(mapRef.current)
        .bindPopup('📦 Delivery Address')
        .openPopup()
    }

    // Draw route line
    if (deliveryLocation && destinationLat && destinationLng) {
      polyline.current = L.polyline(
        [[deliveryLocation.lat, deliveryLocation.lng], [destinationLat, destinationLng]],
        { color: '#10b981', weight: 3, dashArray: '6 8', opacity: 0.8 }
      ).addTo(mapRef.current)

      mapRef.current.fitBounds(polyline.current.getBounds(), { padding: [40, 40] })
    }
  }, []) // run once

  // ── Update delivery boy position in real-time ──
  useEffect(() => {
    if (!mapRef.current || !deliveryLocation) return

    const L = require('leaflet')

    if (boyMarker.current) {
      boyMarker.current.setLatLng([deliveryLocation.lat, deliveryLocation.lng])
    } else {
      const bikeIcon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;background:#10b981;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)">🛵</div>`,
        iconSize:   [36, 36],
        iconAnchor: [18, 18],
      })
      boyMarker.current = L.marker([deliveryLocation.lat, deliveryLocation.lng], { icon: bikeIcon })
        .addTo(mapRef.current)
    }

    // Update polyline
    if (destinationLat && destinationLng) {
      if (polyline.current) {
        polyline.current.setLatLngs([
          [deliveryLocation.lat, deliveryLocation.lng],
          [destinationLat, destinationLng],
        ])
      } else {
        polyline.current = L.polyline(
          [[deliveryLocation.lat, deliveryLocation.lng], [destinationLat, destinationLng]],
          { color: '#10b981', weight: 3, dashArray: '6 8', opacity: 0.8 }
        ).addTo(mapRef.current)
      }
    }
  }, [deliveryLocation, destinationLat, destinationLng])

  return <div ref={mapElRef} style={{ width: '100%', height: '100%' }} />
}

export default MapView