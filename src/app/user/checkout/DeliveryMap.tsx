'use client'

import React, { useEffect, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'

// Fix default leaflet icon paths broken by webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/* ─── Custom green pin ─── */
const greenIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  shadowSize:  [41, 41],
})

/* ─── Pans map when position prop changes ─── */
const MapPanner: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(position as LatLngExpression, 15, { animate: true })
  }, [position, map])
  return null
}

/* ─── GeoSearch control ─── */
interface GeoSearchProps {
  onResult: (lat: number, lng: number, label: string) => void
}

const GeoSearchBar: React.FC<GeoSearchProps> = ({ onResult }) => {
  const map      = useMap()
  const addedRef = useRef(false)

  useEffect(() => {
    if (addedRef.current) return
    addedRef.current = true

    let searchControl: any = null

    const init = async () => {
      try {
        // Dynamic import avoids SSR issues with leaflet-geosearch
        const { GeoSearchControl, OpenStreetMapProvider } = await import('leaflet-geosearch')

        const provider = new OpenStreetMapProvider({
          params: { countrycodes: 'in', addressdetails: 1 },
        })

        searchControl = new (GeoSearchControl as any)({
          provider,
          style:           'bar',
          showMarker:      false,
          showPopup:       false,
          autoClose:       true,
          retainZoomLevel: false,
          animateZoom:     true,
          keepResult:      true,
          searchLabel:     'Search city, area, street…',
        })

        map.addControl(searchControl)

        // Fired when user picks a result from the list
        map.on('geosearch/showlocation', (e: any) => {
          const { x: lng, y: lat, label } = e.location
          onResult(Number(lat), Number(lng), label as string)
        })
      } catch (err) {
        console.error('GeoSearch init error:', err)
      }
    }

    init()

    return () => {
      if (searchControl) {
        try { map.removeControl(searchControl) } catch {}
      }
      map.off('geosearch/showlocation')
    }
  }, [map, onResult])

  return null
}

/* ─── Props ─── */
export interface DeliveryMapProps {
  position:  [number, number]
  onDragEnd: (lat: number, lng: number) => void
  onSearch:  (lat: number, lng: number, label: string) => void
}

/* ─── Main export ─── */
export default function DeliveryMap({ position, onDragEnd, onSearch }: DeliveryMapProps) {
  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <GeoSearchBar onResult={onSearch} />
      <MapPanner    position={position} />

      <Marker
        icon={greenIcon}
        position={position as LatLngExpression}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = (e.target as L.Marker).getLatLng()
            onDragEnd(lat, lng)
          },
        }}
      />
    </MapContainer>
  )
}