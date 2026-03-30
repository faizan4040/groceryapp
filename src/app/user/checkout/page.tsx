'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import {
  FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaMailBulk,
  FaMoneyBillWave, FaCheckCircle, FaShoppingBag,
  FaMobileAlt, FaLock, FaTag, FaSpinner,
} from 'react-icons/fa'
import { SiRazorpay, SiPaytm, SiPhonepe, SiGooglepay } from 'react-icons/si'
import OrderSuccess from '../order-success/page'


/* ── Razorpay window type ── */
declare global {
  interface Window {
    Razorpay: any
  }
}


const DeliveryMap = dynamic(
  () => import('../checkout/DeliveryMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm gap-2">
        <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        Loading map…
      </div>
    ),
  }
)

/* ══════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
══════════════════════════════════════════════════════════ */
const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

const DELIVERY_THRESHOLD = 499
const DELIVERY_FEE       = 49

const VALID_COUPONS: Record<string, number> = {
  SAVE50: 50, FIRST100: 100, FRESH20: 20,
}

type PaymentMethod = 'cod' | 'upi'

interface AddressState {
  fullName:    string
  mobile:      string
  city:        string
  state:       string
  pincode:     string
  fullAddress: string
}

/* ── Load Razorpay script once ── */
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') { resolve(true); return }
    const script    = document.createElement('script')
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload   = () => resolve(true)
    script.onerror  = () => resolve(false)
    document.body.appendChild(script)
  })

/* ══════════════════════════════════════════════════════════
   PAYMENT OPTIONS CONFIG
══════════════════════════════════════════════════════════ */
const PAYMENT_OPTIONS = [
  {
    id:    'cod'  as PaymentMethod,
    label: 'Cash on Delivery',
    desc:  'Pay when your order arrives',
    icon:  <FaMoneyBillWave className="text-xl" />,
    color: 'emerald',
  },
  {
    id:    'upi'  as PaymentMethod,
    label: 'UPI / Card / Online',
    desc:  'GPay, PhonePe, Paytm, Card & more via Razorpay',
    icon:  <FaMobileAlt className="text-xl" />,
    color: 'violet',
    badge: 'Instant',
  },
]

const COLOR_ACTIVE: Record<string, string> = {
  emerald: 'border-emerald-500 bg-emerald-50',
  violet:  'border-violet-500  bg-violet-50',
}
const ICON_COLOR: Record<string, string> = {
  emerald: 'text-emerald-600', violet: 'text-violet-600',
}
const BADGE_COLOR: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  violet:  'bg-violet-100  text-violet-700',
}
const DOT_COLOR: Record<string, string> = {
  emerald: 'border-emerald-500 bg-emerald-500',
  violet:  'border-violet-500  bg-violet-500',
}


