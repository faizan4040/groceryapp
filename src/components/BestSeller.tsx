"use client"

import Image from "next/image"
import React from "react"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"

const products = [
  {
    name: "Fresh Organic Apple",
    price: 2.99,
    image: "/categories/vegetables.jpg",
  },
  {
    name: "Natural Avocado",
    price: 3.49,
    image: "/categories/dairy.jpg",
  },
  {
    name: "Green Broccoli",
    price: 1.99,
    image: "/categories/dairy.jpg",
  },
  {
    name: "Fresh Banana",
    price: 2.25,
    image: "/categories/fruits.jpg",
  },
  {
    name: "Fresh Banana",
    price: 2.25,
    image: "/categories/vegetables.jpg",
  },
]

const BestSeller = () => {
  return (
    <section className="w-[94%] mx-auto mt-20">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Best Seller
        </h2>

        <button className="text-green-600 font-medium hover:underline cursor-pointer">
          See More
        </button>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {products.map((product, i) => (

          <motion.div
            key={i}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition border border-gray-100 overflow-hidden"
          >

            {/* IMAGE CONTAINER */}
            <div className="relative w-full h-44 bg-gray-50 flex items-center justify-center">

              <div className="relative w-56 h-32 rounded-xl overflow-hidden">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-xl"
                />

              </div>

            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                {product.name}
              </h3>

              <div className="flex items-center justify-between mt-3">

                <p className="text-green-600 font-bold text-lg">
                  ${product.price}
                </p>

                <button className="bg-green-500 cursor-pointer hover:bg-green-600 text-white w-9 h-9 flex items-center justify-center rounded-full shadow-md transition">

                  <Plus size={16} />

                </button>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </section>
  )
}

export default BestSeller