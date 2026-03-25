'use client'

import Image from 'next/image'
import grocery from "../constants/images/grocery.gif"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-9999">
      
      <div className="relative w-86 h-86 rounded-full">
        <Image
          src={grocery}
          alt="Loading"
          fill
          className="object-contain"
          priority
        />
      </div>

    </div>
  )
}


// 'use client'

// import { motion } from 'motion/react'

// export default function Loading() {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-white z-9999">
      
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//         className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
//       />

//     </div>
//   )
// }