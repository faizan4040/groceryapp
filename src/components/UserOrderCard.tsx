'use client'

import { IOrder } from '@/models/order.model'
import { motion, AnimatePresence } from 'motion/react'
import React, { useState } from 'react'
import {
  Package, Truck, CheckCircle2, Clock, XCircle,
  ChevronDown, ChevronUp, MapPin, Phone, CreditCard, Banknote,
} from 'lucide-react'

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

/* ══════════════════════════════════
   STATUS CONFIG
══════════════════════════════════ */
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'out for delivery' | 'delivered' | 'cancelled'

const STATUS_CONFIG: Record<string, {
  label: string
  icon: React.ElementType
  badge: string
  dot: string
  barWidth: string
  barColor: string
  step: number
}> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    barWidth: 'w-[10%]',
    barColor: 'bg-amber-400',
    step: 0,
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    barWidth: 'w-[35%]',
    barColor: 'bg-blue-500',
    step: 1,
  },
  shipped: {
    label: 'Shipped',
    icon: Package,
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
    barWidth: 'w-[60%]',
    barColor: 'bg-indigo-500',
    step: 2,
  },
  'out for delivery': {
    label: 'Out for Delivery',
    icon: Truck,
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    barWidth: 'w-[80%]',
    barColor: 'bg-violet-500',
    step: 3,
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    barWidth: 'w-full',
    barColor: 'bg-emerald-500',
    step: 4,
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-400',
    barWidth: 'w-0',
    barColor: 'bg-red-400',
    step: -1,
  },
}

const STEPS = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']

/* ══════════════════════════════════
   COMPONENT
══════════════════════════════════ */
const UserOrderCard = ({ order }: { order: IOrder }) => {
  const [expanded, setExpanded] = useState(false)

  const statusKey = (order.status as string)?.toLowerCase() ?? 'pending'
  const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.pending
  const StatusIcon = cfg.icon

  const isCancelled = statusKey === 'cancelled'
  const totalAmount = order.totalAmount ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border mt-6 border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white">
        <div>
          <h3 className="text-sm font-bold text-gray-700">
            Order{' '}
            <span className="font-mono text-emerald-600">
              #{order?._id?.toString()?.slice(-6).toUpperCase()}
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {order.createdAt ? formatDate(order.createdAt) : '—'}
          </p>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shrink-0 ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
          <StatusIcon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-4 space-y-4">

        {/* Progress bar */}
        {!isCancelled && (
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: undefined }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${cfg.barColor} ${cfg.barWidth} transition-all duration-700`}
              />
            </div>
            <div className="flex justify-between">
              {STEPS.map((step, i) => (
                <span
                  key={step}
                  className={`text-[9px] font-medium ${
                    i <= cfg.step ? 'text-emerald-600' : 'text-gray-300'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Paid / Unpaid */}
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            order.isPaid
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {order.isPaid ? '✓ Paid' : '✗ Unpaid'}
          </span>

          {/* Payment method */}
          <span className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${
            order.paymentMethod === 'online'
              ? 'bg-violet-50 text-violet-700 border-violet-200'
              : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            {order.paymentMethod === 'online'
              ? <><CreditCard size={10} /> Online</>
              : <><Banknote size={10} /> Cash on Delivery</>
            }
          </span>

          {/* Item count */}
          <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border bg-gray-50 text-gray-600 border-gray-200">
            <Package size={10} />
            {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Order Total</span>
          <span className="text-base font-bold text-emerald-600">{fmt(totalAmount)}</span>
        </div>

      </div>

      {/* ── Expand toggle ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 hover:bg-gray-100 transition"
      >
        <span className="font-semibold">{expanded ? 'Hide details' : 'View details'}</span>
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {/* ── Expanded details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-4 border-t border-gray-100">

              {/* Items */}
              {order.items && order.items.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Items</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={16} className="text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity} × {item.unit} · {fmt(item.price)}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 shrink-0">
                        {fmt(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <hr className="border-dashed border-gray-200" />

              {/* Delivery address */}
              {order.address && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Delivery Address</p>
                  <p className="text-sm font-semibold text-gray-700">{order.address.fullName}</p>
                  {order.address.mobile && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={10} /> {order.address.mobile}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-start gap-1 leading-relaxed">
                    <MapPin size={10} className="mt-0.5 shrink-0" />
                    {order.address.fullAddress}
                  </p>
                  <p className="text-xs text-gray-400 pl-4">
                    {order.address.city}, {order.address.state} – {order.address.pincode}
                  </p>
                </div>
              )}

              {/* Total summary */}
              <div className="flex justify-between items-center bg-emerald-50 rounded-xl px-4 py-3">
                <span className="text-sm font-semibold text-gray-600">Total Paid</span>
                <span className="text-lg font-bold text-emerald-600">{fmt(totalAmount)}</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default UserOrderCard