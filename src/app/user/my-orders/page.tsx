'use client'

import UserOrderCard from '@/components/UserOrderCard'
import { IOrder } from '@/models/order.model'
import axios from 'axios'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const MyOrder = () => {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        setLoading(true)
        const result = await axios.get('/api/auth/user/my-orders')
        const data = result.data
        if (Array.isArray(data)) {
          setOrders(data)
        } else if (data && data._id) {
          setOrders([data])
        } else {
          setOrders([])
        }
      } catch (err: any) {
        if (err?.response?.status === 400 || err?.response?.status === 404) {
          setOrders([])
        } else {
          setError('Could not load your orders. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }
    getMyOrders()
  }, [])

  return (
    <div className="bg-linear-to-b from-gray-50 to-white min-h-screen w-full">

      {/* ── Sticky Header ── */}
      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3.5">
          <button
            onClick={() => router.back()}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
          >
            <ArrowLeft size={20} className="text-green-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">My Orders</h1>
            {!loading && orders.length > 0 && (
              <p className="text-xs text-gray-400">
                {orders.length} order{orders.length > 1 ? 's' : ''} placed
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-3 w-36 bg-gray-100 rounded-full" />
                    <div className="h-4 w-24 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-7 w-24 bg-gray-100 rounded-full" />
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-emerald-600 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        <AnimatePresence>
          {!loading && !error && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-28 text-center px-6"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center mb-6">
                <ShoppingBag size={36} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Found</h2>
              <p className="text-gray-400 text-sm max-w-xs mb-6">
                Start shopping to view your orders here.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-95 transition shadow-lg shadow-emerald-100"
              >
                Start Shopping →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orders List */}
        <AnimatePresence>
          {!loading && !error && orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {orders
                .slice()
                .sort((a, b) =>
                  new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
                )
                .map((order, index) => (
                  <motion.div
                    key={String(order._id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.07 }}
                  >
                    <UserOrderCard order={order} />
                  </motion.div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default MyOrder