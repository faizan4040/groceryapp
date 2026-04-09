'use client'

import { getSocket } from '@/lib/socket'
import axios from 'axios'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./MapView'), { ssr: false })

interface OrderAddress {
  fullName: string
  mobile: string
  fullAddress: string
  city: string
  state: string
  pincode: string
  latitude?: number | null
  longitude?: number | null
}

interface OrderItem {
  name: string
  quantity: number
  price: number
  unit: string
  image?: string
}

interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  address: OrderAddress
  paymentMethod: 'cod' | 'online'
  isPaid: boolean
  status: string
}

interface Assignment {
  _id: string
  order: Order
  deliveryBoy: string | null
  status: 'broadcasted' | 'accepted' | 'delivered' | 'failed'
  rejectedBy: string[]
  createdAt: string
}

const STATUS_CFG = {
  broadcasted: { label: 'New Order', bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  accepted:    { label: 'Accepted',  bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  delivered:   { label: 'Delivered', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  failed:      { label: 'Failed',    bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-400'     },
}

const Toast = ({ msg, type }: { msg: string; type: 'success' | 'error' | 'info' }) => {
  const colors = { success: 'bg-emerald-500', error: 'bg-red-500', info: 'bg-blue-500' }
  return (
    <div className={`fixed bottom-6 right-6 z-9999 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold flex items-center gap-2 ${colors[type]}`}>
      {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} {msg}
    </div>
  )
}

const DeliveryBoyDashboard = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [assignments, setAssignments]   = useState<Assignment[]>([])
  const [loading, setLoading]           = useState<string | null>(null)
  const [activeMap, setActiveMap]       = useState<string | null>(null)
  const [myLocation, setMyLocation]     = useState<{ lat: number; lng: number } | null>(null)
  const [toast, setToast]               = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const locationIntervalRef             = useRef<ReturnType<typeof setInterval> | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' | 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  // ── 1. Fetch existing assignments ──────────────────────────────────────────
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get('/api/delivery/get-assignments')
        setAssignments(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchAssignments()
  }, [])

  // ── 2. Emit identity → CRITICAL: registers socketId on server ─────────────
  useEffect(() => {
    if (!userId) return

    const socket = getSocket()

    const registerIdentity = () => {
      socket.emit('identity', userId)
      console.log('[Socket] Identity emitted:', userId)
    }

    // Emit immediately if already connected
    if (socket.connected) {
      registerIdentity()
    }

    // Re-emit on every reconnect
    socket.on('connect', registerIdentity)

    return () => {
      socket.off('connect', registerIdentity)
    }
  }, [userId])

  // ── 3. Listen for real-time events ────────────────────────────────────────
  useEffect((): any => {
    const socket = getSocket()

    socket.on('new-assignment', (newAssignment: Assignment) => {
      setAssignments(prev => {
        if (prev.find(a => a._id === newAssignment._id)) return prev
        return [newAssignment, ...prev]
      })
      showToast('📦 New delivery order!', 'info')
    })

    socket.on('assignment-taken', ({ assignmentId }: { assignmentId: string }) => {
      setAssignments(prev => prev.filter(a => a._id !== assignmentId))
    })

    return () => {
      socket.off('new-assignment')
      socket.off('assignment-taken')
    }
  }, [])

  // ── 4. GPS helpers ─────────────────────────────────────────────────────────
  const startLocationBroadcast = useCallback((uid: string) => {
    if (locationIntervalRef.current) return

    const broadcast = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setMyLocation({ lat: latitude, lng: longitude })
          getSocket().emit('update-location', { userId: uid, latitude, longitude })
        },
        (err) => console.warn('GPS error', err),
        { enableHighAccuracy: true }
      )
    }

    broadcast()
    locationIntervalRef.current = setInterval(broadcast, 5000)
  }, [])

  const stopLocationBroadcast = useCallback(() => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current)
      locationIntervalRef.current = null
    }
  }, [])

  useEffect(() => () => stopLocationBroadcast(), [stopLocationBroadcast])

  // ── 5. Accept ──────────────────────────────────────────────────────────────
  const handleAccept = async (assignment: Assignment) => {
    setLoading(assignment._id)
    try {
      const { data } = await axios.get(`/api/delivery/accept/${assignment._id}`)
      if (data.success) {
        setAssignments(prev =>
          prev.map(a => a._id === assignment._id ? { ...a, status: 'accepted' } : a)
        )
        showToast('Order accepted! Start navigating 🚴', 'success')
        setActiveMap(assignment._id)
        if (userId) startLocationBroadcast(userId)
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Could not accept', 'error')
    } finally {
      setLoading(null)
    }
  }

  // ── 6. Reject ──────────────────────────────────────────────────────────────
  const handleReject = async (assignmentId: string) => {
    setLoading(assignmentId)
    try {
      await axios.post(`/api/delivery/reject/${assignmentId}`)
      setAssignments(prev => prev.filter(a => a._id !== assignmentId))
      showToast('Order rejected', 'info')
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Could not reject', 'error')
    } finally {
      setLoading(null)
    }
  }

  // ── 7. Mark delivered ──────────────────────────────────────────────────────
  const handleMarkDelivered = async (assignmentId: string) => {
    setLoading(assignmentId)
    try {
      const { data } = await axios.post(`/api/delivery/complete/${assignmentId}`)
      if (data.success) {
        setAssignments(prev =>
          prev.map(a => a._id === assignmentId ? { ...a, status: 'delivered' } : a)
        )
        stopLocationBroadcast()
        setActiveMap(null)
        showToast('🎉 Marked as delivered!', 'success')
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Could not update', 'error')
    } finally {
      setLoading(null)
    }
  }

  const acceptedAssignment = assignments.find(a => a.status === 'accepted')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .db-root * { font-family: 'Syne', sans-serif; }
        @keyframes slideIn { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse2  { 0%,100%{opacity:1} 50%{opacity:.4} }
        .slide-in   { animation: slideIn .35s ease forwards; }
        .badge-live { animation: pulse2 1.4s ease-in-out infinite; }
      `}</style>

      <div className="db-root w-full min-h-screen bg-[#0f1117] text-white">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Deliveries</h1>
              <p className="text-sm text-gray-400 mt-0.5 font-mono">
                {assignments.filter(a => a.status === 'broadcasted').length} pending ·{' '}
                {assignments.filter(a => a.status === 'accepted').length} active
              </p>
            </div>
            {acceptedAssignment && (
              <span className="badge-live flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                GPS LIVE
              </span>
            )}
          </div>

          {/* Warn if not logged in */}
          {!userId && (
            <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-400 text-xs font-mono">
              ⚠️ Not logged in — socket identity not registered. Please log in.
            </div>
          )}

          {/* Live Map */}
          {activeMap && acceptedAssignment && (
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl slide-in">
              <div className="bg-[#1a1d27] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">Live Route</p>
                  <p className="text-sm font-bold mt-0.5 truncate max-w-65">
                    {acceptedAssignment.order.address.fullAddress}
                  </p>
                </div>
                <button onClick={() => setActiveMap(null)} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div className="h-72">
                <MapView
                  deliveryLocation={myLocation}
                  destinationLat={acceptedAssignment.order.address.latitude ?? null}
                  destinationLng={acceptedAssignment.order.address.longitude ?? null}
                />
              </div>
            </div>
          )}

          {/* Assignment Cards */}
          {assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <span className="text-6xl">📭</span>
              <p className="text-lg font-bold text-gray-400">No assignments yet</p>
              <p className="text-sm text-gray-500">New orders will appear here instantly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((a) => {
                const cfg       = STATUS_CFG[a.status] ?? STATUS_CFG.broadcasted
                const isLoading = loading === a._id
                const addr      = a.order?.address
                const items     = a.order?.items ?? []
                const hasDest   = typeof addr?.latitude === 'number' && typeof addr?.longitude === 'number'

                return (
                  <div key={a._id} className={`rounded-2xl border overflow-hidden slide-in transition-all ${
                    a.status === 'accepted'  ? 'border-blue-500/40 bg-[#141824]' :
                    a.status === 'delivered' ? 'border-emerald-500/20 bg-[#111a14] opacity-70' :
                                               'border-white/10 bg-[#1a1d27]'
                  }`}>
                    <div className="px-5 pt-5 pb-4">

                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                          <p className="text-lg font-black mt-2 leading-tight">
                            Order #{a.order?._id?.slice(-6).toUpperCase() ?? 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            {new Date(a.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-black text-emerald-400">₹{a.order?.totalAmount?.toFixed(0) ?? '—'}</p>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${a.order?.isPaid ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400'}`}>
                            {a.order?.isPaid ? 'Paid' : a.order?.paymentMethod?.toUpperCase() ?? '—'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-black/20 rounded-xl px-4 py-3 mb-3">
                        <p className="text-sm font-bold">{addr?.fullName ?? '—'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">📞 {addr?.mobile ?? '—'}</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          📍 {addr?.fullAddress ?? '—'}{addr?.city ? `, ${addr.city}` : ''}{addr?.pincode ? ` – ${addr.pincode}` : ''}
                        </p>
                      </div>

                      {items.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3">
                          {items.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
                              {item.image && <img src={item.image} alt={item.name} className="w-6 h-6 rounded object-cover" />}
                              <span className="text-xs font-semibold text-gray-300 max-w-20 truncate">{item.name}</span>
                              <span className="text-[10px] text-gray-500">×{item.quantity}</span>
                            </div>
                          ))}
                          {items.length > 3 && (
                            <div className="flex items-center bg-white/5 rounded-lg px-2.5 py-1.5">
                              <span className="text-xs text-gray-500">+{items.length - 3} more</span>
                            </div>
                          )}
                        </div>
                      )}

                      {a.status === 'broadcasted' && (
                        <div className="flex gap-3 mt-1">
                          <button onClick={() => handleAccept(a)} disabled={isLoading}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black py-3 rounded-xl transition-all text-sm tracking-wide">
                            {isLoading ? '⏳' : '✅ Accept'}
                          </button>
                          <button onClick={() => handleReject(a._id)} disabled={isLoading}
                            className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-sm">
                            {isLoading ? '⏳' : '✗ Reject'}
                          </button>
                        </div>
                      )}

                      {a.status === 'accepted' && (
                        <div className="flex gap-3 mt-1">
                          <button onClick={() => setActiveMap(activeMap === a._id ? null : a._id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all text-sm">
                            {activeMap === a._id ? '🗺 Hide Map' : '🗺 Show Map'}
                          </button>
                          <button onClick={() => handleMarkDelivered(a._id)} disabled={isLoading}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black py-3 rounded-xl transition-all text-sm">
                            {isLoading ? '⏳' : '🎉 Delivered'}
                          </button>
                        </div>
                      )}

                      {a.status === 'delivered' && (
                        <div className="mt-2 text-center text-sm font-bold text-emerald-400 py-2 bg-emerald-500/10 rounded-xl">
                          ✅ Order Completed
                        </div>
                      )}

                      {!hasDest && a.status === 'accepted' && (
                        <p className="text-[11px] text-amber-500 mt-2 text-center">
                          ⚠️ Customer location not pinned — navigate manually
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
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