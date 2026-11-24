'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Minus, Star, ShoppingBag, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQty } from '@/redux/cartSlice'
import { IGrocery } from '@/types/grocery'

/** Light spice tints — product photos are blended onto them (white bg → tint). */
export const CARD_COLORS = ['#F8E2B0', '#E8E9C9', '#F6D5C5', '#EFDCC6', '#F4E6C3', '#E2E8D5']

const WEIGHT_UNITS = ['g', 'kg', 'ml', 'liter']

export const formatPrice = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`

/** "100 G" from the first pack size, "1 PACK" for pack/piece units; nothing for a bare "g". */
function packLabel(item: IGrocery) {
  if (item.variants?.length) return item.variants[0].label
  if (item.unit && !WEIGHT_UNITS.includes(item.unit)) return `1 ${item.unit}`
  return ''
}

const btn =
  'w-full h-11 rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0_#0a0a0a] font-bold text-sm transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#0a0a0a]'

function MasalaCard({ item }: { item: IGrocery; color?: string }) {
  const dispatch = useDispatch<AppDispatch>()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const id = item._id.toString()
  const only = item.variants?.length === 1 ? item.variants[0] : null
  const lineId = only ? `${id}::${only.label}` : id
  const quantity = useSelector((s: RootState) => s.cart.cartData.find((i) => (i.cartKey ?? i._id) === lineId)?.quantity ?? 0)

  const price = Number(item.price)
  const discount = Number(item.discount) || 0
  const original =
    item.originalPrice && Number(item.originalPrice) > price
      ? Number(item.originalPrice)
      : discount > 0 ? Math.round(price / (1 - discount / 100)) : null
  const off = original ? Math.round(((original - price) / original) * 100) : 0
  const stock = item.stock ?? Infinity
  const outOfStock = stock === 0
  const lowStock = stock > 0 && stock <= 5
  const hasOptions = (item.variants?.length ?? 0) > 1
  const pack = packLabel(item)

  const add = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    dispatch(addToCart({
      _id: id, name: item.name, price, image: only?.image || item.image, quantity: 1,
      unit: only ? only.label : item.unit || '',
      ...(only ? { variant: only.label, cartKey: lineId } : {}),
    }))
  }
  const remove = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    dispatch(decreaseQty(lineId))
  }

  return (
    <Link
      href={`/products/${id}`}
      className="group relative flex flex-col h-full rounded-[22px] bg-white p-2.5 border border-neutral-900/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_40px_-12px_rgba(120,20,10,0.25)] hover:border-red-600/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden isolate bg-[#F6EEE3]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#fff_0%,rgba(255,255,255,0)_62%)]" />
        <Image
          src={item.image || '/categories/masalas.webp'}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 22vw"
          className={`object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out ${outOfStock ? 'grayscale opacity-60' : ''}`}
        />

        {/* badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2 z-10">
          {off > 0 && !outOfStock ? (
            <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold tracking-wide">{off}% OFF</span>
          ) : <span />}
          {item.rating ? (
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold text-neutral-900 shadow-sm">
              <Star size={11} className="fill-amber-500 text-amber-500" /> {item.rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        {outOfStock && (
          <span className="absolute inset-x-0 bottom-3 mx-auto w-fit px-3 py-1 rounded-full bg-neutral-950 text-white text-[11px] font-bold uppercase tracking-wider z-10">Sold out</span>
        )}
        {lowStock && (
          <span className="absolute left-2.5 bottom-2.5 px-2.5 py-1 rounded-full bg-neutral-950/85 text-white text-[10px] font-semibold z-10">Only {stock} left</span>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col flex-1 px-1.5 pt-3.5 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-600 truncate">{item.category}</p>
        <h3 className="mt-1 text-[15px] md:text-base font-semibold text-neutral-900 leading-snug line-clamp-2 min-h-[2.6em] group-hover:text-red-700 transition-colors">
          {item.name}
        </h3>
        <p className="font-mono text-[11px] tracking-wide text-neutral-500 mt-1 flex items-center gap-1.5 min-h-4">
          {pack && <span className="uppercase">{pack}</span>}
          {pack && item.reviewCount ? <span>·</span> : null}
          {item.reviewCount ? <span>{item.reviewCount} {item.reviewCount === 1 ? 'review' : 'reviews'}</span> : null}
        </p>

        <div className="flex items-baseline flex-wrap gap-x-2 mt-auto pt-3">
          <span className="text-xl font-bold text-neutral-950">{formatPrice(price)}</span>
          {original && <span className="text-sm text-neutral-400 line-through">{formatPrice(original)}</span>}
        </div>
        {original && <p className="text-[11px] font-semibold text-green-700 mt-0.5">You save {formatPrice(original - price)}</p>}

        <div className="mt-3.5">
          <AnimatePresence mode="wait" initial={false}>
            {!mounted ? (
              <div className={`${btn} bg-red-600`} />
            ) : outOfStock ? (
              <div className={`${btn} flex items-center justify-center bg-neutral-100 text-neutral-400 border-neutral-200 shadow-none`}>Out of stock</div>
            ) : hasOptions ? (
              <span className={`${btn} flex items-center justify-center gap-2 bg-neutral-950 text-white group-hover:bg-red-600`}>
                Choose pack <ArrowRight size={15} />
              </span>
            ) : quantity > 0 ? (
              <motion.div
                key="qty"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className={`${btn} flex items-center justify-between px-1.5 bg-red-600 text-white`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              >
                <button onClick={remove} aria-label="Remove one" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 cursor-pointer"><Minus size={15} /></button>
                <span>{quantity} in cart</span>
                <button onClick={add} aria-label="Add one more" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/15 cursor-pointer"><Plus size={15} /></button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                onClick={add}
                className={`${btn} flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer`}
              >
                <ShoppingBag size={16} /> Add to cart
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Link>
  )
}

export default MasalaCard
