"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

const PromoSection = () => {
  return (
    <section className="w-[94%] mx-auto py-12 md:py-16">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        {/* FLASH SALE */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col md:flex-row items-center justify-between bg-green-100 rounded-3xl p-6 md:p-10 gap-6"
        >

          {/* TEXT */}
          <div className="max-w-md text-center md:text-left">

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Flash Sale!
            </h2>

            <p className="text-gray-600 mb-5 text-sm md:text-base">
              Up to 50% off on all organic dairy products
              for a limited time.
            </p>

            <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition w-full md:w-auto">
              Claim Offer
            </button>

          </div>

          {/* IMAGE */}
          <div className="w-32 h-32 md:w-44 md:h-44 bg-green-900 rounded-2xl flex items-center justify-center">

            <img
              src="/promo/dairy.png"
              alt="Dairy"
              className="w-20 md:w-32 object-contain"
            />

          </div>

        </motion.div>

        {/* FREE DELIVERY */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex flex-col md:flex-row items-center justify-between bg-orange-100 rounded-3xl p-6 md:p-10 gap-6"
        >

          {/* TEXT */}
          <div className="max-w-md text-center md:text-left">

            <h2 className="text-xl md:text-2xl font-bold text-orange-600 mb-2">
              Free Delivery
            </h2>

            <p className="text-gray-600 mb-5 text-sm md:text-base">
              On your first 3 orders above $50.
              Freshness guaranteed at your door.
            </p>

            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition w-full md:w-auto">
              Order Now
            </button>

          </div>

          {/* ICON */}
          <div className="w-32 h-32 md:w-44 md:h-44 bg-orange-300 rounded-2xl flex items-center justify-center">

            <Truck size={40} className="text-white md:size-14" />

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default PromoSection;