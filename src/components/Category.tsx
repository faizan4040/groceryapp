"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const categories = [
  { name: "Masala", image: "/categories/masalas.webp",},
  { name: "Cold Drinks & Juices",   image: "/categories/coldrings.webp",},
  { name: "Cleaning & Essentials",     image: "/categories/cleaning.jpg", },
  { name: "Rice, Atta & Dall",      image: "/categories/rice_atta_dall.webp", },
  { name: "souces & spreads ",     image: "/categories/souces.jpg", },
  { name: "Stationary",image: "/categories/stationary.png",},
  { name: "Personal_Care",  image: "/categories/personal_care.jpg",},
  { name: "Snacks & Munchies",     image: "/categories/snacks_munchies.webp",},
  { name: "Food Oil",    image: "/categories/food_oil.webp",},
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
              style={{ perspective: 600 }}
              whileHover={{ rotateX: 6, rotateY: -6, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="min-w-40 bg-white rounded-2xl shadow-md p-5 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:shadow-green-100 transition-shadow"
            >
              <div className="w-24 h-24 flex items-center justify-center bg-green-50 rounded-full mb-3 overflow-hidden relative">
                {imgErrors[i] ? (

                  <span className="text-4xl select-none"></span>
                ) : (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="96px"
                   
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