'use client'

import { motion } from 'motion/react'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full"
        />

        {/* Text */}
        <p className="text-sm font-semibold text-gray-600">
          Loading FreshCart...
        </p>
      </motion.div>

    </div>
  )
}