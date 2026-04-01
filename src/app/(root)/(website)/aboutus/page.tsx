'use client'

import Image from "next/image";
import { motion } from "motion/react";
import { Users, Target, Leaf, Truck } from "lucide-react";
import blogBanner from "@/constants/images/blog_banner.jpg";
import grocery from "@/constants/images/grocery.jpg";


export default function Aboutus() {
  return (
    <div className="bg-white text-gray-900">

      {/* HERO SECTION */}
      <div className="relative h-[60vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        
        {/* Background */}
        <Image
          src={blogBanner}
          alt="About Banner"
          fill
          className="object-cover"
        />


        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold text-white"
          >
            About FreshCart
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 mt-4 max-w-xl mx-auto"
          >
            Delivering farm-fresh groceries with speed, quality, and care.
          </motion.p>
        </div>
      </div>

      {/* ABOUT CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* Text */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            Who We Are
          </h2>

          <p className="text-gray-600 leading-7 mb-4">
            FreshCart is a modern grocery delivery platform focused on bringing
            farm-fresh products directly to your doorstep in record time.
          </p>

          <p className="text-gray-600 leading-7">
            We work closely with local farmers and suppliers to ensure that every
            product you receive is fresh, organic, and of the highest quality.
            Our mission is to make grocery shopping fast, reliable, and enjoyable.
          </p>
        </div>

        {/* Image */}
        <div className="relative h-75 md:h-100">
          <Image
            src={grocery}
            alt="Our Team"
            fill
            className="object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            {[
              {
                icon: <Leaf className="text-emerald-500" />,
                title: "Fresh Products",
                desc: "Directly sourced from farms for maximum freshness.",
              },
              {
                icon: <Truck className="text-emerald-500" />,
                title: "Fast Delivery",
                desc: "Get your groceries delivered within minutes.",
              },
              {
                icon: <Users className="text-emerald-500" />,
                title: "Trusted by Thousands",
                desc: "Loved by customers across multiple cities.",
              },
              {
                icon: <Target className="text-emerald-500" />,
                title: "Our Mission",
                desc: "To revolutionize grocery shopping experience.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="w-12 h-12 mx-auto flex items-center justify-center bg-emerald-100 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="py-16 px-6 text-center">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

          {[
            { number: "50K+", label: "Happy Customers" },
            { number: "100+", label: "Cities Served" },
            { number: "10 Min", label: "Delivery Time" },
            { number: "500+", label: "Farmers Connected" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-500">
                {stat.number}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-emerald-500 text-white py-16 text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          Ready to experience FreshCart?
        </h2>

        <p className="mt-3 text-sm md:text-base text-white/90">
          Join thousands of happy customers today.
        </p>

        <button className="mt-6 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition">
        <a href={'/'}> Start Shopping</a> 
        </button>
      </div>

    </div>
  );
}