'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { FaCheckCircle, FaBoxOpen, FaShoppingBag, FaTruck } from 'react-icons/fa'

interface OrderSuccessProps {
  /** Total amount paid / to pay on delivery */
  total?: number
  /** 'cod' → pay on delivery  |  'online' → already paid */
  paymentMethod?: 'cod' | 'online'
  /** Order ID returned from the API (optional but nice to show) */
  orderId?: string
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

/* ── Animated step indicators ── */
const STEPS = [
  { icon: <FaCheckCircle />,  label: 'Order Placed',      delay: 0.6  },
  { icon: <FaBoxOpen />,      label: 'Being Packed',       delay: 0.75 },
  { icon: <FaTruck />,        label: 'Out for Delivery',   delay: 0.9  },
]

export default function OrderSuccess({
  total,
  paymentMethod = 'cod',
  orderId,
}: OrderSuccessProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-linear-to-b from-green-50 to-white">

      {/* ── Big animated tick ── */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
        className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center mb-6 shadow-xl shadow-emerald-100"
      >
        <FaCheckCircle className="text-emerald-500 text-6xl" />
      </motion.div>

      {/* ── Heading ── */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-4xl font-bold text-gray-800 mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Order Confirmed! 
      </motion.h1>

      {/* ── Sub-text ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 text-lg max-w-sm mb-2"
      >
        {paymentMethod === 'cod'
          ? `Your order is placed. Pay${total ? ` ${fmt(total)}` : ''} when it arrives.`
          : `Payment${total ? ` of ${fmt(total)}` : ''} received. Your order is on its way! 🚀`}
      </motion.p>

      {/* ── Order ID ── */}
      {orderId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-xs text-gray-400 mb-6"
        >
          Order ID: <span className="font-mono font-semibold text-gray-600">{orderId}</span>
        </motion.p>
      )}

      {/* ── Progress steps ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="flex items-center gap-2 mb-8"
      >
        {STEPS.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step.delay, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
                {step.icon}
              </div>
              <span className="text-[10px] text-gray-500 w-16 leading-tight">{step.label}</span>
            </motion.div>
            {idx < STEPS.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: step.delay + 0.1, duration: 0.4 }}
                style={{ transformOrigin: 'left' }}
                className="w-8 h-0.5 bg-emerald-200 mb-4"
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* ── CTA Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex gap-3 flex-wrap justify-center"
      >
        <button
          onClick={() => router.push('/user/my-orders')}
          className="px-6 py-3 border-2 cursor-pointer border-emerald-600 text-emerald-600 rounded-2xl font-semibold hover:bg-emerald-50 transition-all flex items-center gap-2"
        >
          <FaTruck /> My Orders
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-emerald-600 cursor-pointer text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
        >
          <FaShoppingBag /> Shop More
        </button>
      </motion.div>

    </div>
  )
}