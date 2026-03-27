import React from 'react'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db'

import mongoose from 'mongoose'


import { IGrocery } from '@/types/grocery'
import Grocery from '@/models/grocery.models'
import ProductImageGallery from '@/components/ProductImageZoom'
import ProductDetailClient from '@/components/ProductDetails'

interface Props {
  params: Promise<{ id: string }>
}

async function getProduct(id: string): Promise<IGrocery | null> {
  try {
    await connectDB()

    if (!mongoose.Types.ObjectId.isValid(id)) return null

    const product = await Grocery.findById(id).lean()
    if (!product) return null

    return JSON.parse(JSON.stringify(product)) as IGrocery
  } catch {
    return null
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) return notFound()

  const allImages = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : []

  return (
    <main className="min-h-screen bg-white">
      <div className="w-[95%] lg:w-[85%] max-w-6xl mx-auto py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* LEFT — Image gallery */}
          <ProductImageGallery
            image={product.image}
            images={allImages}
            name={product.name}
          />

          {/* RIGHT — Details + cart (client) */}
          <ProductDetailClient product={product} />
        </div>
      </div>
    </main>
  )
}