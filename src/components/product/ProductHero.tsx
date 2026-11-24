'use client'

import React, { useState } from 'react'
import ProductGallery from '@/components/product/ProductGallery'
import ProductBuyBox, { Variant } from '@/components/product/ProductBuyBox'

interface Props {
  id: string
  name: string
  image: string
  unit: string
  images: string[]
  color: string
  variants: Variant[]
  hasVariants: boolean
  /** server-rendered details (badge, title, rating, description, chips) */
  info: React.ReactNode
}

/** Gallery + buy box sharing one selected pack size, so picking "500 g" shows its photo. */
export default function ProductHero({ id, name, image, unit, images, color, variants, hasVariants, info }: Props) {
  const [sel, setSel] = useState(0)

  return (
    <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-start">
      <ProductGallery images={images} name={name} color={color} focus={variants[sel]?.image || undefined} />
      <div className="px-1 sm:px-2 lg:px-0 lg:py-2">
        {info}
        <div className="mt-6">
          <ProductBuyBox
            id={id}
            name={name}
            image={image}
            unit={unit}
            variants={variants}
            hasVariants={hasVariants}
            selected={sel}
            onSelect={setSel}
          />
        </div>
      </div>
    </div>
  )
}
