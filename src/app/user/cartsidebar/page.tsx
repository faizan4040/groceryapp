'use client'

import React, { useEffect } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { increaseQty, decreaseQty, removeFromCart, clearCart, ICartItem, lineKey } from '@/redux/cartSlice'
import { SPICE_CATEGORIES } from '@/components/SpiceArt'

const fmt = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`

// keep in sync with /user/cart and /user/checkout
const DELIVERY_THRESHOLD = 499
const DELIVERY_FEE = 49

const WEIGHT_UNITS = ['g', 'kg', 'ml', 'liter']

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const cartData: ICartItem[] = useSelector((state: RootState) => state.cart.cartData)

  const subtotal = cartData.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery = subtotal === 0 || subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const total = subtotal + delivery
  const totalQty = cartData.reduce((s, i) => s + i.quantity, 0)
  const progress = Math.min(100, (subtotal / DELIVERY_THRESHOLD) * 100)
  const remaining = Math.max(0, DELIVERY_THRESHOLD - subtotal)
  const empty = cartData.length === 0

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const goCheckout = () => { onClose(); router.push('/user/checkout') }
  const clearAll = () => { if (window.confirm('Remove all items from your cart?')) dispatch(clearCart()) }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-[3px] z-80"
            onClick={onClose}
          />

          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#FBF6EE] z-90 flex flex-col shadow-2xl"
            role="dialog" aria-modal="true" aria-label="Shopping cart"
          >
            {/* ── header ───────────────────────────────────── */}
            <div className="relative shrink-0 bg-neutral-950 text-white px-5 pt-5 pb-5 overflow-hidden">
              <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-red-600/25 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative w-11 h-11 rounded-full bg-red-600 flex items-center justify-center">
                    <ShoppingBag size={20} />
                    {totalQty > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-white text-neutral-950 text-[11px] font-bold flex items-center justify-center">
                        {totalQty > 99 ? '99+' : totalQty}
                      </span>
                    )}
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl leading-none">Your Cart</h2>
                    <p className="text-xs text-white/55 mt-1">
                      {empty ? 'Nothing here yet' : `${totalQty} ${totalQty === 1 ? 'item' : 'items'} · ${fmt(subtotal)}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close cart"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:bg-white hover:text-neutral-950 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* free-delivery progress */}
              {!empty && (
                <div className="relative mt-5">
                  <p className="flex items-center gap-2 text-xs text-white/80">
                    <Truck size={15} className={delivery === 0 ? 'text-green-400' : 'text-red-400'} />
                    {delivery === 0
                      ? <span><strong className="text-white">Free delivery</strong> unlocked on this order</span>
                      : <span>Add <strong className="text-white">{fmt(remaining)}</strong> more for <strong className="text-white">free delivery</strong></span>}
                  </p>
                  <div className="mt-2.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${delivery === 0 ? 'bg-green-500' : 'bg-red-600'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── body ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              {empty ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center px-6 pt-10 pb-8"
                >
                  <div className="relative w-44 h-32">
                    <span className="absolute inset-x-4 bottom-0 h-24 rounded-[50%] bg-red-600/10" />
                    <Image src="/spices/ground-spices.png" alt="" fill sizes="176px" className="object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.2)]" />
                  </div>
                  <h3 className="font-serif text-[28px] text-neutral-950 mt-5">Your cart is empty</h3>
                  <p className="text-sm text-neutral-500 mt-2 max-w-64">Add some pure, freshly packed masala and bring real taste to your kitchen.</p>
                  <Link
                    href="/#shop"
                    onClick={onClose}
                    className="mt-6 inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-neutral-950 shadow-[3px_3px_0_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#0a0a0a] transition"
                  >
                    Start shopping <ArrowRight size={17} />
                  </Link>

                  <div className="w-full mt-10">
                    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      <span className="flex-1 h-px bg-neutral-900/10" /> Shop by category <span className="flex-1 h-px bg-neutral-900/10" />
                    </p>
                    <div className="grid grid-cols-3 gap-2.5 mt-4">
                      {SPICE_CATEGORIES.map((c) => (
                        <Link
                          key={c.name}
                          href={c.href}
                          onClick={onClose}
                          className="group flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-neutral-900/5 hover:border-red-600/30 hover:shadow-md transition"
                        >
                          <span className="relative w-14 h-10">
                            {c.image && <Image src={c.image} alt="" fill sizes="56px" className="object-contain group-hover:scale-110 transition-transform" />}
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-800 leading-tight">{c.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between px-1 mb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">In your cart</p>
                    <button onClick={clearAll} className="text-xs font-medium text-neutral-500 hover:text-red-600 transition cursor-pointer">
                      Clear all
                    </button>
                  </div>

                  <ul className="space-y-2.5">
                    <AnimatePresence initial={false}>
                      {cartData.map((item) => {
                        const key = lineKey(item)
                        const pack = item.variant || (item.unit && !WEIGHT_UNITS.includes(item.unit) ? `1 ${item.unit}` : '')
                        return (
                          <motion.li
                            key={key}
                            layout
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                            className="flex gap-3.5 p-3 rounded-2xl bg-white border border-neutral-900/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                          >
                            <Link
                              href={`/products/${item._id}`}
                              onClick={onClose}
                              className="relative w-20 h-20 shrink-0 rounded-xl bg-[#F6EEE3] overflow-hidden isolate"
                            >
                              {item.image && (
                                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                              )}
                            </Link>

                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-start gap-2">
                                <Link
                                  href={`/products/${item._id}`}
                                  onClick={onClose}
                                  className="flex-1 text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 hover:text-red-700 transition"
                                >
                                  {item.name}
                                </Link>
                                <button
                                  onClick={() => dispatch(removeFromCart(key))}
                                  aria-label={`Remove ${item.name}`}
                                  className="w-7 h-7 -mt-1 -mr-1 shrink-0 rounded-full flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <p className="font-mono text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wide">
                                {pack ? `${pack} · ` : ''}{fmt(item.price)} each
                              </p>

                              <div className="flex items-center justify-between mt-auto pt-2">
                                <div className="flex items-center h-8 rounded-full border border-neutral-900/15 bg-[#FBF6EE]">
                                  <button
                                    onClick={() => dispatch(decreaseQty(key))}
                                    aria-label="Decrease quantity"
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:text-red-600 cursor-pointer"
                                  >
                                    {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={14} />}
                                  </button>
                                  <span className="w-6 text-center text-sm font-bold text-neutral-900 tabular-nums">{item.quantity}</span>
                                  <button
                                    onClick={() => dispatch(increaseQty(key))}
                                    aria-label="Increase quantity"
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:text-red-600 cursor-pointer"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <span className="text-base font-bold text-neutral-950 tabular-nums">{fmt(item.price * item.quantity)}</span>
                              </div>
                            </div>
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                  </ul>
                </div>
              )}
            </div>

            {/* ── summary + checkout ──────────────────────── */}
            {!empty && (
              <div className="shrink-0 bg-white border-t border-neutral-900/10 px-5 pt-4 pb-5 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.15)]">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-neutral-900 tabular-nums">{fmt(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <dt>Delivery</dt>
                    <dd className={delivery === 0 ? 'font-semibold text-green-700' : 'font-medium text-neutral-900 tabular-nums'}>
                      {delivery === 0 ? 'FREE' : fmt(delivery)}
                    </dd>
                  </div>
                  <div className="flex justify-between items-baseline pt-2.5 mt-1 border-t border-dashed border-neutral-900/15">
                    <dt className="font-semibold text-neutral-900">Total</dt>
                    <dd className="font-serif text-[28px] leading-none text-neutral-950 tabular-nums">{fmt(total)}</dd>
                  </div>
                </dl>

                <button
                  onClick={goCheckout}
                  className="mt-4 w-full h-13 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 border-2 border-neutral-950 shadow-[3px_3px_0_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#0a0a0a] transition cursor-pointer"
                >
                  <Lock size={16} /> Checkout · {fmt(total)}
                </button>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <Link href="/user/cart" onClick={onClose} className="font-semibold text-neutral-800 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900">
                    View full cart
                  </Link>
                  <button onClick={onClose} className="font-medium text-neutral-500 hover:text-neutral-900 cursor-pointer">
                    Continue shopping
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
