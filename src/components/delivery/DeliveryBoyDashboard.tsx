'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { getSocket } from '@/lib/socket'
import {
  FiTruck,
  FiRefreshCw,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiNavigation,
  FiAlertCircle,
  FiInbox,
  FiLoader,
  FiMessageSquare,
} from 'react-icons/fi'

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderAddress {
  street?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  pincode?: string
  zipCode?: string
  latitude?: number
  longitude?: number
  lat?: number
  lng?: number
  fullAddress?: string
  formatted?: string
}

interface Order {
  _id: string
  totalAmount: number
  status: string
  address: OrderAddress
  paymentMethod: string
  items: any[]
}

interface Assignment {
  _id: string
  order: Order
  status: 'broadcasted' | 'assigned'
  broadcastedTo: string[]
  createdAt: string
  acceptedAt?: string
}

// ─── Address Helpers ──────────────────────────────────────────────────────────
function getStreet(addr?: OrderAddress): string {
  if (!addr) return 'Address not provided'
  return (
    addr.street ||
    addr.addressLine1 ||
    addr.fullAddress ||
    addr.formatted ||
    'Address not provided'
  )
}

function getCityLine(addr?: OrderAddress): string {
  if (!addr) return ''
  const parts: string[] = []
  if (addr.addressLine2) parts.push(addr.addressLine2)
  if (addr.city) parts.push(addr.city)
  if (addr.state) parts.push(addr.state)
  const pin = addr.postalCode || addr.pincode || addr.zipCode
  if (pin) parts.push(pin)
  return parts.join(', ')
}

function getCoords(addr?: OrderAddress): { lat: number; lng: number } | null {
  if (!addr) return null
  const lat = addr.latitude ?? addr.lat
  const lng = addr.longitude ?? addr.lng
  if (lat != null && lng != null) return { lat: Number(lat), lng: Number(lng) }
  return null
}

function normalizeAssignment(a: any): Assignment {
  return {
    ...a,
    _id: String(a._id),
    order: {
      ...a.order,
      _id: String(a.order?._id ?? ''),
      address: a.order?.address ?? {},
      items: a.order?.items ?? [],
      paymentMethod: a.order?.paymentMethod ?? 'cod',
      totalAmount: Number(a.order?.totalAmount ?? 0),
    },
    broadcastedTo: (a.broadcastedTo || []).map(String),
  }
}

