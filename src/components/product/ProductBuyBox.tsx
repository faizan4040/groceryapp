'use client'

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import { Minus, Plus, ShoppingCart, Check, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { AppDispatch } from '@/redux/store'
import { addToCart } from '@/redux/cartSlice'

export type Variant = { label: string; price: number; originalPrice?: number; stock?: number; image?: string }

interface Props {
  id: string
  name: string
  image: string
  unit: string
  variants: Variant[]
  /** true when variants came from the product's own pack sizes (not a single fallback) */
  hasVariants: boolean
  /** controlled selection (used so the gallery can follow the chosen pack) */
  selected?: number
  onSelect?: (i: number) => void
}

export default function ProductBuyBox({ id, name, image, unit, variants, hasVariants, selected, onSelect }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const [ownSel, setOwnSel] = useState(0)
  const sel = selected ?? ownSel
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const v = variants[sel]
  const stock = v.stock ?? Infinity
  const outOfStock = stock <= 0
  const maxQty = Number.isFinite(stock) ? Math.max(1, Math.min(stock, 20)) : 20
  const original = v.originalPrice && v.originalPrice > v.price ? v.originalPrice : null
  const off = original ? Math.round(((original - v.price) / original) * 100) : 0

  const pick = (i: number) => { setOwnSel(i); onSelect?.(i); setQty(1) }

  const add = () => {
    dispatch(addToCart({
      _id: id,
      name,
      price: v.price,
      image: v.image || image,
      unit: hasVariants ? v.label : unit,
      quantity: qty,
      ...(hasVariants ? { variant: v.label, cartKey: `${id}::${v.label}` } : {}),
    }))
    setAdded(true)
    toast.success(`${name}${hasVariants ? ` (${v.label})` : ''} added to cart`)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* pack size */}
      <div>
        <p className="text-[15px] font-semibold text-brown-900 mb-2.5">Pack size</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((opt, i) => {
            const active = i === sel
            const soldOut = (opt.stock ?? 1) <= 0
            return (
              <button
                key={opt.label}
                onClick={() => pick(i)}
                aria-pressed={active}
                className={`relative min-w-22 px-6 py-2.5 rounded-full text-sm font-semibold border transition cursor-pointer ${
                  active
                    ? 'bg-brown-900 border-brown-900 text-brown-50'
                    : 'bg-transparent border-brown-300 text-brown-900 hover:border-brown-900'
                } ${soldOut ? 'opacity-50 line-through' : ''}`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* quantity + price */}
      <div>
        <p className="text-[15px] font-semibold text-brown-900 mb-2.5">Quantity</p>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center h-12 rounded-full border border-brown-300">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="w-11 h-11 flex items-center justify-center text-brown-900 disabled:opacity-30 cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-semibold text-brown-900" aria-live="polite">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              disabled={qty >= maxQty}
              aria-label="Increase quantity"
              className="w-11 h-11 flex items-center justify-center text-brown-900 disabled:opacity-30 cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={v.price * qty}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                className="font-display font-extrabold text-[32px] md:text-4xl text-brown-900 leading-none"
              >
                ₹{(v.price * qty).toLocaleString('en-IN')}
              </motion.span>
            </AnimatePresence>
            {original && (
              <>
                <span className="text-base text-brown-400 line-through">₹{(original * qty).toLocaleString('en-IN')}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brown-900 text-brown-50">{off}% off</span>
              </>
            )}
          </div>
        </div>
        {Number.isFinite(stock) && stock > 0 && stock <= 10 && (
          <p className="text-xs font-semibold text-brown-600 mt-2">Only {stock} left in stock</p>
        )}
      </div>

      {/* action */}
      <button
        onClick={add}
        disabled={outOfStock}
        className="w-full py-4 rounded-full bg-brown-900 hover:bg-brown-600 text-brown-50 font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-brown-900/15 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
      >
        {outOfStock ? 'Out of stock' : added ? <><Check size={19} /> Added to cart</> : <><ShoppingCart size={19} /> Add to cart</>}
      </button>

      <a href="#details" className="inline-flex items-center gap-2 text-sm font-medium text-brown-900 underline underline-offset-4 decoration-brown-400 hover:decoration-brown-900">
        Ingredients & nutrition <ArrowRight size={15} />
      </a>
    </div>
  )
}
