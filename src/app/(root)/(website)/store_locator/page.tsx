'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Search, Phone, Clock, Send, Navigation, Star, 
  CheckCircle2, ChevronRight, Mail, Info 
} from 'lucide-react';

// Dynamically load the map with SSR disabled to fix "window is not defined"
const StoreMap = dynamic(() => import('./StoreMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-100 animate-pulse">
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Map...</p>
    </div>
  )
});

const STORES = [
  { id: 1, name: "FreshCart - Sector 62", address: "Pioneer Square, Golf Course Ext Rd, Gurugram", phone: "+91 124 405 9237", timing: "6:00 AM - 11:00 PM", rating: 4.8, lat: 28.4116, lng: 77.0858 },
  { id: 2, name: "FreshCart - Cyber Hub", address: "DLF Cyber City, Phase 2, Gurugram", phone: "+91 124 555 0192", timing: "24 Hours", rating: 4.9, lat: 28.4951, lng: 77.0878 },
  { id: 3, name: "FreshCart - South City", address: "Arcadia Market, South City II, Gurugram", phone: "+91 124 888 2211", timing: "7:00 AM - 10:00 PM", rating: 4.5, lat: 28.4234, lng: 77.0422 }
];

const StoreLocator = () => {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 overflow-x-hidden">
      
      {/* --- HERO HEADER --- */}
      <header className="bg-white border-b pt-24 pb-16 px-6 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600 font-bold text-sm uppercase mb-4">
              <MapPin size={16} /> 100+ Locations in India
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">Find a Store <br/> Near <span className="text-green-500">You.</span></h1>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Search city..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-green-400 outline-none" />
          </div>
        </div>
      </header>

      {/* --- MAIN INTERFACE --- */}
      <section className="max-w-7xl mx-auto px-0 md:px-6 mt-8 relative z-30">
        <div className="bg-white rounded-none md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-175 border border-white">
          
          {/* Sidebar */}
          <div className="w-full md:w-96 bg-white border-r overflow-y-auto custom-scrollbar z-10">
            <div className="p-6 border-b bg-slate-50/50 sticky top-0 z-20">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Stores</p>
            </div>
            {STORES.map((store) => (
              <div 
                key={store.id} 
                onClick={() => setSelectedStore(store)}
                className={`p-6 cursor-pointer border-b transition-all relative ${selectedStore.id === store.id ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}
              >
                {selectedStore.id === store.id && (
                  <motion.div layoutId="active" className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg">{store.name}</h3>
                  <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border text-xs font-bold shadow-sm">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" /> {store.rating}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{store.address}</p>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1"><Clock size={14}/> {store.timing}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="flex-1 relative bg-slate-100">
            {/* The Map */}
            <StoreMap selectedStore={selectedStore} stores={STORES} />

            {/* Floating Info Card - High Z-index to stay above Leaflet */}
            <div className="absolute top-6 left-6 right-6 md:right-auto md:w-80 z-1000 pointer-events-none">
              <motion.div 
                key={selectedStore.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white pointer-events-auto"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
                    <Navigation size={20} />
                  </div>
                  <h4 className="font-black">{selectedStore.name}</h4>
                </div>
                <div className="space-y-3 mb-6 text-sm font-medium text-slate-600">
                  <div className="flex items-center gap-3"><Phone size={14} /> {selectedStore.phone}</div>
                  <div className="flex items-center gap-3"><Mail size={14} /> store@freshcart.com</div>
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}`)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all"
                >
                  Get Directions <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT FORM --- */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6">Don't see a store?</h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">Tell us where you want us to open next!</p>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0"><Info size={20} /></div>
              <p className="text-sm font-bold text-slate-600">Head Office: Gurugram, Sector 62.</p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Name" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-400" />
                    <input required type="email" placeholder="Email" className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                  <textarea required rows={4} placeholder="Your suggestion..." className="w-full px-5 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-green-400" />
                  <button className="w-full bg-green-500 text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2">
                    Send Message <Send size={20} />
                  </button>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-10">
                  <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-black">Success!</h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const ArrowRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default StoreLocator;


