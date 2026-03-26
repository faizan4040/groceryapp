'use client'

import { motion } from 'motion/react'
import React from 'react'
import { useRouter } from 'next/navigation'

const Checkout = () => {
  const router = useRouter()

  return (
    <div className='w-[92%] md:w-[80%] mx-auto py-10 relative'>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/user/cart')}
        className='absolute left-2 cursor-pointer top-2 flex items-center gap-2 text-green-700 hover:text-green-500 font-semibold'
      >
        ← Back to cart
      </motion.button>

      <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className='text-3xl md:text-4xl font-bold text-green-700 text-center mb-10'>
      Checkout
      </motion.h1>

      <div className='grid md:grid-cols-2 gap-8'>
        <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}   
         className='lg:white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-100 p-6 border border-gray-100'>
             
             <h2> </h2>

            
        </motion.div>

      </div>

    </div>
  )
}

export default Checkout