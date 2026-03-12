"use client";

import React, { useState } from "react";
import { Heart, Star, Plus } from "lucide-react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";


const products = [
  {
    name: "Organic Red Strawberries",
    category: "FRUITS",
    price: 4.99,
    oldPrice: 6.25,
    image: "/categories/vegetables.jpg",
    rating: 4.5,
    tag: "-20%",
  },
  {
    name: "Fresh Garden Carrots",
    category: "VEGETABLES",
    price: 2.49,
    image: "/categories/fruits.jpg",
    rating: 4.6,
  },
  {
    name: "Artisan Whole Grain Bread",
    category: "BAKERY",
    price: 3.95,
    image: "/categories/dairy.jpg",
    rating: 4.4,
  },
  {
    name: "Pure Farm Whole Milk 1L",
    category: "DAIRY",
    price: 1.89,
    image: "/categories/fruits.jpg",
    rating: 4.7,
    tag: "New",
  },
  {
    name: "Organic Apples",
    category: "FRUITS",
    price: 3.25,
    image: "/categories/dairy.jpg",
    rating: 4.2,
  },
  {
    name: "Fresh Spinach",
    category: "VEGETABLES",
    price: 2.1,
    image: "/categories/vegetables.jpg",
    rating: 4.3,
  },
  {
    name: "Greek Yogurt",
    category: "DAIRY",
    price: 2.99,
    image: "/categories/fruits.jpg",
    rating: 4.5,
  },
  {
    name: "Orange Juice",
    category: "BEVERAGES",
    price: 3.5,
    image: "/categories/vegetables.jpg",
    rating: 4.4,
  },
  {
    name: "Chocolate Cookies",
    category: "SNACKS",
    price: 3.4,
    image: "/categories/organic.jpg",
    rating: 4.6,
  },
  {
    name: "Cold Coffee",
    category: "BEVERAGES",
    price: 4.1,
    image: "/categories/dairy.jpg",
    rating: 4.5,
  },
];

const FeatureProduct = () => {

  const productsPerPage = 15;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const start = (page - 1) * productsPerPage;
  const currentProducts = products.slice(start, start + productsPerPage);

  return (

    <section className="w-[94%] mx-auto mt-16">

{/* HEADER */}
<div className="flex justify-between items-center mb-8">
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
    Featured Products
  </h2>
</div>

{/* GRID */}
        <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        gap-4 md:gap-6
        ">

        {currentProducts.map((product, i) => (

        <motion.div
        key={i}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="group bg-white rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition"
        >

        {/* IMAGE */}
        <div className="relative overflow-hidden">

        <img
        src={product.image}
        alt={product.name}
        className="w-full h-36 md:h-44 object-cover group-hover:scale-110 transition duration-300"
        />

        {product.tag && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        {product.tag}
        </span>
        )}

        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:text-red-500">
        <Heart size={14}/>
        </button>

        </div>

        {/* CONTENT */}
        <div className="p-3 md:p-4">

        <p className="text-[10px] md:text-xs text-gray-400 uppercase">
        {product.category}
        </p>

        <h3 className="font-semibold text-sm md:text-base text-gray-800 mt-1 line-clamp-1">
        {product.name}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-1 md:mt-2">

        {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} className="text-yellow-400 fill-yellow-400"/>
        ))}

        <span className="text-[10px] md:text-xs text-gray-500 ml-1">
        ({product.rating})
        </span>

        </div>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-2 md:mt-4">

        <div>
        <p className="text-green-600 font-bold text-sm md:text-lg">
        ${product.price}
        </p>

        {product.oldPrice && (
        <p className="text-gray-400 line-through text-[10px] md:text-xs">
        ${product.oldPrice}
        </p>
        )}

        </div>

        <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow">
        <Plus size={14}/>
        </button>

        </div>

        </div>

        </motion.div>

        ))}

        </div>

</section>
  );
};

export default FeatureProduct;