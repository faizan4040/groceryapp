'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { motion } from 'motion/react'
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaMailBulk,
  FaMoneyBillWave
} from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import MapView from '@/components/MapView'

/* ─── Helpers ─── */
const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(n)

const DELIVERY_THRESHOLD = 499
const DELIVERY_FEE = 49

export default function Checkout() {
  const router = useRouter()

  const { userData } = useSelector((state: RootState) => state.user)
  const cartData = useSelector((state: RootState) => state.cart.cartData)

  /* ─── Address State ─── */
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    city: '',
    state: '',
    pincode: '',
    fullAddress: ''
  })

  /* ─── Payment Method ─── */
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod')

  /* ─── Map Position ─── */
  const [position, setPosition] = useState<[number, number] | null>(null)

  /* ─── Get Location ─── */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      })
    }
  }, [])

  /* ─── Sync user data ─── */
  useEffect(() => {
    if (userData) {
      setAddress({
        fullName: userData.name || '',
        mobile: userData.mobile || '',
        city: '',
        state: '',
        pincode: '',
        fullAddress: ''
      })
    }
  }, [userData])

  /* ─── Calculations (REAL) ─── */
  const subtotal = cartData.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  /* ─── Place Order ─── */
  const handleOrder = () => {
    if (!address.fullName || !address.mobile || !address.fullAddress) {
      alert('Please fill all required fields')
      return
    }

    const orderData = {
      items: cartData,
      address,
      paymentMethod,
      total
    }

    console.log('ORDER:', orderData)

    alert('Order Placed Successfully (COD)')
    router.push('/')
  }

  /* ─── Empty Cart Protection ─── */
  if (cartData.length === 0) {
    router.push('/user/cart')
    return null
  }

  return (
    <div className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto py-20">

      {/* Back */}
      <button
        onClick={() => router.push('/user/cart')}
        className="mb-6 text-green-600 font-semibold hover:underline"
      >
        ← Back to Cart
      </button>

      <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* ───────── LEFT: ADDRESS ───────── */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">

          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaMapMarkerAlt /> Delivery Address
          </h2>

          <div className="space-y-5">

            {/* Name */}
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
                placeholder="Full Name"
                className="pl-12 h-12 rounded-xl"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={address.mobile}
                onChange={(e) =>
                  setAddress({ ...address, mobile: e.target.value })
                }
                placeholder="Mobile Number"
                className="pl-12 h-12 rounded-xl"
              />
            </div>

            {/* Address */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={address.fullAddress}
                onChange={(e) =>
                  setAddress({ ...address, fullAddress: e.target.value })
                }
                placeholder="Full Address"
                className="pl-12 h-12 rounded-xl"
              />
            </div>

            {/* City / State / Pincode */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* City */}
            <div className="relative">
                <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                value={address.city}
                onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                }
                placeholder="City"
                className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition"
                />
            </div>

            {/* State */}
            <div className="relative">
                <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                value={address.state}
                onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                }
                placeholder="State"
                className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition"
                />
            </div>

            {/* Pincode */}
            <div className="relative">
                <FaMailBulk className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                value={address.pincode}
                onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                }
                placeholder="Pincode"
                className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 transition"
                />
            </div>

            </div>

            {/* Map */}
            <div className="h-60 rounded-xl overflow-hidden border mt-4">
              <MapView position={position} />
            </div>

          </div>
        </div>

        {/* ───────── RIGHT: SUMMARY ───────── */}
        <div className="bg-white p-6 rounded-2xl shadow-md border h-fit space-y-6">

          <h2 className="text-xl font-semibold">Order Summary</h2>

          {/* Items */}
          <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
            {cartData.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {delivery === 0 ? 'FREE' : fmt(delivery)}
              </span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">{fmt(total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Payment Method</h3>

            <label className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:border-green-500">
              <input
                type="radio"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <FaMoneyBillWave className="text-green-600" />
              <span>Cash on Delivery</span>
            </label>
          </div>

          {/* Place Order */}
          <Button
            onClick={handleOrder}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Place Order (COD)
          </Button>

        </div>

      </div>
    </div>
  )
}