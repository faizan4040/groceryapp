'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Plus, Check, Zap } from 'lucide-react'
import { IGrocery } from '@/types/grocery'

function GroceryItemCard({ item }: { item: IGrocery }) {
  const [added, setAdded] = useState(false)
  if (!item) return null

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const hasDiscount = item.discount && Number(item.discount) > 0

  const calculatedOriginalPrice = hasDiscount
    ? Math.round(Number(item.price) / (1 - Number(item.discount) / 100))
    : null

  const originalPrice =
    item.originalPrice && Number(item.originalPrice) > Number(item.price)
      ? Number(item.originalPrice)
      : calculatedOriginalPrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, amount: 0.2 }}
      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-50 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-lg tracking-wide shadow-sm shadow-red-200">
            {item.discount}% OFF
          </span>
        </div>
      )}

      {/* IMAGE AREA */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden shrink-0">
        <Image
          src={item.image || '/fallback.png'}
          alt={item.name || 'product'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-3 sm:p-4 group-hover:scale-[1.06] transition-transform duration-500 ease-out"
        />

        {/* Delivery pill — bottom right of image */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-lg">
            <Zap size={8} className="fill-green-500 text-green-500" />
            30 min
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1">

        {/* Name */}
        <h3 className="font-semibold text-[13px] sm:text-sm text-gray-800 leading-snug line-clamp-2 min-h-10">
          {item.name}
        </h3>

        {/* Unit */}
        {item.unit && (
          <span className="text-[13px] text-gray-400 font-medium">
            {item.unit}
          </span>
        )}

        {/* PRICE + BUTTON */}
        <div className="flex items-end justify-between mt-auto pt-2">

          {/* Prices */}
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] sm:text-base font-black text-gray-900">
              ₹{item.price}
            </span>
            {hasDiscount && originalPrice && (
              <span className="text-[11px] text-gray-400 line-through font-medium">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* ADD BUTTON */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleAdd}
            className={`relative flex items-center justify-center gap-1 min-w-15 h-8 px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 border ${
              added
                ? 'bg-green-500 text-white border-green-500 shadow-md shadow-green-200'
                : 'bg-white text-green-600 border-green-200 hover:bg-green-500 hover:text-white hover:border-green-500 hover:shadow-md hover:shadow-green-200'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1"
                >
                  <Check size={12} strokeWidth={3} />
                  Done
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1"
                >
                  <Plus size={12} strokeWidth={3} />
                  Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

        </div>
      </div>
    </motion.div>
  )
}

export default GroceryItemCard