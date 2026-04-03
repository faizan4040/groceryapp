'use client'

import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import {
  FiPackage, FiCheckCircle, FiClock, FiDollarSign,
  FiSearch, FiRefreshCw, FiEdit2, FiTrash2, FiX,
  FiChevronLeft, FiChevronRight, FiAlertTriangle,
  FiInbox, FiMapPin, FiUser, FiShoppingCart,
  FiPhone, FiCreditCard, FiTruck,
} from 'react-icons/fi'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  grocery:  string
  name:     string
  price:    number
  unit:     string
  quantity: number
  image:    string
}

interface IAddress {
  fullName:    string
  mobile:      string
  city:        string
  state:       string
  pincode:     string
  fullAddress: string
  latitude?:   number | null
  longitude?:  number | null
}

interface Order {
  _id:                string
  userId:             string
  items:              OrderItem[]
  totalAmount:        number
  address:            IAddress
  paymentMethod:      'cod' | 'online'
  isPaid:             boolean
  status:             'pending' | 'confirmed' | 'shipped' | 'out for delivery' | 'delivered' | 'cancelled'
  razorpayOrderId?:   string
  razorpayPaymentId?: string
  createdAt:          string
  updatedAt?:         string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'out for delivery', 'delivered', 'cancelled'] as const
const PAGE_SIZE = 10

