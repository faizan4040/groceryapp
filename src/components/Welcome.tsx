"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import Image from "next/image";
import { IMAGES } from "../../routes/AllImages";
import deliveryBoy from "@/constants/animations/delivery-boy.json";
import Link from "next/link";

type propType={
nextStep:(s:number)=>void  
}

const Welcome = ({nextStep}:propType) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-green-100 px-4 sm:px-6 lg:px-8 py-10">

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-lg bg-white/70 shadow-xl rounded-3xl 
        p-6 sm:p-8 md:p-10 
        w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl 
        text-center border border-gray-200"
      >

        {/* Logo + Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 sm:gap-3"
        >
          <Image
            src={IMAGES.cart}
            alt="cart"
            width={48}
            height={48}
            className="h-10 w-10 sm:h-12 sm:w-12"
          />

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-700 tracking-tight">
            Fresh<span className="text-yellow-400">Cart</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 sm:mt-5 text-gray-600 
          text-sm sm:text-base md:text-lg 
          leading-relaxed max-w-xl mx-auto"
        >
          Your one-stop destination for fresh groceries, organic products,
          and daily essentials delivered straight to your doorstep.
        </motion.p>

        {/* Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center mt-6 sm:mt-8"
        >
          <div
            className="
            w-40 h-40
            sm:w-48 sm:h-48
            md:w-56 md:h-56
            lg:w-64 lg:h-64
            rounded-full overflow-hidden
            border-4 border-green-500
            flex items-center justify-center
            bg-white shadow-lg"
          >
            <Lottie
              animationData={deliveryBoy}
              loop
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8"
        >

        <Link href="/">
          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-green-600 text-white 
          px-5 sm:px-6 py-3 
          rounded-xl font-semibold shadow-md 
          hover:bg-green-700 flex items-center justify-center gap-2 cursor-pointer"
        >
          Start Shopping
          <ArrowRight size={18} />
        </motion.button>
        </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto border border-green-600 text-green-700 
            px-5 sm:px-6 py-3 
            rounded-xl font-semibold hover:bg-green-50 cursor-pointer"
            onClick={()=>nextStep(2)}
          >
            Create Account
          </motion.button>

        </motion.div>

      </motion.div>
    </div>
  );
};

export default Welcome;