/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function Checkout() {
  const router       = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)
  const cartData     = useSelector((state: RootState) => state.cart.cartData)

  /* ── Form state ── */
  const [address, setAddress] = useState<AddressState>({
    fullName: '', mobile: '', city: '', state: '', pincode: '', fullAddress: '',
  })

  /* ── UI state ── */
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [orderPlaced,   setOrderPlaced]   = useState(false)
  const [isLoading,     setIsLoading]     = useState(false)
  const [locationError, setLocationError] = useState('')
  const [orderError,    setOrderError]    = useState('')
  const [paidTotal,     setPaidTotal]     = useState(0)

  /* ── Coupon ── */
  const [coupon,        setCoupon]        = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError,   setCouponError]   = useState('')

  /* ── Map position ── */
  const [position,      setPosition]      = useState<[number, number] | null>(null)
  const [mapReady,      setMapReady]       = useState(false)

  /* ─── Redirect if cart is empty ─── */
  useEffect(() => {
    if (!cartData || cartData.length === 0) {
      router.push('/user/cart')
    }
  }, [cartData, router])

  /* ─── Detect GPS on mount ─── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition([20.5937, 78.9629])
      setMapReady(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
        setMapReady(true)
      },
      () => {
        setLocationError('Could not detect your location. Use the map search bar to find your address.')
        setPosition([20.5937, 78.9629])
        setMapReady(true)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
  }, [])

  /* ─── Pre-fill name & mobile from user profile ─── */
  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.name   || '',
        mobile:   userData.mobile || '',
      }))
    }
  }, [userData])

  /* ─── Reverse-geocode whenever pin moves ─── */
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await res.json()
      if (data?.address) {
        const a = data.address
        setAddress((prev) => ({
          ...prev,
          city:        a.city || a.town || a.village || prev.city,
          state:       a.state    || prev.state,
          pincode:     a.postcode || prev.pincode,
          fullAddress: data.display_name || prev.fullAddress,
        }))
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (position) reverseGeocode(position[0], position[1])
  }, [position, reverseGeocode])

  const handleMarkerDrag = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng])
  }, [])

  const handleMapSearch = useCallback((lat: number, lng: number, label: string) => {
    setPosition([lat, lng])
    setAddress((prev) => ({ ...prev, fullAddress: label }))
    setLocationError('')
  }, [])

  /* ─── Coupon ─── */
  const discount = couponApplied && VALID_COUPONS[coupon.toUpperCase()]
    ? VALID_COUPONS[coupon.toUpperCase()]
    : 0

  const handleCoupon = () => {
    if (VALID_COUPONS[coupon.toUpperCase()]) {
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponApplied(false)
      setCouponError('Invalid code. Try SAVE50, FIRST100 or FRESH20.')
    }
  }

  /* ─── Totals ─── */
  const subtotal   = cartData.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery   = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const finalTotal = subtotal + delivery - discount

  const buildPayload = (extraFields: Record<string, any> = {}) => ({
    userId: userData?._id ? String(userData._id) : undefined,
    items: cartData.map((item) => ({
      grocery:  String(item._id),
      name:     item.name,
      price:    Number(item.price),
      unit:     item.unit || "unit",
      quantity: item.quantity,
      image:    item.image || '',
    })),
    totalAmount:   finalTotal,
    address: {
      fullName:    address.fullName,
      mobile:      address.mobile,
      city:        address.city,
      state:       address.state,
      pincode:     address.pincode,
      fullAddress: address.fullAddress,
      latitude:    position ? position[0] : null,
      longitude:   position ? position[1] : null,
    },
    paymentMethod: paymentMethod === 'upi' ? 'online' : 'cod',
    ...extraFields,
  })

  /* ──────────────────────────────────────────────
     RAZORPAY FLOW
  ────────────────────────────────────────────── */
  const openRazorpay = async () => {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      setOrderError('Failed to load Razorpay. Check your connection.')
      setIsLoading(false)
      return
    }

    // 1. Create order on backend → get razorpayOrderId
    const { data } = await axios.post('/api/auth/user/order', buildPayload())

    if (!data.success) {
      setOrderError(data.message || 'Could not create Razorpay order.')
      setIsLoading(false)
      return
    }

    const {
      razorpayOrderId,
      amount,
      currency,
      key,
      orderId: dbOrderId,
    } = data

    // 2. Open Razorpay checkout
    const options = {
      key:          key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency,
      name:         'FreshCart',
      description:  'Grocery Order',
      order_id:     razorpayOrderId,
      prefill: {
        name:    address.fullName,
        contact: address.mobile,
        email:   userData?.email || '',
      },
      theme: { color: '#059669' },

      // 3. On success → verify on backend
      handler: async (response: {
        razorpay_payment_id: string
        razorpay_order_id:   string
        razorpay_signature:  string
      }) => {
        try {
          const verifyRes = await axios.post('/api/auth/user/verify', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_signature:  response.razorpay_signature,
            dbOrderId,
          })

          if (verifyRes.data.success) {
            setPaidTotal(finalTotal)
            setOrderPlaced(true)
          } else {
            setOrderError('Payment verification failed. Contact support.')
          }
        } catch {
          setOrderError('Payment verification error. Contact support.')
        } finally {
          setIsLoading(false)
        }
      },

      modal: {
        ondismiss: () => {
          setIsLoading(false)
          setOrderError('Payment cancelled. Please try again.')
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (resp: any) => {
      setOrderError(`Payment failed: ${resp.error?.description || 'Unknown error'}`)
      setIsLoading(false)
    })
    rzp.open()
  }

