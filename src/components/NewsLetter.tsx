"use client"

import React from "react"
import { Mail } from "lucide-react"

const NewsLetter = () => {
  return (
    <section className="w-[94%] mx-auto mt-24">

      {/* CONTAINER */}
      <div className="relative overflow-hidden bg-green-100 rounded-3xl py-16 px-6 md:px-16 text-center">

        {/* DECORATIVE HALF CIRCLES */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-200 rounded-full opacity-40"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-green-200 rounded-full opacity-40"></div>

        {/* ICON */}
        <div className="flex justify-center mb-6">

          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-md">
            <Mail size={28} className="text-green-600" />
          </div>

        </div>

        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Join our newsletter and get $20 off!
        </h2>

        {/* PARAGRAPH */}
        <p className="text-gray-600 mt-3 max-w-xl mx-auto">
          Subscribe to our newsletter and stay updated with the latest
          grocery deals, fresh products, and exclusive discounts.
        </p>

        {/* INPUT + BUTTON */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">

          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full sm:flex-1 px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium shadow-md transition">
            Subscribe
          </button>

        </div>

        {/* PRIVACY TEXT */}
        <p className="text-sm text-gray-500 mt-5">
          We care about your data in our privacy policy.
        </p>

      </div>

    </section>
  )
}

export default NewsLetter