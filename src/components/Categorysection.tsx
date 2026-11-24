'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import MasalaCard from '@/components/MasalaCard'
import { IGrocery } from '@/types/grocery'

interface CategorySectionProps {
  category: string
  items: IGrocery[]
  index?: number
}

const COLLAPSED = 8 // cards shown in the row before "View all"

const titleCase = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

function CategorySection({ category, items }: CategorySectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [edges, setEdges] = useState({ start: true, end: true })
  const scrollRef = useRef<HTMLDivElement>(null)

  const updateEdges = () => {
    const el = scrollRef.current
    if (!el) return
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [expanded, items.length])

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const title = titleCase(category)
  const scrollable = !edges.start || !edges.end
  const canExpand = items.length > 4
  const visible = expanded ? items : items.slice(0, COLLAPSED)

  return (
    <section className="w-[95%] max-w-[1600px] mx-auto px-2 mt-16 md:mt-24">
      {/* heading */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 mb-7 md:mb-9">
        <div>
          <p className="flex items-center gap-3 text-[11px] md:text-xs font-semibold uppercase tracking-[0.28em] text-red-600">
            <span className="w-8 h-px bg-red-600" />
            Our favourites
          </p>
          <h2 className="font-serif text-[34px] md:text-5xl leading-[1.05] text-neutral-950 mt-3">
            {title} <em className="text-red-600">collection</em>
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            {items.length} {items.length === 1 ? 'product' : 'products'} · freshly packed, ready to ship
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!expanded && scrollable && (
            <div className="hidden md:flex items-center gap-2">
              {([-1, 1] as const).map((d) => {
                const disabled = d < 0 ? edges.start : edges.end
                return (
                  <button
                    key={d}
                    onClick={() => scroll(d)}
                    disabled={disabled}
                    aria-label={d < 0 ? 'Scroll left' : 'Scroll right'}
                    className="w-11 h-11 rounded-full border border-neutral-900/15 bg-white text-neutral-900 flex items-center justify-center hover:bg-neutral-950 hover:text-white hover:border-neutral-950 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  >
                    {d < 0 ? <ChevronLeft size={19} /> : <ChevronRight size={19} />}
                  </button>
                )
              })}
            </div>
          )}
          {canExpand && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="group inline-flex items-center gap-2 h-11 pl-5 pr-4 rounded-full bg-neutral-950 hover:bg-red-600 text-white text-sm font-semibold transition cursor-pointer"
            >
              {expanded ? 'Show less' : `View all ${items.length}`}
              <ArrowRight size={16} className={`transition-transform ${expanded ? '-rotate-90' : 'group-hover:translate-x-0.5'}`} />
            </button>
          )}
        </div>
      </div>

      {/* products */}
      {expanded ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5"
        >
          {visible.map((item) => <MasalaCard key={item._id.toString()} item={item} />)}
        </motion.div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={updateEdges}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-2 px-2 pt-1 pb-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {visible.map((item, i) => (
            <motion.div
              key={item._id.toString()}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="snap-start shrink-0 w-[68%] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] xl:w-[calc(20%-16px)]"
            >
              <MasalaCard item={item} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CategorySection
