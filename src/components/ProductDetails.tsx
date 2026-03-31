'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQty } from '@/redux/cartSlice'
import { IGrocery } from '@/types/grocery'
import {
  ShoppingCart, Zap, Plus, Minus, Star,
  CheckCircle, Tag, Package, Truck, ChevronLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProductDetailClient({ product }: { product: IGrocery }) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [pincode, setPincode] = useState('')
  const [pincodeMsg, setPincodeMsg] = useState<string | null>(null)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

  const id = product._id.toString()

  const cartItem = useSelector((state: RootState) =>
    state.cart.cartData?.find((i) => i._id === id)
  )
  const quantity = cartItem?.quantity || 0

  const price = Number(product.price)
  const originalPrice = product.originalPrice
    ? Number(product.originalPrice)
    : product.discount && Number(product.discount) > 0
    ? Math.round(price / (1 - Number(product.discount) / 100))
    : null

  const savings = originalPrice ? originalPrice - price : 0
  const stock = product.stock ?? 99
  const rating = product.rating ?? 4.2
  const reviewCount = product.reviewCount ?? 128

  const checkPincode = () => {
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeMsg('Enter a valid 6-digit pincode')
      return
    }
    setPincodeMsg('✅ Delivery available in 30 minutes!')
  }

  const handleAdd = () => {
    dispatch(addToCart({
      _id: id,
      name: product.name,
      price,
      image: product.image,
      unit: product.unit || '',
      quantity: 1,
    }))
  }

  const handleDecrease = () => {
    dispatch(decreaseQty(id))
  }

  const handleBuyNow = () => {
    setBuyNowLoading(true)
    if (quantity === 0) handleAdd()
    setTimeout(() => router.push('/user/cart'), 300)
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Category */}
      {product.category && (
        <p className="text-xs text-green-600 uppercase tracking-widest font-semibold">
          {product.category}
        </p>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Unit */}
      {product.unit && (
        <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
          {product.unit}
        </span>
      )}

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-0.5 text-yellow-400">
          {Array(5).fill(0).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.round(rating) ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <span className="font-semibold text-gray-700">{rating}</span>
        <span className="text-gray-400">({reviewCount.toLocaleString()} reviews)</span>
      </div>

      <hr className="border-gray-100" />

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-end gap-3 flex-wrap">
          <span className="text-4xl font-black text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-lg line-through text-gray-400 mb-1">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
          {product.discount && Number(product.discount) > 0 && (
            <span className="mb-1 bg-green-100 text-green-700 text-sm px-2.5 py-0.5 rounded-full font-bold">
              {product.discount}% OFF
            </span>
          )}
        </div>
        {savings > 0 && (
          <p className="text-sm text-green-600 font-medium">
            💰 You save ₹{savings.toLocaleString()} on this order
          </p>
        )}
        <p className="text-xs text-gray-400">Inclusive of all taxes</p>
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2 text-sm">
        <Package size={15} className="text-orange-500" />
        {stock > 10 ? (
          <span className="text-gray-600">In Stock ({stock} available)</span>
        ) : stock > 0 ? (
          <span className="text-orange-600 font-semibold">
            Only {stock} left — order soon!
          </span>
        ) : (
          <span className="text-red-600 font-semibold">Out of Stock</span>
        )}
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full"
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Delivery */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-2">
        <p className="font-semibold text-green-700 flex items-center gap-2 text-sm">
          <Truck size={15} />
          ⚡ Delivery in 30 minutes
        </p>
        <p className="text-xs text-gray-500">Free delivery on orders above ₹499</p>
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={checkPincode}
            className="text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
          >
            Check
          </button>
        </div>
        {pincodeMsg && (
          <p className="text-xs text-green-700 font-medium">{pincodeMsg}</p>
        )}
      </div>

      {/* Qty + Add to Cart */}
      <div className="flex items-center gap-4">
        {quantity === 0 ? (
          <button
            disabled={stock === 0}
            onClick={handleAdd}
            className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-between bg-green-600 text-white rounded-xl px-4 py-3">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <Minus size={14} />
            </button>
            <div className="text-center">
              <span className="text-xl font-black">{quantity}</span>
              <p className="text-xs text-green-100">
                ₹{(price * quantity).toLocaleString()} total
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

        <button
          disabled={stock === 0}
          onClick={handleBuyNow}
          className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={18} />
          {buyNowLoading ? 'Going...' : 'Buy Now'}
        </button>
      </div>

      {/* Description */}
      {product.description && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">About this product</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Highlights */}
      {product.highlights && product.highlights.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Highlights</h3>
          <ul className="space-y-2">
            {product.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trust signals */}
      <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <CheckCircle size={14} className="text-green-500" /> 100% Fresh Products
        </p>
        <p className="flex items-center gap-2">
          <CheckCircle size={14} className="text-green-500" /> Easy 24-hour Returns
        </p>
        <p className="flex items-center gap-2">
          <CheckCircle size={14} className="text-green-500" /> Cash on Delivery Available
        </p>
      </div>
    </div>
  )
}