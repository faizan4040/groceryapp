'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  image: string
  images?: string[]
  name: string
}

export default function ProductImageGallery({ image, images, name }: Props) {
  const allImages = images?.length ? images : [image].filter(Boolean)
  const [active, setActive] = useState(allImages[0] || '/fallback.png')
  const [zoomed, setZoomed] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex flex-col gap-2 shrink-0">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(img)}
              className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                active === img
                  ? 'border-green-500 scale-105 shadow-md shadow-green-100'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                width={56}
                height={56}
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        ref={ref}
        className="relative flex-1 aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 cursor-crosshair"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={active}
          alt={name}
          fill
          className={`object-contain p-6 transition-transform duration-200 ${
            zoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            zoomed
              ? { transformOrigin: `${pos.x}% ${pos.y}%` }
              : {}
          }
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}