'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaStar, FaTag } from 'react-icons/fa'

interface Product {
  _id: string           // ← KEY FIX
  name: string
  category: string
  price: number
  originalPrice?: number
  discount?: number
  unit?: string
  images: string[]
  rating?: number
  reviewCount?: number
  tags?: string[]
}

const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
  >
    <div className="relative h-48 bg-gray-50 overflow-hidden">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
      />
      {product.discount && (
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
          {product.discount}% OFF
        </span>
      )}
    </div>
    <div className="p-4 space-y-2">
      {product.category && (
        <p className="text-xs text-gray-400 uppercase tracking-wide">{product.category}</p>
      )}
      <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-green-700 transition">
        {product.name}
      </h3>
      {product.rating && (
        <div className="flex items-center gap-1 text-xs text-yellow-500">
          <FaStar />
          <span className="text-gray-700 font-medium">{product.rating}</span>
          <span className="text-gray-400">({product.reviewCount})</span>
        </div>
      )}
      {product.tags?.length && (
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              <FaTag size={8} />{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-lg font-bold text-green-700">₹{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm line-through text-gray-400">₹{product.originalPrice}</span>
        )}
        {product.unit && (
          <span className="text-xs text-gray-400 ml-auto">{product.unit}</span>
        )}
      </div>
    </div>
  </div>
)

const ProductsPage = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        setProducts(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="w-[90%] mx-auto py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 h-72 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">{error}</div>
    )
  }

  return (
    <div className="w-[90%] lg:w-[85%] mx-auto py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product._id}                                      // ← FIX
            product={product}
            onClick={() => router.push(`/products/${product._id}`)} // ← FIX
          />
        ))}
      </div>
    </div>
  )
}

export default ProductsPage