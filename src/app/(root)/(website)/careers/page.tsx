'use client'

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Heart, 
  Zap, 
  Baby, 
  Activity, 
  Coffee, 
  ChevronRight,
  Search,
  ExternalLink
} from 'lucide-react';

const Careers = () => {
  const values = [
    { q: "Are they smarter than us?", icon: <Zap className="text-yellow-500" /> },
    { q: "Are they more ambitious than us?", icon: <Activity className="text-green-500" /> },
    { q: "Do they take full ownership?", icon: <Users className="text-blue-500" /> },
    { q: "Are they comfortable saying 'I don't know'?", icon: <Heart className="text-pink-500" /> }
  ];

  const benefits = [
    {
      title: "Period Leave",
      desc: "12 days of paid period leave a year for women and trans employees to cater to their health.",
      icon: <Activity className="w-6 h-6" />
    },
    {
      title: "Equal Parental Leave",
      desc: "26 weeks of paid leave for both mothers and fathers, usable within the first three years.",
      icon: <Baby className="w-6 h-6" />
    },
    {
      title: "Health & Fitness",
      desc: "In-house fitness coaches and nutritionists focused on creating a healthier environment.",
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: "Wellness Support",
      desc: "Access to psychiatrists and counselors for practical guidance on health, family, and work.",
      icon: <Coffee className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8"
          >
            Join <span className="text-green-600">Eternal.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium"
          >
            Identifying, recruiting, and enabling the right people is the highest leverage role we play. 
            We are always on the lookout for exceptional folks, no matter their experience.
          </motion.p>
        </div>
      </section>

      {/* --- CORE PHILOSOPHY --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6 leading-tight">
              When we meet potential <br/>team members, we ask:
            </h2>
            <div className="space-y-4 mt-10">
              {values.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">{item.icon}</div>
                  <span className="font-bold text-lg">{item.q}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-green-600 rounded-[3rem] p-12 text-white shadow-2xl relative z-10">
              <h3 className="text-3xl font-black mb-6">Referral Only</h3>
              <p className="text-lg opacity-90 leading-relaxed mb-8 font-medium">
                We only accept applications through employee referrals. Find someone in our team who can vouch for you, 
                and have a conversation with them. That’s where it all starts!
              </p>
              <div className="inline-flex items-center gap-2 font-bold border-b-2 border-white pb-1 cursor-pointer hover:gap-4 transition-all">
                Find a contact on LinkedIn <ExternalLink size={18} />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-slate-200 rounded-[3rem] z-0"></div>
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              We care for each other. <br/><span className="text-green-500 underline decoration-slate-700">Period.</span>
            </h2>
            <p className="text-slate-400 max-w-sm font-medium">
              Our benefits are designed to support you through every phase of your life and career.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-[2rem]"
              >
                <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center mb-6 text-green-500">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold mb-4">{benefit.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OPEN ROLES PREVIEW --- */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Open Roles at Eternal</h2>
          <p className="text-slate-500 font-medium italic">Current openings across Zomato, Blinkit, and District</p>
        </div>

        <div className="space-y-4">
          {['Engineering', 'Product', 'Design', 'Operations'].map((dept) => (
            <div key={dept} className="group flex items-center justify-between p-8 bg-white border border-slate-200 rounded-3xl hover:border-green-500 hover:shadow-xl transition-all cursor-pointer">
              <div>
                <h3 className="text-2xl font-black group-hover:text-green-600 transition-colors">{dept}</h3>
                <p className="text-slate-400 text-sm mt-1 font-bold uppercase tracking-widest">Explore Opportunities</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                <ChevronRight />
              </div>
            </div>
          ))}
        </div>
      </section>

   
    </div>
  );
};

export default Careers;