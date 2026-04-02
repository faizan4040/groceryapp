'use client'

import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Download, Facebook, Twitter, Instagram, Linkedin, Images } from 'lucide-react';
import deliveryboy from "@/constants/images/delivery_boy.png"
import deliverys from "@/constants/images/deliverys.jpg"
import parcell from "@/constants/images/parcell.jpg"
import Image from 'next/image';

const Seller = () => {
  const sellerFeatures = [
    {
      title: "Reach your customers where they are",
      desc: "We deliver your product through our dense network of 2000+ dark stores",
      img: deliverys, 
    },
    {
      title: "Exponential growth opportunity",
      desc: "List your products on India's fastest-growing retail channel and grow with us",
      img: deliverys,
    },
    {
      title: "Expand your reach",
      desc: "Your products can now reach millions of customers in 100+ major cities",
      img: deliverys,
    },
    {
      title: "It's simple and easy",
      desc: "Onboard your products in minutes and manage your business effortlessly",
      img: deliverys,
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
    
      {/* --- HERO BANNER --- */}
      <header className="relative h-152.5 bg-[#fdf2f2] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="z-10"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Your Products. <br/>
              <span className="text-green-400">Delivered.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md font-medium">
              Offer customers the delight of your products and the convenience of doorstep deliveries. Sign up and start selling!
            </p>
            <button className="bg-green-400 text-black px-8 py-4 rounded-xl font-black text-lg shadow-xl shadow-green-100 hover:scale-105 transition-transform">
              Sell on FreshCart
            </button>
          </motion.div>
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${deliveryboy.src})` }}
            >
            <div className="w-full h-full bg-linear-to-l from-transparent to-[#fdf2f2]"></div>
            </div>
        </div>
      </header>

      {/* --- FEATURE SECTION (Left Img - Center Text - Right Img) --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/4">
            <Image 
                src={parcell}
                alt="Delivery Boy"
                className="rounded-3xl"
                 />
          </div>
          
          <div className="w-full md:w-2/4 text-center">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Why FreshCart is every <br/>
              <span className="text-green-500 underline decoration-slate-200">seller’s top choice?</span>
            </h2>
          </div>

          <div className="w-full md:w-1/4">
            <Image
                src={deliverys}
                alt="Delivery Boy"
                className="rounded-3xl "
            />
            </div>
        </div>

        {/* --- 2 ROW 2 COLS CARDS --- */}
       <div className="grid md:grid-cols-2 gap-8 mt-20">
  {sellerFeatures.map((item, idx) => (
    <motion.div 
      key={idx}
      whileHover={{ y: -10 }}
      className="relative h-64 rounded-[2.5rem] overflow-hidden group shadow-xl border border-slate-100"
    >
      
      {/* Image */}
      <div className="absolute inset-0">
        <Image 
          src={item.img}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-10 h-full flex flex-col justify-center bg-black/30">
        <h3 className="text-2xl font-black mb-3 text-white">
          {item.title}
        </h3>
        <p className="text-white/90 font-medium leading-relaxed">
          {item.desc}
        </p>
      </div>

    </motion.div>
  ))}
</div>
      </section>

      {/* --- SERVICE INFO SECTION --- */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="border-l-4 border-green-400 pl-8">
            <h3 className="text-2xl font-black mb-4">#1 Instant delivery service in India</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Shop on the go and get anything delivered to your doorstep. Buy everything from groceries to fresh fruits & vegetables, cakes and bakery items, meats & seafood, cosmetics, mobiles & accessories, electronics, baby care products and much more. We get it delivered to your doorstep in the safest way possible.
            </p>
          </div>

          <div className="border-l-4 border-slate-900 pl-8">
            <h3 className="text-2xl font-black mb-4">Single app for all your daily needs</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Order thousands of products at just a tap - milk, eggs, bread, cooking oil, ghee, atta, rice, fresh fruits & vegetables, spices, chocolates, chips, biscuits, Maggi, cold drinks, shampoos, soaps, body wash, pet food, diapers, electronics, other organic and gourmet products from your neighbourhood stores and a lot more.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm">
            <h3 className="text-xl font-black mb-6 text-green-600">Cities we currently serve:</h3>
            <p className="text-slate-500 text-sm leading-relaxed tracking-wide">
              Delhi, Gurugram, Kolkata, Lucknow, Mumbai, Bengaluru, Ahmedabad, Noida, Ghaziabad, Faridabad, Hyderabad, Jaipur, Pune, Chennai, Chandigarh, Ludhiana, Vadodara, Meerut, Kanpur, Panchkula, Kharar, Amritsar, Bhopal, Indore, Zirakpur, Jalandhar, Dehradun, Agra, Mohali, Goa, Patiala, Sonipat, Bhiwadi, Kota, Rohtak, Bahadurgarh, Haridwar, Bathinda, Kochi, Jodhpur and Jammu.
            </p>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default Seller;