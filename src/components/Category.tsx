"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const categories = [
  { name: "Vegetables", image: "/categories/vegetables.jpg", emoji: "🥦" },
  { name: "Fruits",     image: "/categories/fruits.jpg",     emoji: "🍎" },
  { name: "Dairy",      image: "/categories/dairy.jpg",      emoji: "🥛" },
  { name: "Bakery",     image: "/categories/bakery.jpg",     emoji: "🍞" },
  { name: "Meat & Fish",image: "/categories/fruits.jpg",       emoji: "🥩" },
  { name: "Beverages",  image: "/categories/vegetables.jpg",  emoji: "🧃" },
  { name: "Snacks",     image: "/categories/vegetables.jpg",     emoji: "🍿" },
  { name: "Organic",    image: "/categories/organic.jpg",    emoji: "🌿" },
];

const Category = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  /* ── Auto-scroll ── */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      const atEnd =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;

      slider.scrollBy({ left: atEnd ? -slider.scrollWidth : 220, behavior: "smooth" });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scroll = (dir: "left" | "right") =>
    sliderRef.current?.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });

  return (
    <section className="w-[90%] mx-auto mt-16">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
        <button className="text-green-600 font-semibold hover:underline text-sm">
          View All
        </button>
      </div>

      <div className="relative">

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 transition"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth px-2 py-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              /* FIX 1 – perspective needed for rotateX/Y to look correct */
              style={{ perspective: 600 }}
              whileHover={{ rotateX: 6, rotateY: -6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="min-w-40 bg-white rounded-2xl shadow-md p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:shadow-green-100 transition-shadow"
            >
              {/* FIX 2 – next/image with priority on first 4 + fallback emoji */}
              <div className="w-24 h-24 flex items-center justify-center bg-green-50 rounded-full mb-3 overflow-hidden relative">
                {imgErrors[i] ? (
                  /* Fallback when image is missing / broken */
                  <span className="text-4xl select-none">{cat.emoji}</span>
                ) : (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="96px"
                    /* FIX 3 – eager-load first 4 cards, lazy the rest */
                    loading={i < 4 ? "eager" : "lazy"}
                    priority={i < 4}
                    className="object-cover rounded-full"
                    onError={() =>
                      setImgErrors((prev) => ({ ...prev, [i]: true }))
                    }
                  />
                )}
              </div>

              <h3 className="font-semibold text-gray-800 text-center text-sm leading-tight">
                {cat.name}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100 transition"
        >
          <ChevronRight size={20} />
        </button>

      </div>
    </section>
  );
};

export default Category;