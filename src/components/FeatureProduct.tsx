"use client";

import React, { useState, useCallback } from "react";
import { Heart, Star, Plus } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const products = [
  { name: "Organic Red Strawberries", category: "FRUITS",     price: 4.99, oldPrice: 6.25, image: "/categories/vegetables.jpg", rating: 4.5, tag: "-20%" },
  { name: "Fresh Garden Carrots",     category: "VEGETABLES", price: 2.49,                 image: "/categories/fruits.jpg",     rating: 4.6 },
  { name: "Artisan Whole Grain Bread",category: "BAKERY",     price: 3.95,                 image: "/categories/dairy.jpg",      rating: 4.4 },
  { name: "Pure Farm Whole Milk 1L",  category: "DAIRY",      price: 1.89,                 image: "/categories/fruits.jpg",     rating: 4.7, tag: "New" },
  { name: "Organic Apples",           category: "FRUITS",     price: 3.25,                 image: "/categories/dairy.jpg",      rating: 4.2 },
  { name: "Fresh Spinach",            category: "VEGETABLES", price: 2.10,                 image: "/categories/vegetables.jpg", rating: 4.3 },
  { name: "Greek Yogurt",             category: "DAIRY",      price: 2.99,                 image: "/categories/fruits.jpg",     rating: 4.5 },
  { name: "Orange Juice",             category: "BEVERAGES",  price: 3.50,                 image: "/categories/vegetables.jpg", rating: 4.4 },
  { name: "Chocolate Cookies",        category: "SNACKS",     price: 3.40,                 image: "/categories/organic.jpg",    rating: 4.6 },
  { name: "Cold Coffee",              category: "BEVERAGES",  price: 4.10,                 image: "/categories/dairy.jpg",      rating: 4.5 },
];

/* ── Render only filled stars based on rating ── */
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5 mt-1.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={11}
        className={
          s <= Math.round(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
    <span className="text-[10px] text-gray-400 ml-1">({rating})</span>
  </div>
);

/* ── Single card — memoised so the grid never re-renders all cards ── */
const ProductCard = React.memo(
  ({
    product,
    index,
    liked,
    onLike,
  }: {
    product: (typeof products)[0];
    index: number;
    liked: boolean;
    onLike: (i: number) => void;
  }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={180}
          /* FIX: eager + priority for above-the-fold cards; lazy for the rest */
          priority={index < 5}
          loading={index < 5 ? "eager" : "lazy"}
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
          className="w-full h-36 md:h-44 object-cover group-hover:scale-105 transition duration-300"
        />

        {product.tag && (
          <span
            className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.tag === "New" ? "bg-blue-500" : "bg-red-500"
            }`}
          >
            {product.tag}
          </span>
        )}

        <button
          onClick={() => onLike(index)}
          aria-label="Wishlist"
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow transition hover:scale-110"
        >
          <Heart
            size={14}
            className={liked ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-3 md:p-4">
        <p className="text-[9px] md:text-[10px] font-semibold tracking-widest text-green-500 uppercase">
          {product.category}
        </p>

        <h3 className="font-semibold text-xs md:text-sm text-gray-800 mt-0.5 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <StarRating rating={product.rating} />

        {/* PRICE + ADD */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex flex-col">
            <span className="text-green-600 font-bold text-sm md:text-base leading-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-[10px]">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            aria-label={`Add ${product.name} to cart`}
            className="bg-green-500 hover:bg-green-600 active:scale-90 text-white p-1.5 md:p-2 rounded-full shadow transition"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
);
ProductCard.displayName = "ProductCard";

/* ══════════════════════════════════════════════════════════════ */

const ITEMS_PER_PAGE = 10;

const FeatureProduct = () => {
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleLike = useCallback((i: number) => {
    setLiked((prev) => ({ ...prev, [i]: !prev[i] }));
  }, []);

  return (
    <section className="w-[94%] mx-auto mt-16">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Featured Products
        </h2>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:border-green-400 disabled:opacity-40 transition"
            >
              ‹
            </button>
            <span>{page} / {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:border-green-400 disabled:opacity-40 transition"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {currentProducts.map((product, i) => (
          <ProductCard
            key={`${product.name}-${i}`}
            product={product}
            index={i}
            liked={!!liked[i]}
            onLike={toggleLike}
          />
        ))}
      </div>

    </section>
  );
};

export default FeatureProduct;