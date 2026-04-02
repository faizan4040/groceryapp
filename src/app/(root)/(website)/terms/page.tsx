'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { 
  ShieldCheck, 
  Scale, 
  UserCheck, 
  Info, 
  AlertCircle, 
  Truck, 
  MessageSquare, 
  Mail,
  ChevronRight,
  History
} from 'lucide-react'

export default function Terms() {
  const [activeTab, setActiveTab] = useState('acceptance')

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: ShieldCheck },
    { id: 'overview', title: 'Services Overview', icon: Info },
    { id: 'eligibility', title: 'Eligibility', icon: UserCheck },
    { id: 'account', title: 'Account & Registration', icon: Scale },
    { id: 'licence', title: 'Limited Licence', icon: AlertCircle },
    { id: 'delivery', title: 'Delivery Partners', icon: Truck },
    { id: 'comments', title: 'Reviews & Ratings', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-900 font-sans selection:bg-green-200">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-bold mb-6"
          >
            <History size={16} /> Last updated: February 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6"
          >
            Terms of <span className="text-green-500">Use</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed"
          >
            Please read these terms carefully. They govern your legal rights and responsibilities when using the Blinkit Platform.
          </motion.p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Navigation Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4 mb-4">On this page</p>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveTab(section.id)
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === section.id 
                    ? 'bg-green-500 text-black shadow-lg shadow-green-100' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <section.icon size={18} /> {section.title}
                  </span>
                  <ChevronRight size={16} className={activeTab === section.id ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
          </aside>

          {/* Legal Text Sections */}
          <div className="flex-1 space-y-16 pb-24">
            
            {/* Identity Notice */}
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
              </div>
              <h3 className="text-green-500 font-bold uppercase tracking-widest text-xs mb-4">Official Entity</h3>
              <p className="text-lg leading-relaxed text-slate-200">
                <strong>Blink Commerce Private Limited</strong> (formerly Grofers India Private Limited) is incorporated under the Companies Act, 2013.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-800 text-sm text-slate-400">
                Registered Office: Ground Floor, Tower A, Pioneer Square, Sector 62, Gurugram-122098, Haryana.
              </div>
            </div>

            {/* Acceptance */}
            <section id="acceptance" className="scroll-mt-28">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <ShieldCheck className="text-green-500" /> Acceptance of Terms
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-7 space-y-4">
                <p>
                  Your access to the <strong>Blinkit Platform</strong> (Site and Mobile Apps) is governed by these Terms and our Privacy Policy. By undertaking any sale-purchase transaction, you agree to be bound by these Terms.
                </p>
                <div className="bg-white border-l-4 border-green-400 p-6 rounded-r-2xl shadow-sm italic">
                  "If you do not accept these terms, you may not access the platform or use our services."
                </div>
              </div>
            </section>

            {/* Services Overview */}
            <section id="overview" className="scroll-mt-28">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Info className="text-blue-500" /> Services Overview
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">The Platform</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Blinkit acts as a marketplace facilitating transactions between consumers and Third-Party Sellers. We do not control quality or fitness for Third-Party Offerings.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg">Disclaimers</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Blinkit is not a party to the bipartite arrangement between you and third-party sellers. We disclaim all warranties associated with third-party offerings.
                  </p>
                </div>
              </div>
            </section>

            {/* Eligibility */}
            <section id="eligibility" className="scroll-mt-28">
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <UserCheck className="text-emerald-500" /> Eligibility
              </h2>
              <ul className="space-y-4">
                {[
                  { title: "Age Limit", desc: "Users under 18 must use the platform under the supervision of a parent or guardian." },
                  { title: "End Consumers Only", desc: "Intended for domestic/self-consumption. Wholesalers or B2B users are not eligible." },
                  { title: "Prohibited Goods", desc: "Minors are strictly prohibited from purchasing tobacco or adult-rated products." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                    <div>
                      <h5 className="font-bold text-slate-900">{item.title}</h5>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Delivery Partners */}
            <section id="delivery" className="scroll-mt-28">
              <div className="bg-green-500 p-8 md:p-12 rounded-[3rem] shadow-xl text-black">
                <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                  <Truck /> Delivery Partners
                </h2>
                <p className="font-medium text-lg leading-relaxed mb-6">
                  Delivery is facilitated through independent contractors. They are neither employees nor agents of Blinkit.
                </p>
                <div className="bg-black/5 p-6 rounded-2xl border border-black/10">
                  <h4 className="font-bold mb-2">Code of Conduct</h4>
                  <p className="text-sm opacity-80">
                    We reserve the right to block access if a user is disrespectful, discourteous, or abusive towards delivery partners.
                  </p>
                </div>
              </div>
            </section>

            {/* Content Restrictions */}
            <section id="licence" className="scroll-mt-28">
               <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <AlertCircle className="text-red-500" /> Prohibited Content
              </h2>
              <p className="text-slate-600 mb-6 font-medium">You agree not to upload or share content that is:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Harmful or Abusive", "Infringing IP", "Deceptive/False", 
                  "Commercial Spam", "Malware/Viruses", "Invasive of Privacy"
                ].map((tag, i) => (
                  <div key={i} className="px-4 py-3 bg-slate-100 rounded-xl text-slate-700 text-xs font-bold border border-slate-200">
                    • {tag}
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Footer Card */}
            <div className="bg-white border-2 border-slate-200 p-8 md:p-12 rounded-[2.5rem] text-center">
              <Mail className="mx-auto text-green-500 mb-6" size={48} />
              <h2 className="text-2xl font-black mb-2">Need Clarification?</h2>
              <p className="text-slate-500 mb-8">For any queries regarding these Terms, please contact our support team.</p>
              <a 
                href="mailto:info@blinkit.com" 
                className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                info@blinkit.com
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mb-4">Blink Commerce Private Limited</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-500 font-medium">
             <a href="#" className="hover:text-green-600">Privacy Policy</a>
             <a href="#" className="hover:text-green-600">Cookie Policy</a>
             <a href="#" className="hover:text-green-600">Contact Us</a>
          </div>
        </div>
      </footer>

    </div>
  )
}