'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Product photos usually have a white background. `mix-blend-multiply` lets that
 * white take the panel colour, so the pack sits on the panel instead of in a white box.
 */
export default function ProductGallery({ images, name, color, focus }: { images: string[]; name: string; color: string; focus?: string }) {
  const list = images.length ? images : ['/categories/masalas.webp']
  const [[i, dir], set] = useState<[number, number]>([0, 0])
  const go = (d: number) => set(([cur]) => [(cur + d + list.length) % list.length, d])
  const multi = list.length > 1

  // show the chosen variant's photo
  useEffect(() => {
    if (!focus) return
    const idx = list.indexOf(focus)
    if (idx >= 0) set(([cur]) => (cur === idx ? [cur, 0] : [idx, idx > cur ? 1 : -1]))
  }, [focus]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] rounded-[20px] md:rounded-[24px] overflow-hidden isolate" style={{ background: color }}>
        {/* soft light behind the pack */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.75),transparent_60%)]" />

        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: dir >= 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir >= 0 ? -50 : 50 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            drag={multi ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1)
              else if (info.offset.x > 60) go(-1)
            }}
            className="absolute inset-0"
          >
            <Image
              src={list[i]}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 95vw, 45vw"
              className="object-contain p-6 md:p-10 mix-blend-multiply"
            />
          </motion.div>
        </AnimatePresence>

        {multi && [-1, 1].map((d) => (
          <button
            key={d}
            onClick={() => go(d)}
            aria-label={d < 0 ? 'Previous image' : 'Next image'}
            className={`absolute z-10 top-1/2 -translate-y-1/2 ${d < 0 ? 'left-3 md:left-4' : 'right-3 md:right-4'} w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-brown-900 shadow-md flex items-center justify-center hover:scale-105 transition cursor-pointer`}
          >
            {d < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        ))}
      </div>

      {multi && (
        <div className="grid grid-cols-4 gap-2.5 md:gap-3">
          {list.slice(0, 4).map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => set(([cur]) => [idx, idx > cur ? 1 : -1])}
              aria-label={`Show image ${idx + 1}`}
              className={`relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden isolate transition cursor-pointer ${
                idx === i ? 'ring-2 ring-brown-900' : 'opacity-75 hover:opacity-100'
              }`}
              style={{ background: color }}
            >
              <Image src={src} alt="" fill sizes="140px" className="object-contain p-2 mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
