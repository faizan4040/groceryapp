"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Vegetables",
    image: "/categories/vegetables.jpg",
  },
  {
    name: "Fruits",
    image: "/categories/fruits.jpg",
  },
  {
    name: "Dairy",
    image: "/categories/dairy.jpg",
  },
  {
    name: "Bakery",
    image: "/categories/bakery.jpg",
  },
  {
    name: "Meat & Fish",
    image: "/categories/fruits.jpg",
  },
  {
    name: "Beverages",
    image: "/categories/fruits.jpg",
  },
  {
    name: "Snacks",
    image: "/categories/fruits.jpg",
  },
  {
    name: "Organic",
    image: "/categories/organic.jpg",
  },
];

const Category = () => {

  const sliderRef = useRef<HTMLDivElement>(null);

  /* AUTO SLIDER */
  useEffect(() => {
    const slider = sliderRef.current;

    const interval = setInterval(() => {
      if (!slider) return;

      slider.scrollBy({
        left: 220,
        behavior: "smooth",
      });

      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 10
      ) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-[90%] mx-auto mt-16">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h2 className="text-2xl font-bold text-gray-800">
          Shop by Category
        </h2>

        <button className="text-green-600 font-semibold hover:underline">
          View All
        </button>

      </div>

      <div className="relative">

        {/* LEFT ARROW */}
        <button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        {/* SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-2 py-4 scrollbar-hide"
        >

          {categories.map((cat, i) => (

            <motion.div
  key={i}
  whileHover={{
    rotateX: 8,
    rotateY: -8,
    scale: 1.05,
  }}
  transition={{ type: "spring", stiffness: 200 }}
  className="min-w-42.5 bg-white rounded-2xl shadow-md p-5 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-2xl hover:shadow-green-200"
>

  {/* IMAGE WRAPPER */}
  <div className="w-24 h-24 flex items-center justify-center bg-green-50 rounded-full p-4 mb-3">

    <img
      src={cat.image}
      alt={cat.name}
      className="w-full h-full object-contain rounded-full"
    />

  </div>

  {/* NAME */}
  <h3 className="font-semibold text-gray-800 text-center text-sm">
    {cat.name}
  </h3>

</motion.div>

          ))}

        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight />
        </button>

      </div>

    </section>
  );
};

export default Category;