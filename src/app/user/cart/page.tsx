'use client'

import { ArrowLeft, ShoppingBasket, Trash2, Plus, Minus, Tag, Truck, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  ICartItem,
} from '@/redux/cartSlice'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n)

const DELIVERY_THRESHOLD = 499
const DELIVERY_FEE = 49
const DISCOUNT_RATE = 0.05

// ─── Component ────────────────────────────────────────────────────────────────
export default function CartPage() {
  const dispatch = useDispatch()
  const cartData: ICartItem[] = useSelector((state: RootState) => state.cart.cartData)

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  // ── Calculations ─────────────────────────────────────────────────────────
  const subtotal = cartData.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const discount = promoApplied ? subtotal * DISCOUNT_RATE : 0
  const delivery = subtotal - discount >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal - discount + delivery
  const savings = discount + (delivery === 0 && subtotal > 0 ? DELIVERY_FEE : 0)
  const totalQty = cartData.reduce((s, i) => s + i.quantity, 0)

  const handlePromo = () => {
    if (promoCode.trim().toUpperCase() === 'FRESH5') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
      setPromoApplied(false)
    }
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f7f2] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="text-center bg-white rounded-3xl shadow-lg px-10 py-16 max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingBasket size={36} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your cart is empty
          </h2>
          <p className="text-gray-400 text-sm mb-7 leading-relaxed">
            Looks like you haven't added any fresh groceries yet. Let's fix that!
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 active:scale-95 transition-all text-sm shadow-md shadow-green-200"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  // ── Main cart ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f7f2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
      `}</style>

      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              My Cart
            </h1>
          </div>
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {totalQty} {totalQty === 1 ? 'item' : 'items'}
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ── Left: Items ──────────────────────────────────────────────── */}
        <section>
          {/* Delivery progress */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mb-3 text-sm text-green-700 font-medium">
            <Truck size={16} />
            {delivery === 0
              ? <span>🎉 You qualify for <strong>free delivery!</strong></span>
              : <span>Add {fmt(DELIVERY_THRESHOLD - (subtotal - discount))} more for <strong>free delivery</strong></span>}
          </div>
          <div className="w-full bg-green-100 rounded-full h-1.5 mb-5 overflow-hidden">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((subtotal - discount) / DELIVERY_THRESHOLD) * 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          {/* Item cards */}
          <div className="space-y-3">
            <AnimatePresence>
              {cartData.map((item: ICartItem, idx: number) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className="bg-white rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-green-50 shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <ShoppingBasket size={28} className="text-green-300" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>

                    <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                      {/* Price */}
                      <div>
                        <p className="text-base font-bold text-gray-900">
                          {fmt(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">{fmt(item.price)} each</p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => dispatch(decreaseQty(item._id))}
                          className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 text-green-700 flex items-center justify-center transition-colors active:scale-90"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-6 text-center font-bold text-gray-800 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => dispatch(increaseQty(item._id))}
                          className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors active:scale-90 shadow-sm"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>

                        <button
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors ml-1 active:scale-90"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Right: Order Summary ──────────────────────────────────────── */}
        <aside className="bg-white rounded-3xl shadow-sm p-6 sticky top-20 space-y-5">
          <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Order Summary
          </h2>

          {/* Promo */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Promo Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={promoCode}
                  onChange={(e) => { setPromoCode(e.target.value); setPromoError('') }}
                  placeholder="e.g. FRESH5"
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
              <button
                onClick={handlePromo}
                disabled={promoApplied}
                className="px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {promoApplied ? '✓' : 'Apply'}
              </button>
            </div>
            {promoApplied && (
              <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1">
                <ShieldCheck size={12} /> FRESH5 applied — 5% off!
              </p>
            )}
            {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
          </div>

          {/* Line items */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
              <span className="font-medium text-gray-800">{fmt(subtotal)}</span>
            </div>

            {promoApplied && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex justify-between text-green-600 font-medium"
              >
                <span>Promo Discount (5%)</span>
                <span>− {fmt(discount)}</span>
              </motion.div>
            )}

            <div className="flex justify-between text-gray-600">
              <span className="flex items-center gap-1"><Truck size={13} /> Delivery</span>
              {delivery === 0
                ? <span className="text-green-600 font-semibold">FREE</span>
                : <span className="font-medium text-gray-800">{fmt(delivery)}</span>}
            </div>

            {savings > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-green-700 text-xs font-semibold flex items-center gap-1.5">
                🎉 You're saving {fmt(savings)} on this order!
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800 text-base">Total</span>
            <span className="text-2xl font-bold text-green-700" style={{ fontFamily: "'Playfair Display', serif" }}>
              {fmt(total)}
            </span>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-green-200 transition-all"
          >
            Proceed to Checkout →
          </motion.button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Secure payment</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Truck size={12} /> Fast delivery</span>
          </div>
        </aside>
      </main>
    </div>
  )
}