// console.log("USER DATA:", userData)
// console.log("PAYLOAD:", buildPayload())

  /* ─── Main handler ─── */
  const handleOrder = async () => {
    setOrderError('')

    if (!address.fullName || !address.mobile || !address.fullAddress) {
      setOrderError('Please fill your Name, Mobile Number, and Full Address.')
      return
    }

    setIsLoading(true)

    try {
      if (paymentMethod === 'cod') {
        await axios.post('/api/auth/user/order', buildPayload())
        setPaidTotal(finalTotal)
        setOrderPlaced(true)
        setIsLoading(false)
      } else {
        // UPI / Online → Razorpay
        await openRazorpay()
        // isLoading cleared inside openRazorpay callbacks
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.'
      setOrderError(msg)
      setIsLoading(false)
    }
  }

  /* ══════════════════════════════════════════════════════════
     SUCCESS SCREEN
  ══════════════════════════════════════════════════════════ */
  if (orderPlaced) {
    return (
      <div>
        <OrderSuccess/>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════
     MAIN RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/20">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="w-[95%] md:w-[85%] lg:w-[78%] mx-auto py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/user/cart')}
            className="flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-800 transition group"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            Back to Cart
          </button>
          <h1
            className="text-2xl font-bold text-gray-800 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Secure Checkout
          </h1>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <FaLock className="text-emerald-500 text-xs" />
            <span className="hidden sm:inline">SSL Secured</span>
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="w-[95%] md:w-[85%] lg:w-[78%] mx-auto py-10">
        <div className="grid lg:grid-cols-[1fr_390px] gap-8">

          {/* ════════════════════════════════
              LEFT COLUMN
          ════════════════════════════════ */}
          <div className="space-y-6">

            {/* ── 1. Delivery Address ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <SectionHeader
                gradient="from-emerald-600 to-teal-500"
                icon={<FaMapMarkerAlt />}
                title="Delivery Address"
                sub="Where should we deliver?"
              />
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    icon={<FaUser />} value={address.fullName} placeholder="Full Name *"
                    onChange={(v) => setAddress({ ...address, fullName: v })}
                  />
                  <InputField
                    icon={<FaPhone />} value={address.mobile} placeholder="Mobile Number *" type="tel"
                    onChange={(v) => setAddress({ ...address, mobile: v })}
                  />
                </div>
                <InputField
                  icon={<FaMapMarkerAlt />} value={address.fullAddress}
                  placeholder="Full Address (auto-filled from map or type manually) *"
                  onChange={(v) => setAddress({ ...address, fullAddress: v })}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    icon={<FaCity />}    value={address.city}    placeholder="City"
                    onChange={(v) => setAddress({ ...address, city: v })}
                  />
                  <InputField
                    icon={<FaGlobe />}   value={address.state}   placeholder="State"
                    onChange={(v) => setAddress({ ...address, state: v })}
                  />
                  <InputField
                    icon={<FaMailBulk />} value={address.pincode} placeholder="Pincode" type="number"
                    onChange={(v) => setAddress({ ...address, pincode: v })}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── 2. Map ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <SectionHeader
                gradient="from-teal-600 to-cyan-500"
                icon={<FaMapMarkerAlt />}
                title="Pin Your Location"
                sub="Use the search bar inside the map, or drag the green pin to your exact spot"
              />
              <div className="p-6 space-y-3">
                {locationError && (
                  <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm">
                    <FaMapMarkerAlt className="shrink-0 mt-0.5" />
                    <span>{locationError}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-teal-50 text-teal-700 rounded-xl px-3 py-2 text-xs">
                  <FaMapMarkerAlt className="shrink-0" />
                  <span>
                    <strong>Tip:</strong> Use the search bar inside the map to find any address.
                    City, state, pincode, and address fields above will auto-fill when you drop the pin.
                  </span>
                </div>
                <div className="h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative">
                  {mapReady && position ? (
                    <DeliveryMap
                      position={position}
                      onDragEnd={handleMarkerDrag}
                      onSearch={handleMapSearch}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm gap-2">
                      <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                      Detecting your location…
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 text-center">
                  📍 Drag the green pin to fine-tune your exact delivery location
                </p>
              </div>
            </motion.div>

            {/* ── 3. Payment Method ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <SectionHeader
                gradient="from-violet-600 to-purple-500"
                icon={<FaLock />}
                title="Payment Method"
                sub="Choose how you'd like to pay"
              />
              <div className="p-6 space-y-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const active = paymentMethod === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        active
                          ? COLOR_ACTIVE[opt.color]
                          : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                      }`}
                    >
                      <span className={active ? ICON_COLOR[opt.color] : 'text-gray-400'}>
                        {opt.icon}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                          {opt.label}
                          {opt.badge && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              active ? BADGE_COLOR[opt.color] : 'bg-gray-100 text-gray-400'
                            }`}>
                              {opt.badge}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        active ? DOT_COLOR[opt.color] : 'border-gray-300'
                      }`}>
                        {active && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  )
                })}

                {/* ── Razorpay badge when UPI selected ── */}
                <AnimatePresence>
                  {paymentMethod === 'upi' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                    >
                      <div className="pt-3 space-y-3">
                        <div className="flex items-center gap-3 bg-violet-50 rounded-2xl px-4 py-3">
                          <SiRazorpay className="text-2xl text-violet-600 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-violet-700">Powered by Razorpay</p>
                            <p className="text-xs text-violet-500">
                              You will be redirected to the secure Razorpay checkout after clicking Pay
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pl-1">
                          <span className="text-xs text-gray-400">Accepted:</span>
                          <div className="flex gap-3 text-gray-400">
                            <SiGooglepay className="text-2xl" title="Google Pay" />
                            <SiPhonepe   className="text-xl"  title="PhonePe"    />
                            <SiPaytm     className="text-xl"  title="Paytm"      />
                            <SiRazorpay  className="text-xl"  title="Razorpay"   />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

          </div>

          {/* ════════════════════════════════
              RIGHT — ORDER SUMMARY
          ════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="h-fit sticky top-24"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              <div className="bg-linear-to-r from-gray-800 to-gray-700 px-6 py-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <FaShoppingBag /> Order Summary
                </h2>
                <p className="text-gray-300 text-sm mt-0.5">
                  {cartData.length} item{cartData.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="p-6 space-y-5">

                {/* Item list */}
                <div className="space-y-3 max-h-44 overflow-y-auto pr-1">
                  {cartData.map((item) => (
                    <div key={String(item._id)} className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                        {fmt(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-dashed border-gray-200" />

                {/* Coupon */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Promo Code</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        value={coupon}
                        onChange={(e) => {
                          setCoupon(e.target.value)
                          setCouponApplied(false)
                          setCouponError('')
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                        placeholder="Enter coupon"
                        className="w-full pl-9 pr-3 h-10 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm transition"
                      />
                    </div>
                    <button
                      onClick={handleCoupon}
                      className="px-4 h-10 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  <AnimatePresence>
                    {couponApplied && (
                      <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-xs text-emerald-600 flex items-center gap-1"
                      >
                        <FaCheckCircle /> Coupon applied! You save {fmt(discount)}.
                      </motion.p>
                    )}
                    {couponError && (
                      <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-xs text-red-500"
                      >
                        {couponError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <hr className="border-dashed border-gray-200" />

                {/* Pricing */}
                <div className="space-y-2.5 text-sm">
                  <PriceLine label="Subtotal" value={fmt(subtotal)} />
                  <PriceLine
                    label="Delivery"
                    value={delivery === 0 ? 'FREE' : fmt(delivery)}
                    valueClass={delivery === 0 ? 'text-emerald-600 font-semibold' : ''}
                  />
                  {discount > 0 && (
                    <PriceLine
                      label="Discount"
                      value={`− ${fmt(discount)}`}
                      valueClass="text-emerald-600 font-semibold"
                    />
                  )}
                  {delivery !== 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                      🛵 Add {fmt(DELIVERY_THRESHOLD - subtotal)} more for FREE delivery!
                    </p>
                  )}
                  <hr className="border-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base text-gray-800">Total</span>
                    <span className="text-xl font-bold text-emerald-600">{fmt(finalTotal)}</span>
                  </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {orderError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                    >
                      {orderError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Place Order / Pay Now button */}
                <button
                  onClick={handleOrder}
                  disabled={isLoading}
                  className="w-full cursor-pointer py-4 rounded-2xl font-bold text-white text-base bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><FaSpinner className="animate-spin" /> Processing…</>
                  ) : paymentMethod === 'cod' ? (
                    <><FaCheckCircle /> Place Order · {fmt(finalTotal)}</>
                  ) : (
                    <><FaLock /> Pay Securely · {fmt(finalTotal)}</>
                  )}
                </button>

                <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                  <FaLock className="text-emerald-400" /> 256-bit SSL · 100% Safe & Secure
                </p>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
══════════════════════════════════════════════════════════ */

function SectionHeader({
  gradient, icon, title, sub,
}: { gradient: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className={`bg-linear-to-r ${gradient} px-6 py-4`}>
      <h2 className="text-white font-bold text-lg flex items-center gap-2">{icon} {title}</h2>
      <p className="text-white/70 text-sm mt-0.5">{sub}</p>
    </div>
  )
}

function PriceLine({
  label, value, valueClass = '',
}: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between text-gray-500">
      <span>{label}</span>
      <span className={`font-medium text-gray-700 ${valueClass}`}>{value}</span>
    </div>
  )
}

interface InputFieldProps {
  icon:         React.ReactNode
  value:        string
  onChange:     (v: string) => void
  placeholder:  string
  type?:        string
  accentColor?: string
}

function InputField({
  icon, value, onChange, placeholder, type = 'text', accentColor = 'emerald',
}: InputFieldProps) {
  const ringClass =
    accentColor === 'violet' ? 'focus:ring-violet-500' :
    accentColor === 'blue'   ? 'focus:ring-blue-500'   :
    accentColor === 'teal'   ? 'focus:ring-teal-500'   :
                               'focus:ring-emerald-500'

  const iconFocusClass =
    accentColor === 'violet' ? 'group-focus-within:text-violet-500' :
    accentColor === 'blue'   ? 'group-focus-within:text-blue-500'   :
    accentColor === 'teal'   ? 'group-focus-within:text-teal-500'   :
                               'group-focus-within:text-emerald-500'

  return (
    <div className="relative group">
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-colors ${iconFocusClass}`}>
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 h-12 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm text-gray-800 placeholder:text-gray-400 ${ringClass}`}
      />
    </div>
  )
}

