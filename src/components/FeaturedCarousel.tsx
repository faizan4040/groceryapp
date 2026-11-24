'use client'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Minus, Plus, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQty } from '@/redux/cartSlice'

export interface FeaturedProduct {
  _id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  unit?: string
  packLabel?: string
  /** default pack size when the product has variants */
  variant?: string
  variantImage?: string
  stock?: number
  rating?: number | null
  reviewCount?: number
}

/* light backdrop + darker disc behind the pack, one pair per card */
const PALETTES = [
  { bg: '#EBDDFF', disc: '#D3BCFF' },
  { bg: '#D6EFFF', disc: '#A9DCFF' },
  { bg: '#FFF1BF', disc: '#FFDF6E' },
  { bg: '#FFDDE9', disc: '#FFB3CE' },
  { bg: '#FFE6D2', disc: '#FFC79D' },
  { bg: '#E2F3D6', disc: '#BFE3A5' },
]

const SCALES = [1, 0.86, 0.74] // centre, ±1, ±2
const GAP = 18

/* ───────────────────────────── add button ───────────────────────────── */

function AddButton({ p, big }: { p: FeaturedProduct; big: boolean }) {
  const dispatch = useDispatch<AppDispatch>()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const lineId = p.variant ? `${p._id}::${p.variant}` : p._id
  const qty = useSelector((s: RootState) => s.cart.cartData.find((i) => (i.cartKey ?? i._id) === lineId)?.quantity ?? 0)
  const out = p.stock === 0

  const base = `w-full ${big ? 'h-12 text-base' : 'h-11 text-sm'} rounded-xl border-2 border-neutral-950 shadow-[3px_3px_0_#0a0a0a] font-bold transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#0a0a0a]`

  if (out) return <div className={`${base} flex items-center justify-center bg-neutral-200 text-neutral-500 shadow-none border-neutral-300`}>Out of stock</div>

  const add = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    dispatch(addToCart({
      _id: p._id, name: p.name, price: p.price, image: p.variantImage || p.image, quantity: 1,
      unit: p.variant || p.unit || '',
      ...(p.variant ? { variant: p.variant, cartKey: lineId } : {}),
    }))
  }

  if (mounted && qty > 0) {
    return (
      <div className={`${base} flex items-center justify-between px-2 bg-red-600 text-white`}>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(decreaseQty(lineId)) }} aria-label="Remove one" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer">
          <Minus size={16} />
        </button>
        <span>{qty} in cart</span>
        <button onClick={add} aria-label="Add one more" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/15 cursor-pointer">
          <Plus size={16} />
        </button>
      </div>
    )
  }

  return (
    <button onClick={add} className={`${base} flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer`}>
      Add <Plus size={16} strokeWidth={3} />
    </button>
  )
}

/* ───────────────────────────── card ───────────────────────────── */

