'use client'

import UserOrderCard from '@/components/UserOrderCard'
import { IOrder } from '@/models/order.model'
import axios from 'axios'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import { FaCartShopping } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { FcShipped } from "react-icons/fc";
import { FaRoute } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import deliveryBoy from "@/constants/animations/delivery-boy.json";
import Lottie from 'lottie-react'


/* ─── STATUS STEPS ─── */
const JOURNEY_STEPS = [
  { key: 'pending', label: 'Placed', icon: <FaCartShopping /> },
  { key: 'confirmed', label: 'Confirmed', icon: <GiConfirmed /> },
  { key: 'shipped', label: 'Shipped', icon: <FcShipped /> },
  { key: 'out for delivery', label: 'Out for Delivery', icon: <FaRoute /> },
  { key: 'delivered', label: 'Delivered', icon: <CiDeliveryTruck /> },
]


/* ─── LIVE STATUS TRACKER ─── */
  const OrderStatusTracker = ({ status }: { status: string }) => {
  const isCancelled = status === 'cancelled'
  const currentIdx = JOURNEY_STEPS.findIndex(s => s.key === status)


  return (
    <div className="w-full mt-4 px-2">
      <style>{`
        @keyframes blinkDot  { 0%,100%{opacity:1}  50%{opacity:.2}  }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2);opacity:0} }
        @keyframes fillLine  { from{width:0%} to{width:100%} }

        .live-blink { animation: blinkDot 1.2s infinite }
        .pulse-ring { animation: pulseRing 1.5s infinite }
        .fill-line  { animation: fillLine .6s ease forwards }
      `}</style>

      {isCancelled ? (
        <div className="flex items-center justify-center py-4 text-red-500 font-semibold text-sm">
           Order Cancelled
        </div>
      ) : (
        <div className="flex items-center justify-between relative">

          {JOURNEY_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx
            const isActive = idx === currentIdx
            const isLast = idx === JOURNEY_STEPS.length - 1

            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">

                {/* CONNECTOR LINE */}
                {!isLast && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 z-0">
                    <div className="w-full h-full bg-gray-200 rounded-full"></div>

                    {(isCompleted || isActive) && (
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500 rounded-full fill-line"
                        style={{
                          width: isCompleted ? '100%' : '100%',
                          animationDelay: `${idx * 0.15}s`,
                        }}
                      />
                    )}
                  </div>
                )}

                {/* STEP ICON */}
                <div className="relative z-10">
                  {isActive ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-10 h-10 rounded-full bg-green-400 opacity-0 pulse-ring"></div>
                      <div className="absolute w-10 h-10 rounded-full bg-green-400 opacity-0 pulse-ring" style={{ animationDelay: '0.6s' }}></div>

                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-green-400 to-green-600 text-white flex items-center justify-center text-sm shadow border-2 border-white">
                        {step.icon}
                      </div>

                      {/* LIVE TAG */}
                      <div className="absolute -top-6">
                        <span className="text-[9px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full live-blink"></span>
                          LIVE
                        </span>
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center border-2 border-white shadow">
                      <FiCheckCircle size={15} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-sm opacity-40">
                      {step.icon}
                    </div>
                  )}
                </div>

                {/* LABEL */}
                <p className={`mt-2 text-[10px] font-semibold text-center ${
                  isActive ? 'text-green-600'
                    : isCompleted ? 'text-gray-600'
                    : 'text-gray-300'
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

/* ─── MAIN COMPONENT ─── */
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

        if (Array.isArray(data)) setOrders(data)
        else if (data && data._id) setOrders([data])
        else setOrders([])
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

      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm border-b z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3.5">
          <button onClick={() => router.back()} className="p-2 bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">My Orders</h1>
            {!loading && orders.length > 0 && (
              <p className="text-xs text-gray-400">{orders.length} orders</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">

        {loading && <div className="flex items-center justify-center p-4">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-50/50 border-2 border-blue-100 flex items-center justify-center overflow-hidden shadow-sm">
          <Lottie
            animationData={deliveryBoy}
            loop
            className="w-16 h-16 md:w-20 md:h-20"
          />
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin opacity-30" />
        </div>
      </div>}

        {!loading && error && <p className="text-red-500">{error}</p>}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag size={40} />
            <p>No Orders Found</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={String(order._id)} className="bg-white rounded-2xl p-4 shadow-sm">

                {/* LIVE TRACKER ADDED HERE */}
                <OrderStatusTracker status={order.status} />

                {/* Existing Card */}
                <UserOrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrder

