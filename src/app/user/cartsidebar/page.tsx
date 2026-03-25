'use client'

import React from 'react'
import { X, ShoppingBasket, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { increaseQty, decreaseQty, removeFromCart, ICartItem } from '@/redux/cartSlice'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(n)

const DELIVERY_THRESHOLD = 499
const DELIVERY_FEE = 49

// ─── Props ────────────────────────────────────────────────────────────────────
interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const dispatch = useDispatch()
  const cartData: ICartItem[] = useSelector((state: RootState) => state.cart.cartData)

  const subtotal = cartData.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery = subtotal >= DELIVERY_THRESHOLD ? 0 : subtotal === 0 ? 0 : DELIVERY_FEE
  const total = subtotal + delivery
  const totalQty = cartData.reduce((s, i) => s + i.quantity, 0)
  const progress = Math.min(100, (subtotal / DELIVERY_THRESHOLD) * 100)
  const remaining = DELIVERY_THRESHOLD - subtotal

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-80 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-full sm:w-100 bg-white z-90 flex flex-col shadow-2xl"
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-green-100 p-2 rounded-xl">
                  <ShoppingCart size={18} className="text-green-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-base leading-tight">My Cart</h2>
                  <p className="text-xs text-gray-400">{totalQty} {totalQty === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Delivery Progress ───────────────────────────────── */}
            {subtotal > 0 && (
              <div className="px-5 py-3 bg-green-50 border-b border-green-100 shrink-0">
                {delivery === 0 ? (
                  <p className="text-xs font-semibold text-green-700 mb-1.5">
                    🎉 You've unlocked <strong>free delivery!</strong>
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-green-700 mb-1.5">
                    Add <strong>{fmt(remaining)}</strong> more for free delivery
                  </p>
                )}
                <div className="w-full bg-green-200 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* ── Items List ──────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              {cartData.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 pb-10"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBasket size={34} className="text-gray-300" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-600 text-sm">Your cart is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Add some fresh items to get started</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 bg-green-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-green-700 transition active:scale-95"
                  >
                    Browse Products
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {cartData.map((item: ICartItem) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 hover:bg-gray-100/70 transition-colors group"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <ShoppingBasket size={22} className="text-gray-300" />
                        )}
                      </div>

                      {/* Name + Price */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{fmt(item.price)} each</p>
                        <p className="text-sm font-bold text-green-700 mt-0.5">
                          {fmt(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => dispatch(removeFromCart(item._id))}
                          className="opacity-0 group-hover:opacity-100 transition w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600"
                          aria-label="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-1.5 py-1 shadow-sm">
                          <button
                            onClick={() => dispatch(decreaseQty(item._id))}
                            className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition active:scale-90"
                            aria-label="Decrease"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-5 text-center text-sm font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQty(item._id))}
                            className="w-6 h-6 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition active:scale-90"
                            aria-label="Increase"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* ── Footer: Summary + CTA ───────────────────────────── */}
            {cartData.length > 0 && (
              <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 space-y-3">
                {/* Price rows */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-700">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    {delivery === 0
                      ? <span className="text-green-600 font-semibold">FREE</span>
                      : <span className="font-medium text-gray-700">{fmt(delivery)}</span>}
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t border-dashed border-gray-200">
                    <span>Total</span>
                    <span className="text-green-700">{fmt(total)}</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex gap-2">
                  <Link
                    href="/user/cart"
                    onClick={onClose}
                    className="flex-1 text-center py-3 rounded-xl border border-green-600 text-green-700 text-sm font-semibold hover:bg-green-50 transition active:scale-95"
                  >
                    View Cart
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition shadow-md shadow-green-200"
                  >
                    Checkout <ArrowRight size={15} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}