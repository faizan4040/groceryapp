'use client'

import React from 'react'
import { motion } from 'motion/react'
import { 
  RefreshCcw, 
  PackageCheck, 
  Clock, 
  CreditCard, 
  HelpCircle, 
  ShieldCheck,
  ArrowRight,
  MessageCircle
} from 'lucide-react'

const RefundAndReturn = () => {
  const steps = [
    { title: "Raise a Request", desc: "Go to 'My Orders' and select 'Help'.", icon: <MessageCircle /> },
    { title: "Validation", desc: "Our team checks the issue within 24 hours.", icon: <ShieldCheck /> },
    { title: "Pickup/Refund", desc: "Instant refund for missing or damaged items.", icon: <RefreshCcw /> },
  ];

  const categories = [
    {
      title: "Groceries & Fresh",
      policy: "Refund/Replacement within 24 hours of delivery if quality is not satisfactory.",
      icon: <PackageCheck className="text-green-500" />
    },
    {
      title: "Electronics",
      policy: "7-day return policy for manufacturing defects. Must include original packaging.",
      icon: <CreditCard className="text-green-500" />
    },
    {
      title: "Home & Kitchen",
      policy: "Items can be returned within 48 hours if they are unused and tags are intact.",
      icon: <RefreshCcw className="text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-white pt-24 pb-16 px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <ShieldCheck size={16} /> 100% Satisfaction Guaranteed
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
            Hassle-free <span className="text-green-600">Refunds.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Not happy with your order? Don't worry. We've simplified our return process to ensure you get your money back as fast as possible.
          </p>
        </div>
      </section>

      {/* --- HOW IT WORKS (STEPS) --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-black mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- DETAILED POLICIES --- */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2">Category Policies</h2>
            <p className="text-slate-500 font-medium">Refund rules vary based on what you bought.</p>
          </div>
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm cursor-pointer hover:underline">
            Read Full Terms <ArrowRight size={16} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-200 hover:border-green-300 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h4 className="text-xl font-black mb-4">{cat.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                {cat.policy}
              </p>
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instant Refund</span>
                <Clock size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- REFUND TIMELINES TABLE --- */}
      <section className="max-w-5xl mx-auto px-6 mt-24">
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <CreditCard size={150} />
          </div>
          
          <h2 className="text-3xl font-black mb-10 relative z-10">Refund Timelines</h2>
          
          <div className="space-y-6 relative z-10">
            {[
              { method: "Wallet / UPI", time: "Instant (within 5-10 mins)" },
              { method: "Debit / Credit Card", time: "3 - 5 Business Days" },
              { method: "Net Banking", time: "Up to 7 Business Days" }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-800 last:border-0">
                <span className="font-bold text-slate-300">{item.method}</span>
                <span className="text-green-400 font-black">{item.time}</span>
              </div>
            ))}
          </div>
          
          <p className="mt-10 text-xs text-slate-500 italic">
            *Please note that timelines are subject to bank processing speeds and may vary during public holidays.
          </p>
        </div>
      </section>

      {/* --- FAQ REDIRECT --- */}
      <section className="max-w-3xl mx-auto px-6 mt-24 text-center">
        <div className="bg-green-600 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-green-200">
          <HelpCircle className="mx-auto mb-6 w-12 h-12 text-green-200" />
          <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
          <p className="text-green-100 mb-8 font-medium">Check our Frequently Asked Questions or contact our support team directly via the app.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-green-600 px-10 py-4 rounded-2xl font-black hover:bg-green-50 transition-colors">
              Visit Help Center
            </button>
            <button className="bg-green-700 text-white px-10 py-4 rounded-2xl font-black border border-green-500/50">
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER INFO --- */}
      <footer className="mt-24 border-t border-slate-200 pt-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-50">
          <div className="text-2xl font-black italic tracking-tighter">freshcart</div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Blink Commerce Private Limited © 2026</p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RefundAndReturn