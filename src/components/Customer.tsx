"use client"

import React from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    name: "Sarah Johnson",
    image: "/categories/vegetables.jpg",
    text: "Amazing quality products and super fast delivery. The fruits and vegetables are always fresh. Highly recommended grocery store!",
  },
  {
    name: "Michael Lee",
    image: "/categories/vegetables.jpg",
    text: "I love shopping here. Everything is organic and the service is excellent. The website is also very easy to use.",
  },
  {
    name: "Emily Davis",
    image: "/categories/vegetables.jpg",
    text: "Best grocery experience online. The delivery was quick and the packaging was perfect. Definitely ordering again!",
  },
]

const Customer = () => {
  return (
    <section className="w-[94%] mx-auto mt-24">

      {/* MAIN CONTAINER */}
      <div className="bg-gray-50 rounded-3xl py-16 px-6 md:px-12">

        {/* HEADING */}
        <div className="text-center mb-14">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            What Our Customers Say
          </h2>

          <p className="text-gray-500 mt-3">
            Real experiences from our happy customers
          </p>

        </div>

        {/* TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {testimonials.map((item, i) => (

            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
            >

              {/* STARS */}
              <div className="flex justify-center gap-1 mb-4">

                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}

              </div>

              {/* TEXT */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{item.text}"
              </p>

              {/* USER */}
              <div className="flex flex-col items-center gap-2">

                <div className="w-14 h-14 relative rounded-full overflow-hidden">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />

                </div>

                <h4 className="font-semibold text-gray-800">
                  {item.name}
                </h4>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  )
}

export default Customer