const JOURNEY_STEPS: { key: string; label: string; icon: string }[] = [
  { key: 'pending',           label: 'Placed',           icon: '🛒' },
  { key: 'confirmed',         label: 'Confirmed',        icon: '✅' },
  { key: 'shipped',           label: 'Shipped',          icon: '📦' },
  { key: 'out for delivery',  label: 'Out for Delivery', icon: '🚚' },
  { key: 'delivered',         label: 'Delivered',        icon: '🎉' },
]

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending:            { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Pending' },
  confirmed:          { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400',    label: 'Confirmed' },
  shipped:            { bg: 'bg-sky-50',     text: 'text-sky-700',     dot: 'bg-sky-400',     label: 'Shipped' },
  'out for delivery': { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-400',  label: 'Out for Delivery' },
  delivered:          { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: 'Delivered' },
  cancelled:          { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400',     label: 'Cancelled' },
}

// ─── Animated Status Tracker ──────────────────────────────────────────────────

const OrderStatusTracker = ({ status }: { status: string }) => {
  const isCancelled = status === 'cancelled'
  const currentIdx  = JOURNEY_STEPS.findIndex(s => s.key === status)

  return (
    <div className="w-full">
      <style>{`
        @keyframes blinkDot  { 0%,100%{opacity:1}  50%{opacity:.2}  }
        @keyframes pulsering { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes fillBar   { from{width:0%} to{width:100%} }
        @keyframes popIn     { 0%{transform:scale(.4);opacity:0} 70%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
        .live-blink   { animation: blinkDot  1.2s ease-in-out infinite }
        .pulse-ring   { animation: pulsering 1.5s ease-out  infinite  }
        .fill-animate { animation: fillBar   .5s  ease       forwards  }
        .pop-in       { animation: popIn     .3s  ease       forwards  }
      `}</style>

      {isCancelled ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-2xl">❌</div>
          <p className="font-bold text-red-600 text-sm">Order Cancelled</p>
        </div>
      ) : (
        <div className="relative flex items-start justify-between w-full px-2 pt-7 pb-2">
          {JOURNEY_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx
            const isActive    = idx === currentIdx
            const isLast      = idx === JOURNEY_STEPS.length - 1

            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {!isLast && (
                  <div className="absolute top-4.5 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.75 z-0">
                    <div className="absolute inset-0 bg-gray-200 rounded-full" />
                    {(isCompleted || isActive) && (
                      <div
                        className="absolute inset-0 rounded-full fill-animate"
                        style={{
                          background: isCompleted
                            ? 'linear-gradient(90deg,#10b981,#059669)'
                            : 'linear-gradient(90deg,#10b981,#6ee7b7)',
                          animationDelay: `${idx * 0.12}s`,
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="relative z-10 pop-in" style={{ animationDelay: `${idx * 0.07}s` }}>
                  {isActive ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-11 h-11 rounded-full bg-emerald-400 opacity-0 pulse-ring" style={{ animationDelay: '0s' }} />
                      <div className="absolute w-11 h-11 rounded-full bg-emerald-400 opacity-0 pulse-ring" style={{ animationDelay: '0.55s' }} />
                      <div className="relative w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg flex items-center justify-center text-sm border-2 border-white">
                        {step.icon}
                      </div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-blink inline-block" />
                          LIVE
                        </span>
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow flex items-center justify-center border-2 border-white">
                      <FiCheckCircle size={15} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-sm grayscale opacity-40">
                      {step.icon}
                    </div>
                  )}
                </div>

                <p className={`mt-2.5 text-[10px] font-bold text-center leading-tight max-w-13 ${
                  isActive ? 'text-emerald-600' : isCompleted ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Product Images Cell ───────────────────────────────────────────────────────

const ProductImages = ({ items }: { items: OrderItem[] }) => {
  const preview = items.slice(0, 3)
  const extra   = items.length - 3

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2.5">
        {preview.map((item, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-gray-100 shrink-0"
            style={{ zIndex: preview.length - i }}
            title={item.name}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-50 text-green-400">
                <FiShoppingCart size={13} />
              </div>
            )}
          </div>
        ))}
        {extra > 0 && (
          <div
            className="w-10 h-10 rounded-lg border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0"
            style={{ zIndex: 0 }}
          >
            +{extra}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-semibold">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        <p className="text-[10px] text-gray-300 font-mono leading-none mt-0.5 truncate max-w-20">
          {items[0]?.name}
        </p>
      </div>
    </div>
  )
}

// ─── Shared small components ──────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const c = STATUS_CFG[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: status }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

const PaymentBadge = ({ isPaid, method }: { isPaid: boolean; method: string }) => (
  <div className="flex flex-col gap-1">
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
    <span className="text-xs text-gray-400 capitalize">{method}</span>
  </div>
)

const Skeleton = () => (
  <div className="animate-pulse space-y-3 p-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 rounded-xl" style={{ opacity: 1 - i * 0.12 }} />
    ))}
  </div>
)

const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div className={`fixed bottom-6 right-6 z-100 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
    {type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertTriangle size={15} />}
    {message}
  </div>
)

// ─── Order Modal ──────────────────────────────────────────────────────────────

const OrderModal = ({
  order, onClose, onSave,
}: {
  order: Order
  onClose: () => void
  onSave: (id: string, status: string, isPaid: boolean) => Promise<void>
}) => {
  const [status, setStatus] = useState(order.status)
  const [isPaid, setIsPaid] = useState(order.isPaid)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave(order._id, status, isPaid)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order._id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Status Tracker */}
          <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FiTruck size={12} /> Order Journey
            </p>
            <OrderStatusTracker status={status} />
          </div>

          {/* Customer */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiUser size={13} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</p>
            </div>
            <p className="font-semibold text-gray-900">{order.address.fullName}</p>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
              <FiPhone size={12} /> {order.address.mobile}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">User ID: {order.userId}</p>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiMapPin size={13} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Delivery Address</p>
            </div>
            <p className="text-sm text-gray-700">{order.address.fullAddress}</p>
            {order.address.city && (
              <p className="text-xs text-gray-500 mt-1">{order.address.city}, {order.address.state} – {order.address.pincode}</p>
            )}
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiShoppingCart size={13} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items Ordered</p>
            </div>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <FiShoppingCart size={16} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.unit} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-600">Total Amount</span>
              <span className="text-xl font-black text-green-600">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {order.razorpayOrderId && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiCreditCard size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Info</p>
              </div>
              <p className="text-xs text-gray-600 font-mono">Razorpay Order: {order.razorpayOrderId}</p>
              {order.razorpayPaymentId && (
                <p className="text-xs text-gray-600 font-mono">Payment ID: {order.razorpayPaymentId}</p>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order['status'])}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_CFG[s]?.label ?? s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Payment Status</label>
              <select
                value={isPaid ? 'paid' : 'unpaid'}
                onChange={(e) => setIsPaid(e.target.value === 'paid')}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

const DeleteModal = ({ order, onClose, onConfirm }: { order: Order; onClose: () => void; onConfirm: () => Promise<void> }) => {
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => { setDeleting(true); await onConfirm(); setDeleting(false); onClose() }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
          <FiTrash2 size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Order?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Permanently remove order <span className="font-mono font-semibold text-gray-700">{order._id.slice(-10)}</span>. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-60">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ManageOrders = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  // Filters
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [searchInput,   setSearchInput]   = useState('')
  const [searchQuery,   setSearchQuery]   = useState('')   // applied on click / Enter

  // Client-side pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Modals & toast
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [deleteOrder,   setDeleteOrder]   = useState<Order | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch all orders (large limit) ────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get('/api/admin/get-orders?page=1&limit=1000')
      if (data.success) {
        setAllOrders(data.orders)
      } else {
        setError(data.message || 'Failed to fetch orders')
      }
    } catch (err: unknown) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  // ── Client-side filter + search (instant, always correct) ────────────────
  const filtered = useMemo(() => {
    let list = [...allOrders]

    if (filterStatus !== 'all')
      list = list.filter(o => o.status === filterStatus)

    if (filterPayment === 'paid')   list = list.filter(o => o.isPaid)
    if (filterPayment === 'unpaid') list = list.filter(o => !o.isPaid)

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(o =>
        o.address.fullName.toLowerCase().includes(q) ||
        o.address.mobile.toLowerCase().includes(q)   ||
        o.userId.toLowerCase().includes(q)           ||
        o._id.toLowerCase().includes(q)              ||
        o.items.some(i => i.name.toLowerCase().includes(q))
      )
    }

    return list
  }, [allOrders, filterStatus, filterPayment, searchQuery])

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1) }, [filterStatus, filterPayment, searchQuery])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage    = Math.min(currentPage, totalPages)
  const pageOrders  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSearch      = () => setSearchQuery(searchInput)
  const handleKeyDown     = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') handleSearch() }
  const handleClearSearch = () => { setSearchInput(''); setSearchQuery('') }
  const clearAll          = () => { setFilterStatus('all'); setFilterPayment('all'); setSearchInput(''); setSearchQuery('') }

  const hasActiveFilter = filterStatus !== 'all' || filterPayment !== 'all' || searchQuery !== ''

  // ── Mutations ─────────────────────────────────────────────────────────────
  const handleUpdateOrder = async (id: string, status: string, isPaid: boolean) => {
    try {
      const { data } = await axios.put('/api/admin/update-order', { orderId: id, status, isPaid })
      if (data.success) {
        setAllOrders(prev => prev.map(o => o._id === id ? { ...o, status: data.order.status, isPaid: data.order.isPaid } : o))
        showToast('Order updated', 'success')
      } else { showToast(data.message || 'Update failed', 'error') }
    } catch { showToast('Failed to update order', 'error') }
  }

  const handleDeleteOrder = async (id: string) => {
    try {
      const { data } = await axios.delete(`/api/admin/delete-order?orderId=${id}`)
      if (data.success) {
        setAllOrders(prev => prev.filter(o => o._id !== id))
        showToast('Order deleted', 'success')
      } else { showToast(data.message || 'Delete failed', 'error') }
    } catch { showToast('Failed to delete order', 'error') }
  }

  // ── Stats (reflect current filtered view) ─────────────────────────────────
  const stats = [
    { label: 'Showing',   value: filtered.length,                                                           icon: <FiPackage size={18} />,     color: 'bg-blue-50 text-blue-600' },
    { label: 'Delivered', value: filtered.filter(o => o.status === 'delivered').length,                     icon: <FiCheckCircle size={18} />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending',   value: filtered.filter(o => o.status === 'pending').length,                       icon: <FiClock size={18} />,       color: 'bg-amber-50 text-amber-600' },
    { label: 'Revenue',   value: `₹${filtered.reduce((s, o) => s + (o.totalAmount || 0), 0).toFixed(0)}`,  icon: <FiDollarSign size={18} />,  color: 'bg-violet-50 text-violet-600' },
  ]

  // ── Pagination page numbers ────────────────────────────────────────────────
  const pageNums = (() => {
    const pages: number[] = []
    const start = Math.max(1, safePage - 2)
    const end   = Math.min(totalPages, start + 4)
    for (let p = start; p <= end; p++) pages.push(p)
    return pages
  })()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=DM+Mono:wght@500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-[#F4F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Manage Orders</h1>
              <p className="text-sm text-gray-400 mt-0.5">{allOrders.length} total orders</p>
            </div>
            <button
              onClick={fetchOrders}
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <FiRefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                  <p className="text-xl font-black text-gray-900" style={{ fontFamily: "'DM Mono', monospace" }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Search */}
            <div className="flex gap-2 flex-1 min-w-0">
              <div className="relative flex-1 min-w-0">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search name, mobile, order ID, or product…"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                />
                {searchInput && (
                  <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <FiX size={14} />
                  </button>
                )}
              </div>
              <button onClick={handleSearch} className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors whitespace-nowrap">
                Search
              </button>
            </div>

            {/* Status filter */}
        <Select
        value={filterStatus}
        onValueChange={(value) => setFilterStatus(value)}
      >
        <SelectTrigger className="w-45 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-green-400 bg-gray-50">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>

        <SelectContent className="rounded-xl">
          <SelectItem value="all">All Statuses</SelectItem>

          {ORDER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_CFG[s]?.label ?? s}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>

            {/* Payment filter */}
            <Select
              value={filterPayment}
              onValueChange={(value) => setFilterPayment(value)}
            >
              <SelectTrigger className="w-45 cursor-pointer border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50">
                <SelectValue placeholder="Select Payment" />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                <SelectGroup>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Clear all */}
            {hasActiveFilter && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors whitespace-nowrap"
              >
                <FiX size={12} /> Clear All
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilter && (
            <div className="flex flex-wrap gap-2 -mt-2">
              {filterStatus !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  Status: {STATUS_CFG[filterStatus]?.label}
                  <button onClick={() => setFilterStatus('all')} className="hover:text-blue-900"><FiX size={10} /></button>
                </span>
              )}
              {filterPayment !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  Payment: {filterPayment === 'paid' ? 'Paid' : 'Unpaid'}
                  <button onClick={() => setFilterPayment('all')} className="hover:text-emerald-900"><FiX size={10} /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={handleClearSearch} className="hover:text-amber-900"><FiX size={10} /></button>
                </span>
              )}
              <span className="text-xs text-gray-400 self-center">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* ── Table ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <Skeleton />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
                <FiAlertTriangle size={40} />
                <p className="font-semibold text-red-500 text-center px-4">{error}</p>
                <button onClick={fetchOrders} className="px-5 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors">Retry</button>
              </div>
            ) : pageOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                <FiInbox size={44} />
                <p className="font-semibold text-gray-500">No orders found</p>
                <p className="text-sm">Try adjusting your filters or search</p>
                {hasActiveFilter && (
                  <button onClick={clearAll} className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors">Clear filters</button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/80">
                        {['Products', 'Customer', 'Amount', 'Status', 'Payment', 'Method', 'Date', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pageOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">

                          {/* Products — images + item count + mini order ID */}
                          <td className="px-4 py-3.5">
                            <ProductImages items={order.items} />
                            <span className="font-mono text-[9px] text-gray-300 mt-0.5 block">#{order._id.slice(-8)}</span>
                          </td>

                          {/* Customer */}
                          <td className="px-4 py-3.5">
                            <p className="text-sm font-semibold text-gray-800">{order.address.fullName}</p>
                            <p className="text-xs text-gray-400">{order.address.mobile}</p>
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>

                          {/* Payment */}
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${order.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                              {order.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>

                          {/* Method */}
                          <td className="px-4 py-3.5">
                            <span className="text-xs text-gray-500 uppercase font-semibold bg-gray-100 px-2 py-1 rounded-lg">{order.paymentMethod}</span>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setSelectedOrder(order)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                                <FiEdit2 size={11} /> Edit
                              </button>
                              <button onClick={() => setDeleteOrder(order)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors">
                                <FiTrash2 size={11} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {pageOrders.map((order) => (
                    <div key={order._id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <ProductImages items={order.items} />
                        <span className="text-sm font-black text-gray-900 shrink-0">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{order.address.fullName}</p>
                        <p className="text-xs text-gray-400">{order.address.mobile} · {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                        <p className="text-[10px] text-gray-300 font-mono mt-0.5">#{order._id.slice(-8)}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <StatusBadge status={order.status} />
                        <PaymentBadge isPaid={order.isPaid} method={order.paymentMethod} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors">
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button onClick={() => setDeleteOrder(order)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
                          <FiTrash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Pagination ── */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-400">Page {safePage} of {totalPages} · {filtered.length} orders</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft size={15} /> Prev
                </button>
                {pageNums.map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${p === safePage ? 'bg-green-500 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <FiChevronRight size={15} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onSave={handleUpdateOrder} />}
      {deleteOrder   && <DeleteModal order={deleteOrder} onClose={() => setDeleteOrder(null)} onConfirm={() => handleDeleteOrder(deleteOrder._id)} />}
      {toast         && <Toast message={toast.message} type={toast.type} />}
    </>
  )
}

export default ManageOrders
