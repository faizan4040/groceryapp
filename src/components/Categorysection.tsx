'use client'

import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, ChevronLeft, LayoutGrid, Minus } from 'lucide-react'
import GroceryItemCard from '@/components/GroceryItemCard'
import { IGrocery } from '@/types/grocery'

interface CategorySectionProps {
  category: string
  items: IGrocery[]
}

const INITIAL_VISIBLE = 6

function CategorySection({ category, items }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: dir === 'right' ? 320 : -320,
      behavior: 'smooth',
    })
  }

  return (
    <section className="w-[94%] mx-auto mt-20">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-4 md:mb-5">

        {/* Left: label */}
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-5 md:h-6 rounded-full bg-linear-to-b from-green-400 to-green-600 shrink-0" />
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 capitalize tracking-tight">
            {category}
          </h2>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-semibold leading-tight">
            {items.length}
          </span>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">

          {/* Scroll arrows — visible only in slider mode on sm+ */}
          {!expanded && items.length > INITIAL_VISIBLE && (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50 transition-all duration-200"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50 transition-all duration-200"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Expand / Collapse */}
          {items.length > INITIAL_VISIBLE && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 active:scale-95 px-3 py-1.5 rounded-full transition-all duration-200"
            >
              {expanded ? (
                <>
                  <Minus size={11} strokeWidth={3} />
                  Less
                </>
              ) : (
                <>
                  <LayoutGrid size={11} />
                  See all
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── SLIDER MODE ── */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                  viewport={{ once: true }}
                  style={{ scrollSnapAlign: 'start' }}
                  /* 
                    MOBILE: 2 visible cards  →  calc(50% - 6px)
                    SM:     ~3 cards         →  160px
                    MD+:    fixed widths     →  180px–200px
                  */
                  className="shrink-0 w-[calc(50%-6px)] sm:w-40 md:w-45 lg:w-50"
                >
                  <GroceryItemCard item={item} />
                </motion.div>
              ))}

              {/* "View all" ghost card */}
              {items.length > INITIAL_VISIBLE && (
                <div
                  onClick={() => setExpanded(true)}
                  style={{ scrollSnapAlign: 'start' }}
                  className="shrink-0 w-[calc(50%-6px)] sm:w-40 md:w-45 lg:w-50 flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-green-200 cursor-pointer hover:border-green-400 hover:bg-green-50/40 active:scale-[0.97] transition-all duration-200 min-h-55"
                >
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                    <ChevronRight size={17} className="text-green-600" />
                  </div>
                  <span className="text-[11px] font-bold text-green-600 text-center px-3 leading-tight">
                    View All<br />
                    <span className="font-normal text-green-400">{items.length} items</span>
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GRID MODE ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            /*
              MOBILE:  2 columns  (the key request)
              SM:      3 columns
              LG:      4 columns
              XL:      5 columns
            */
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.025, 0.25) }}
              >
                <GroceryItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}

export default CategorySection