// ─── Live Map + Timer ─────────────────────────────────────────────────────────
const LiveMapView = ({ order, acceptedAt }: { order: Order; acceptedAt?: string }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [myPos, setMyPos] = useState<{ lat: number; lng: number } | null>(null)
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const [mapReady, setMapReady] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const watchRef = useRef<number | null>(null)
  const mapObj = useRef<any>(null)
  const riderMarker = useRef<any>(null)
  const routeLine = useRef<any>(null)

  useEffect(() => {
    const start = acceptedAt ? new Date(acceptedAt).getTime() : Date.now()
    const deadline = start + 30 * 60 * 1000
    const tick = () => setTimeLeft(Math.max(0, Math.floor((deadline - Date.now()) / 1000)))
    tick()
    timerRef.current = setInterval(tick, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [acceptedAt])

  useEffect(() => {
    if (!navigator.geolocation) return
    watchRef.current = navigator.geolocation.watchPosition(
      (p) => setMyPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => console.warn('GPS:', e),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )
    return () => { if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current) }
  }, [])

  // useEffect(() => {
  //   if (!mapRef.current || mapReady) return
  //   const init = async () => {
  //     if (!document.getElementById('leaflet-css')) {
  //       const link = document.createElement('link')
  //       link.id = 'leaflet-css'
  //       link.rel = 'stylesheet'
  //       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  //       document.head.appendChild(link)
  //     }
  //     if (!(window as any).L) {
  //       await new Promise<void>((res) => {
  //         const s = document.createElement('script')
  //         s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  //         s.onload = () => res()
  //         document.head.appendChild(s)
  //       })
  //     }
  //     const L = (window as any).L
  //     const dest = getCoords(order.address)
  //     const center = dest ?? { lat: 26.9124, lng: 75.7873 }
  //     const map = L.map(mapRef.current!, { zoomControl: true, scrollWheelZoom: false })
  //     mapObj.current = map
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       attribution: '© OpenStreetMap',
  //       maxZoom: 19,
  //     }).addTo(map)
  //     if (dest) {
  //       const destIcon = L.divIcon({
  //         className: '',
  //         html: `<div style="background:#ef4444;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid white;box-shadow:0 4px 10px rgba(239,68,68,0.5)"></div>`,
  //         iconSize: [28, 28],
  //         iconAnchor: [14, 28],
  //       })
  //       L.marker([dest.lat, dest.lng], { icon: destIcon })
  //         .addTo(map)
  //         .bindPopup(`<b>Drop Point</b><br>${getStreet(order.address)}`)
  //     }
  //     map.setView([center.lat, center.lng], 14)
  //     setMapReady(true)
  //   }
  //   init()
  // }, [order, mapReady])

  useEffect(() => {
  if (!mapRef.current) return

  const init = async () => {
    //  prevent duplicate init
    if (mapObj.current) return

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!(window as any).L) {
      await new Promise<void>((res) => {
        const s = document.createElement('script')
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        s.onload = () => res()
        document.head.appendChild(s)
      })
    }

    const L = (window as any).L

    const map = L.map(mapRef.current!, {
      zoomControl: true,
      scrollWheelZoom: false,
    })

    mapObj.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    map.setView([26.9124, 75.7873], 14)
  }

  init()

  //  cleanup on unmount
  return () => {
    if (mapObj.current) {
      mapObj.current.remove()
      mapObj.current = null
    }
  }
}, []) //  IMPORTANT: empty dependency

  useEffect(() => {
    if (!mapReady || !myPos) return
    const L = (window as any).L
    const map = mapObj.current
    if (!L || !map) return
    const icon = L.divIcon({
      className: '',
      html: `<div style="background:#2563eb;width:34px;height:34px;border-radius:50%;border:3px solid white;box-shadow:0 4px 14px rgba(37,99,235,0.5);display:flex;align-items:center;justify-content:center;font-size:15px;">🏍</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    })
    if (riderMarker.current) {
      riderMarker.current.setLatLng([myPos.lat, myPos.lng])
    } else {
      riderMarker.current = L.marker([myPos.lat, myPos.lng], { icon }).addTo(map)
    }
    const dest = getCoords(order.address)
    if (dest) {
      if (routeLine.current) map.removeLayer(routeLine.current)
      routeLine.current = L.polyline(
        [[myPos.lat, myPos.lng], [dest.lat, dest.lng]],
        { color: '#2563eb', weight: 3, dashArray: '8 5', opacity: 0.7 }
      ).addTo(map)
      map.fitBounds([[myPos.lat, myPos.lng], [dest.lat, dest.lng]], { padding: [40, 40] })
    }
  }, [myPos, mapReady, order])

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  const pct = (timeLeft / (30 * 60)) * 100
  const color = timeLeft > 600 ? '#16a34a' : timeLeft > 300 ? '#d97706' : '#dc2626'

  return (
    <div className="border-t border-gray-100 px-4 pb-4 pt-3 bg-slate-50">
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <FiClock size={12} className="text-gray-400" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-1">
            Estimated Delivery Time
          </span>
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {fmt(timeLeft)}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        {timeLeft === 0 && (
          <p className="text-[11px] text-red-600 font-semibold mt-1">
            Time exceeded — please deliver immediately!
          </p>
        )}
      </div>
      <div className="relative rounded-xl overflow-hidden border border-gray-200">
        <div ref={mapRef} style={{ height: 260, width: '100%' }} />
        {!mapReady && (
          <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400">
            <FiLoader size={22} className="animate-spin" />
            <span className="text-xs font-semibold">Loading map…</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            myPos ? 'bg-green-500 shadow-[0_0_0_3px_rgba(22,163,74,0.2)]' : 'bg-gray-300'
          }`}
        />
        <span className="text-[11px] text-gray-400 font-medium">
          {myPos
            ? `Live GPS — ${myPos.lat.toFixed(5)}, ${myPos.lng.toFixed(5)}`
            : 'Waiting for GPS signal…'}
        </span>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssignments = useCallback(async () => {
    try {
      setInitialLoading(true)
      setError(null)
      const res = await axios.get('/api/delivery/get-assignments')
      if (res.data.success) {
        setAssignments((res.data.assignments || []).map(normalizeAssignment))
      } else {
        setError(res.data.message || 'Failed to load assignments')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load assignments')
    } finally {
      setInitialLoading(false)
    }
  }, [])

  useEffect(() => { fetchAssignments() }, [fetchAssignments])

  useEffect(() => {
    const socket = getSocket()
    socket.on('new-delivery-request', (data: any) => {
      const a: Assignment = normalizeAssignment({
        _id: data.assignmentId,
        order: {
          _id: data.orderId,
          totalAmount: data.orderTotal || 0,
          status: 'out for delivery',
          address: data.address || {},
          paymentMethod: data.paymentMethod || 'cod',
          items: data.items || [],
        },
        status: 'broadcasted',
        broadcastedTo: (data.candidates || []).map((c: any) => String(c.id)),
        createdAt: new Date().toISOString(),
      })
      setAssignments((prev) => [a, ...prev])
    })
    socket.on('delivery-accepted', (data: any) => {
      setAssignments((prev) => prev.filter((a) => a._id !== String(data.assignmentId)))
    })
    return () => {
      socket.off('new-delivery-request')
      socket.off('delivery-accepted')
    }
  }, [])

  //  KEY FIX: assignmentId goes in the URL, not the body
  // Route is: /api/delivery/assignment/accept/[assignment]
  const handleAccept = async (assignmentId: string) => {
    if (loadingId) return
    try {
      setLoadingId(assignmentId)
      setError(null)

      const res = await axios.post(
        `/api/delivery/assignment/accept/${assignmentId}`
        // No body needed — ID is in the URL
      )

      if (res.data.success) {
        setAssignments((prev) =>
          prev.map((a) =>
            a._id === assignmentId
              ? { ...a, status: 'assigned', acceptedAt: new Date().toISOString() }
              : a
          )
        )
      } else {
        setError(res.data.message || 'Could not accept order')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Accept failed')
    } finally {
      setLoadingId(null)
    }
  }

  //  KEY FIX: same pattern for reject
  const handleReject = async (assignmentId: string) => {
    if (loadingId) return
    try {
      setLoadingId(assignmentId)
      setError(null)

      const res = await axios.post(
        `/api/delivery/assignment/reject/${assignmentId}`
        // No body needed — ID is in the URL
      )

      if (res.data.success) {
        setAssignments((prev) => prev.filter((a) => a._id !== assignmentId))
      } else {
        setError(res.data.message || 'Could not reject order')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Reject failed')
    } finally {
      setLoadingId(null)
    }
  }

  const openMaps = (addr: OrderAddress) => {
    const c = getCoords(addr)
    if (c) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`, '_blank')
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getStreet(addr))}`,
        '_blank'
      )
    }
  }

  const openWhatsApp = (orderId: string) => {
    const msg = `Hi! I am your FreshCart delivery partner. I am heading to deliver your order #${orderId
      .slice(-6)
      .toUpperCase()}. Expected in 30 minutes.`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const newOrders = assignments.filter((a) => a.status === 'broadcasted')
  const activeOrders = assignments.filter((a) => a.status === 'assigned')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <FiTruck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest leading-none">
                FreshCart
              </p>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Delivery Boy</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!initialLoading && newOrders.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {newOrders.length} New
              </span>
            )}
            {!initialLoading && activeOrders.length > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {activeOrders.length} Active
              </span>
            )}
            <button
              onClick={fetchAssignments}
              disabled={initialLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <FiRefreshCw size={12} className={initialLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-5 pb-16">
        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5">
            <FiAlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-700">{error}</p>
              <p className="text-xs text-red-400 mt-0.5">Check server logs if this persists</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-500 transition-colors shrink-0"
            >
              <FiXCircle size={16} />
            </button>
          </div>
        )}

        {/* Loading */}
        {initialLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <FiLoader size={28} className="animate-spin text-blue-500" />
            <p className="text-sm font-semibold">Loading assignments…</p>
          </div>
        )}

        {/* Empty */}
        {!initialLoading && assignments.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FiInbox size={24} className="text-gray-400" />
            </div>
            <h2 className="text-base font-bold text-gray-800">No Orders Yet</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Delivery requests will appear here in real-time
            </p>
            <button
              onClick={fetchAssignments}
              className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Check Again
            </button>
          </div>
        )}

        {/* ── New Orders ── */}
        {!initialLoading && newOrders.length > 0 && (
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Incoming Requests
              </h2>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                {newOrders.length}
              </span>
            </div>

            <div className="space-y-3">
              {newOrders.map((a) => {
                const isThis = loadingId === a._id
                const street = getStreet(a.order.address)
                const city = getCityLine(a.order.address)

                return (
                  <article
                    key={a._id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-[3px] border-l-green-500"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                          Order ID
                        </p>
                        <p className="text-[15px] font-black text-gray-900 font-mono tracking-wider">
                          #{a.order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        New
                      </span>
                    </div>

                    <div className="px-4 py-3 space-y-3">
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                          <FiMapPin size={13} className="text-red-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            Delivery Address
                          </p>
                          <p className="text-sm font-bold text-gray-900 leading-snug">{street}</p>
                          {city && <p className="text-xs text-gray-500 mt-0.5">{city}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                          <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide mb-0.5">
                            Amount
                          </p>
                          <p className="text-sm font-black text-green-700 font-mono leading-none">
                            ₹{a.order.totalAmount.toFixed(0)}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                            Payment
                          </p>
                          <p className="text-xs font-bold text-gray-800 uppercase leading-none">
                            {a.order.paymentMethod || 'COD'}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                            Items
                          </p>
                          <p className="text-xs font-bold text-gray-800 leading-none">
                            {a.order.items?.length ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2.5 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                      <button
                        onClick={() => handleAccept(a._id)}
                        disabled={!!loadingId}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                      >
                        {isThis ? (
                          <><FiLoader size={13} className="animate-spin" /> Accepting…</>
                        ) : (
                          <><FiCheckCircle size={13} /> Accept Order</>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(a._id)}
                        disabled={!!loadingId}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed text-red-600 border border-red-200 text-sm font-bold rounded-xl transition-all active:scale-95"
                      >
                        {isThis ? (
                          <><FiLoader size={13} className="animate-spin" /> Rejecting…</>
                        ) : (
                          <><FiXCircle size={13} /> Reject</>
                        )}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Active Deliveries ── */}
        {!initialLoading && activeOrders.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Active Deliveries
              </h2>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {activeOrders.length}
              </span>
            </div>

            <div className="space-y-3">
              {activeOrders.map((a) => {
                const street = getStreet(a.order.address)
                const city = getCityLine(a.order.address)

                return (
                  <article
                    key={a._id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-[3px] border-l-blue-500"
                  >
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-50/40 border-b border-gray-100">
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                          Order ID
                        </p>
                        <p className="text-[15px] font-black text-gray-900 font-mono tracking-wider">
                          #{a.order._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
                        <FiCheckCircle size={10} />
                        Accepted
                      </span>
                    </div>

                    <div className="px-4 py-3 space-y-3">
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                          <FiMapPin size={13} className="text-red-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                            Delivery Address
                          </p>
                          <p className="text-sm font-bold text-gray-900 leading-snug">{street}</p>
                          {city && <p className="text-xs text-gray-500 mt-0.5">{city}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                          <p className="text-[9px] font-bold text-green-600 uppercase tracking-wide mb-0.5">
                            Amount
                          </p>
                          <p className="text-sm font-black text-green-700 font-mono leading-none">
                            ₹{a.order.totalAmount.toFixed(0)}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                            Payment
                          </p>
                          <p className="text-xs font-bold text-gray-800 uppercase leading-none">
                            {a.order.paymentMethod || 'COD'}
                          </p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">
                            Items
                          </p>
                          <p className="text-xs font-bold text-gray-800 leading-none">
                            {a.order.items?.length ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <LiveMapView order={a.order} acceptedAt={a.acceptedAt || a.createdAt} />

                    <div className="flex gap-2.5 px-4 py-3 border-t border-gray-100">
                      <button
                        onClick={() => openMaps(a.order.address)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors active:scale-95"
                      >
                        <FiNavigation size={13} />
                        Navigate
                      </button>
                      <button
                        onClick={() => openWhatsApp(a.order._id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-white text-sm font-bold rounded-xl transition-colors active:scale-95"
                        style={{ background: '#25D366' }}
                      >
                        <FiMessageSquare size={13} />
                        WhatsApp
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default DeliveryBoyDashboard








// 'use client'

// import { getSocket } from '@/lib/socket'
// import axios from 'axios'
// import { useEffect, useState } from 'react'

// const DeliveryBoyDashboard = () => {
//   const [assignments, setAssignment] = useState<any[]>([])
//   const [loading, setLoading] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchAssignment = async () => {
//       try {
//         const result = await axios.get("/api/delivery/get-assignments")
//         console.log(result)
//         setAssignment(result.data)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     fetchAssignment()
//   }, [])

//   useEffect((): any => {
//     const socket = getSocket()

//     socket.on("new-assignment", (deliveryAssignment) => {
//       setAssignment((prev) => [...prev, deliveryAssignment])
//     })

//     return () => socket.off("new-assignment")
//   }, [])

//   const handleAccept = async (assignmentId: string) => {
//     setLoading(assignmentId)
//     try {
//       await axios.get(`/api/delivery/accept/${assignmentId}`)
//       setAssignment((prev) =>
//         prev.map((a) =>
//           a._id === assignmentId ? { ...a, status: "accepted" } : a
//         )
//       )
//     } catch (error: any) {
//       alert(error?.response?.data?.message || "Could not accept")
//     } finally {
//       setLoading(null)
//     }
//   }


//   const handleReject = async (assignmentId: string) => {
//     setLoading(assignmentId)
//     try {
//       await axios.post(`/api/delivery/reject/${assignmentId}`)
//       setAssignment((prev) => prev.filter((a) => a._id !== assignmentId))
//     } catch (error: any) {
//       alert(error?.response?.data?.message || "Could not reject")
//     } finally {
//       setLoading(null)
//     }
//   }

  
//   return (
//     <div className="w-full min-h-screen bg-gray-50 p-4">
//       <div className="max-w-3xl mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-green-700">
//           Delivery Assignments
//         </h2>

//         {assignments.length === 0 ? (
//           <div className="text-center py-16 text-gray-400">
//             <p className="text-lg">No assignments yet</p>
//             <p className="text-sm mt-1">New orders will appear here automatically</p>
//           </div>
//         ) : (
//           assignments.map((a) => (
//             <div
//               key={a._id}
//               className="bg-white border border-green-100 p-5 rounded-xl mb-4 shadow-sm"
//             >
//               {a.status === "broadcasted" && (
//                 <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
//                   New Order
//                 </span>
//               )}
//               {a.status === "accepted" && (
//                 <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
//                   Accepted
//                 </span>
//               )}

//               <p className="font-semibold text-gray-800">
//                 Order #{a?.order?._id ? a.order._id.slice(-6).toUpperCase() : "N/A"}
//               </p>
//               <p className="text-gray-500 text-sm mt-1">
//                 {a?.order?.fullAddress || "No address provided"}
//               </p>

//               {a.status === "broadcasted" && (
//                 <div className="flex gap-3 mt-4">
//                   <button
//                     onClick={() => handleAccept(a._id)}
//                     disabled={loading === a._id}
//                     className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition"
//                   >
//                     {loading === a._id ? "..." : "Accept"}
//                   </button>
//                   <button
//                     onClick={() => handleReject(a._id)}
//                     disabled={loading === a._id}
//                     className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition"
//                   >
//                     {loading === a._id ? "..." : "Reject"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default DeliveryBoyDashboard