function Card({ p, i, active }: { p: FeaturedProduct; i: number; active: boolean }) {
  const pal = PALETTES[i % PALETTES.length]
  const meta = [p.packLabel || p.unit?.toUpperCase()].filter(Boolean).join('')

  return (
    <div className={`rounded-[26px] p-3.5 md:p-4 transition-shadow duration-500 ${active ? 'bg-[#FBF6EE] shadow-2xl shadow-black/10' : 'bg-[#F7F0E5]'}`}>
      <Link href={`/products/${p._id}`} tabIndex={active ? 0 : -1} className="block relative aspect-square rounded-[20px] overflow-hidden isolate" style={{ background: pal.bg }}>
        <span className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[78%] aspect-square rounded-full" style={{ background: pal.disc }} />
        <span className="absolute left-[14%] right-[14%] bottom-[9%] h-[16%] rounded-md bg-[#F3E9DA] shadow-[0_10px_20px_rgba(0,0,0,0.12)]" />
        <Image
          src={p.image || '/categories/masalas.webp'}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 70vw, 360px"
          className="object-contain p-[12%] pb-[16%] mix-blend-multiply"
        />
      </Link>

      <div className="px-1.5 pt-4 pb-1">
        <h3 className="font-semibold text-neutral-900 text-lg leading-tight line-clamp-1">{p.name}</h3>
        <p className="font-mono text-[11px] md:text-xs tracking-wide text-neutral-500 mt-1.5 flex items-center gap-1.5">
          {meta && <span>{meta}</span>}
          {meta && <span>·</span>}
          <Star size={12} className="fill-amber-500 text-amber-500" />
          {p.rating ? <span>{p.rating.toFixed(1)} ({p.reviewCount})</span> : <span>New</span>}
        </p>
        <p className="flex items-baseline gap-2 mt-3">
          <span className="text-2xl font-bold text-neutral-900">₹{p.price}</span>
          {p.originalPrice && p.originalPrice > p.price && <span className="text-sm text-neutral-400 line-through">₹{p.originalPrice}</span>}
        </p>
        <div className="mt-4">
          <AddButton p={p} big={active} />
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────── carousel ───────────────────────────── */

export default function FeaturedCarousel({ products }: { products: FeaturedProduct[] }) {
  const n = products.length
  const [active, setActive] = useState(Math.min(2, Math.max(0, n - 1)))
  const [w, setW] = useState(340)
  const stageRef = useRef<HTMLDivElement>(null)
  const [stageH, setStageH] = useState(0)
  const centreRef = useRef<HTMLDivElement>(null)

  // card width follows the viewport
  useEffect(() => {
    const size = () => setW(window.innerWidth < 640 ? Math.min(280, window.innerWidth * 0.72) : window.innerWidth < 1024 ? 300 : 360)
    size()
    window.addEventListener('resize', size)
    return () => window.removeEventListener('resize', size)
  }, [])

  // stage height = tallest (centre) card
  useLayoutEffect(() => {
    const el = centreRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setStageH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, n])

  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stageRef.current?.matches(':hover, :focus-within')) return
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go])

  if (n === 0) return null

  // signed distance from the active card, wrapping around so both sides stay filled
  const offsetOf = (i: number) => {
    let d = i - active
    if (n > 2) {
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
    }
    return d
  }
  // horizontal position of a card at a given offset
  const xFor = (d: number) => {
    const a = Math.abs(d)
    let x = 0
    for (let k = 1; k <= a; k++) x += (w * (SCALES[Math.min(k - 1, 2)] + SCALES[Math.min(k, 2)])) / 2 + GAP
    return Math.sign(d) * x
  }

  return (
    <section className="mt-14 md:mt-20 overflow-hidden" aria-roledescription="carousel" aria-label="Featured masala">
      <div className="w-[95%] max-w-[1600px] mx-auto px-2 text-center">
        <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-red-600">Handpicked for you</p>
        <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 mt-2">Featured <em className="text-red-600">Masala</em></h2>
      </div>

      <motion.div
        ref={stageRef}
        className="relative mx-auto mt-8 md:mt-10 touch-pan-y"
        style={{ height: stageH || w * 1.75 }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -50) go(1)
          else if (info.offset.x > 50) go(-1)
        }}
      >
        {products.map((p, i) => {
          const d = offsetOf(i)
          const a = Math.abs(d)
          const visible = a <= 2
          const isActive = d === 0
          return (
            <motion.div
              key={p._id}
              ref={isActive ? centreRef : undefined}
              className="absolute left-1/2 top-1/2"
              style={{ width: w, zIndex: 10 - a }}
              initial={false}
              animate={{
                x: xFor(d) - w / 2,
                y: '-50%',
                scale: SCALES[Math.min(a, 2)],
                opacity: visible ? (a === 2 ? 0.85 : 1) : 0,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              onClick={isActive ? undefined : () => setActive(i)}
              aria-hidden={!visible}
            >
              <div className={isActive ? '' : 'cursor-pointer [&_*]:pointer-events-none'}>
                <Card p={p} i={i} active={isActive} />
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* controls */}
      <div className="flex items-center justify-center gap-5 md:gap-7 mt-8 md:mt-10">
        <button onClick={() => go(-1)} aria-label="Previous product" className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FBF6EE] border border-neutral-900/10 shadow-sm flex items-center justify-center text-neutral-900 hover:bg-neutral-950 hover:text-white transition cursor-pointer">
          <ChevronLeft size={22} />
        </button>
        <p className="min-w-24 text-center" aria-live="polite">
          <span className="text-3xl font-semibold text-neutral-900 tabular-nums">{String(active + 1).padStart(2, '0')}</span>
          <span className="font-mono text-sm text-neutral-400 ml-2">/ {String(n).padStart(2, '0')}</span>
        </p>
        <button onClick={() => go(1)} aria-label="Next product" className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FBF6EE] border border-neutral-900/10 shadow-sm flex items-center justify-center text-neutral-900 hover:bg-neutral-950 hover:text-white transition cursor-pointer">
          <ChevronRight size={22} />
        </button>
      </div>
      <div className="relative w-[min(400px,70%)] h-[3px] mx-auto mt-5 rounded-full bg-neutral-900/10">
        <motion.span
          className="absolute top-0 h-full rounded-full bg-neutral-900"
          style={{ width: `${100 / n}%` }}
          animate={{ left: `${(active / n) * 100}%` }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        />
      </div>
    </section>
  )
}
