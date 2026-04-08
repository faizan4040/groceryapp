"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getSocket } from "@/lib/socket";


const Herosection = () => {
   const { userData } = useSelector((state: RootState) => state.user);   

  useEffect(() => {
    if (!userData?._id) return;   
    
    const socket = getSocket();  

    // send user identity to socket server
    socket.emit("identity", userData._id);

    console.log("Socket connected:", socket.id);

    // optional: listen example
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    // cleanup (IMPORTANT)
    return () => {
      socket.off("connect");
    };
  }, [userData]); // dependency added

  return (
    <section className="w-[95%] mx-auto mt-28 relative rounded-3xl overflow-hidden">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/grocery.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-12 py-24 max-w-2xl">   
        
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-full"
        >
          FRESH & ORGANIC
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold text-white mt-6 leading-tight"
        >
          Fresh Groceries <br />
          to your <span className="text-green-400">Doorstep</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-200 mt-6 text-lg max-w-lg"
        >
          Get up to <span className="font-semibold">30% OFF</span> on your first
          order. Sustainable farming, premium quality groceries delivered fast.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 mt-8"
        >
          <button className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition">
            Shop Now
          </button>

          <button className="bg-white/20 cursor-pointer backdrop-blur text-white px-7 py-3 rounded-full font-semibold hover:bg-white/30 transition">
            View Deals
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Herosection;







// "use client";

// import React, { useEffect } from "react";
// import { motion } from "motion/react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { getSocket } from "@/lib/socket";

// const Herosection = () => {

//   const {userData} = useSelector((state:RootState)=>state.user)
//   useEffect(()=>{
//     if(userData){
//       let socket=getSocket()
//       socket.emit("identiy",userData?._id)
//     }
//   },[])


//   return (
//     <section className="w-[95%] mx-auto mt-28 relative rounded-3xl overflow-hidden">

//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="absolute inset-0 w-full h-full object-cover"
//       >
//          <source src="/videos/grocery.mp4" type="video/mp4" />
//       </video>

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/50"></div>

      
//       <div className="relative z-10 px-12 py-24 max-w-2xl">

    
//         <motion.span
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-full"
//         >
//           FRESH & ORGANIC
//         </motion.span>


//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-5xl md:text-6xl font-bold text-white mt-6 leading-tight"
//         >
//           Fresh Groceries
//           <br />
//           to your{" "}
//           <span className="text-green-400">
//             Doorstep
//           </span>
//         </motion.h1>

       
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="text-gray-200 mt-6 text-lg max-w-lg"
//         >
//           Get up to <span className="font-semibold">30% OFF</span> on your first
//           order. Sustainable farming, premium quality groceries delivered fast.
//         </motion.p>

       
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="flex gap-4 mt-8"
//         >
//           <button className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition">
//             Shop Now
//           </button>

//           <button className="bg-white/20 cursor-pointer backdrop-blur text-white px-7 py-3 rounded-full font-semibold hover:bg-white/30 transition">
//             View Deals
//           </button>
//         </motion.div>
//       </div>

//     </section>
//   );
// };

// export default Herosection;

