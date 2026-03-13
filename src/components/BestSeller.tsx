"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { Plus, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const products = [
  { name: "Fresh Organic Apple",  price: 2.99, image: "/categories/vegetables.jpg" },
  { name: "Natural Avocado",      price: 3.49, image: "/categories/dairy.jpg" },
  { name: "Green Broccoli",       price: 1.99, image: "/categories/dairy.jpg" },
  { name: "Fresh Banana",         price: 2.25, image: "/categories/fruits.jpg" },
  { name: "Ripe Mango",           price: 2.75, image: "/categories/vegetables.jpg" },
];

const BestSeller = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const scroll = (dir: "left" | "right") =>
    sliderRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });

  return (
    <section className="w-[94%] mx-auto mt-20">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Best Seller
        </h2>

        {/* Arrow buttons — visible only on mobile */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full border border-gray-200 hover:border-green-400 transition"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full border border-gray-200 hover:border-green-400 transition"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>

        {/* See More — hidden on mobile, shown on sm+ */}
        <button className="hidden sm:block text-green-600 font-medium hover:underline cursor-pointer text-sm">
          See More
        </button>
      </div>

      {/* ── MOBILE: horizontal scroll slider ── */}
      {/* ── SM+: grid ── */}

      {/* Mobile slider wrapper */}
      <div
        ref={sliderRef}
        className="
          flex gap-4 overflow-x-auto scroll-smooth
          pb-3 px-0.5
          scrollbar-hide
          sm:grid sm:grid-cols-3 sm:overflow-visible
          md:grid-cols-4
          lg:grid-cols-5
          sm:gap-6 sm:pb-0
        "
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            /* min-w fixes card width inside the flex slider on mobile */
            className="min-w-38.75 sm:min-w-0 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden shrink-0 sm:shrink"
          >
            {/* IMAGE */}
            <div className="relative w-full h-36 sm:h-44 bg-gray-50 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority={i < 4}
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(max-width:640px) 155px, (max-width:768px) 33vw, (max-width:1024px) 25vw, 20vw"
                className="object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Wishlist */}
              <button
                onClick={() => setLiked((p) => ({ ...p, [i]: !p[i] }))}
                aria-label="Wishlist"
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow transition hover:scale-110"
              >
                <Heart
                  size={13}
                  className={liked[i] ? "fill-red-500 text-red-500" : "text-gray-400"}
                />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 leading-snug">
                {product.name}
              </h3>

              <div className="flex items-center justify-between mt-2.5">
                <p className="text-green-600 font-bold text-sm sm:text-base">
                  ${product.price.toFixed(2)}
                </p>

                <button
                  aria-label={`Add ${product.name} to cart`}
                  className="bg-green-500 hover:bg-green-600 active:scale-90 text-white w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full shadow transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* See More — mobile only, below the slider */}
      <div className="mt-5 flex justify-center sm:hidden">
        <button className="text-green-600 font-medium text-sm hover:underline">
          See More
        </button>
      </div>

    </section>
  );
};

export default BestSeller;