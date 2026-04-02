'use client'

import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  MessageSquare, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-900 font-sans pb-20">
      
      {/* --- SCAM ALERT BANNER (URGENT) --- */}
      <div className="bg-red-50 border-b border-red-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs tracking-widest">
            <ShieldAlert size={18} /> Security Warning
          </div>
          <p className="text-sm text-red-800 font-medium">
            Beware of fake numbers! green does not have an official customer care phone line. 
            <span className="font-black"> Never share UPI pin, OTP, or Card details.</span>
          </p>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="bg-white pt-20 pb-16 px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black tracking-tighter mb-6"
          >
            We're here for <span className="text-green-400">you.</span>
          </motion.h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question about your order or our services? Our team is available through the app to help you instantly.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- IN-APP SUPPORT CARD --- */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-2 bg-green-400 rounded-[2.5rem] p-10 text-black shadow-2xl shadow-green-100 flex flex-col md:flex-row items-center gap-10"
          >
            <div className="flex-1">
              <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black mb-4">Chat with us</h2>
              <p className="font-bold text-black/70 mb-8 leading-relaxed">
                For any issues regarding missing items, delivery delays, or payment queries, please use our 24/7 in-app support.
              </p>
              <button className="bg-black text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-transform">
                Open Support in App <ArrowRight size={20} />
              </button>
            </div>
            <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-32 h-32 bg-white/40 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Clock className="text-green-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- CORPORATE INFO --- */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm"
          >
            <h3 className="text-xl font-black mb-8">Corporate Office</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin className="text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-1">Address</p>
                  <p className="font-medium text-slate-700 leading-relaxed">
                    Ground Floor, Pioneer Square, Sector 62, Golf Course Extension Road, Gurugram, Haryana - 122098
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="font-medium text-slate-700">info@green.com</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Globe className="text-slate-400 shrink-0" />
                <div>
                  <p className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-1">CIN</p>
                  <p className="font-medium text-slate-700">U74140HR2015PTC055568</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- FAST DELIVERY INFO --- */}
        <section className="mt-20">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black mb-6">#1 instant delivery service in India</h2>
                <p className="text-slate-400 font-medium leading-relaxed mb-6">
                  Order thousands of products at just a tap - from groceries and fresh vegetables to electronics and baby care. We get it delivered to your doorstep in the fastest and safest way possible.
                </p>
                <div className="flex flex-wrap gap-4">
                   <div className="px-4 py-2 bg-slate-800 rounded-full text-xs font-bold border border-slate-700">Groceries</div>
                   <div className="px-4 py-2 bg-slate-800 rounded-full text-xs font-bold border border-slate-700">Electronics</div>
                   <div className="px-4 py-2 bg-slate-800 rounded-full text-xs font-bold border border-slate-700">Bakery</div>
                   <div className="px-4 py-2 bg-slate-800 rounded-full text-xs font-bold border border-slate-700">Meats</div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
                <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={18} /> Important Note
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "green does not have any official customer care phone line. A green representative will never ask for bank details such as account number, UPI pin, CVV, or card details. Please report any such activity via the app."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CITY LIST SECTION --- */}
        <section className="mt-20">
        <div className="text-center mb-10">
            <h3 className="text-3xl font-black">Cities we currently serve</h3>
            <p className="text-slate-400 text-sm font-bold mt-2 uppercase tracking-widest">
            Available in 100+ locations across India
            </p>
        </div>

        {/* Removed 'overflow-y-auto' and 'custom-scrollbar' to eliminate scrolling */}
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm min-h-125 flex flex-wrap content-start gap-x-6 gap-y-3">
            {[
            "Agra", "Ahmedabad", "Ajmer", "Akola", "Aligarh", "Alwar", "Amravati", "Amritsar", "Anand", "Ankleshwar", "Asansol", "Aurangabad", "Ayodhya", "Bahadurgarh", "Ballari", "Bardhaman", "Bareilly", "Bathinda", "Begusarai", "Belagavi", "Bengaluru", "Bhopal", "Bhagalpur", "Bharuch", "Bhavnagar", "Bhimavaram", "Bhiwadi", "Bhubaneswar", "Bhuj", "Bidar", "Bikaner", "Bokaro", "Chandigarh", "Chandrapur", "Chennai", "Coimbatore", "Cuttack", "Darbhanga", "Davanagere", "Dehradun", "Dewas", "Deoria", "Delhi", "Dhanbad", "Dharamshala", "Dharwad", "Durg", "Durgapur", "Erode", "Faridabad", "Firozabad", "Firozpur", "Gandhidham", "Gaya", "Ghaziabad", "Goa", "Gonda", "Gorakhpur", "Greater Noida", "Guntur", "Guwahati", "Gwalior", "Haldwani", "Hamirpur", "Haridwar", "Hassan", "Hisar", "Hoshiarpur", "Hosur", "Hubballi", "Hyderabad", "Indore", "Jabalpur", "Jaipur", "Jalandhar", "Jammu", "Jamshedpur", "Jaunpur", "Jind", "Jodhpur", "Kaithal", "Kakinada", "Kalaburagi", "Kanpur", "Kapurthala", "Karnal", "Kharagpur", "Kharar", "Khanna", "Kochi", "Kolhapur", "Kolkata", "Kota", "Kotdwar", "Kottayam", "Kozhikode", "Kurnool", "Kurukshetra", "Lakhimpur", "Latur", "Lucknow", "Ludhiana", "Madurai", "Mangaluru", "Manali", "Manipal", "Mathura", "Meerut", "Mehsana", "Mohali", "Moga", "Modinagar", "Moradabad", "Mumbai", "Muzaffarnagar", "Muzaffarpur", "Mysuru", "Nadiad", "Nagpur", "Narmadapuram", "Nashik", "Navsari", "Nellore", "Noida", "Panipat", "Panchkula", "Patiala", "Patna", "Pathankot", "Phagwara", "Prayagraj", "Puducherry", "Pune", "Puri", "Purnia", "Raebareli", "Raipur", "Rajahmundry", "Rajkot", "Rajpura", "Rampur", "Ranchi", "Rewari", "Rishikesh", "Rohtak", "Roorkee", "Rudrapur", "Saharanpur", "Salem", "Sangrur", "Satna", "Satara", "Shillong", "Shivamogga", "Sikar", "Siliguri", "Sirsa", "Sitapur", "Solan", "Solapur", "Sonipat", "Sri Ganganagar", "Surat", "Thiruvananthapuram", "Tiruchirappalli", "Tirupati", "Tumakuru", "Udaipur", "Udupi", "Una", "Unnao", "Ujjain", "Vadodara", "Vapi", "Varanasi", "Vellore", "Vijayapura", "Vijayawada", "Visakhapatnam", "Vizianagaram", "Vrindavan", "Warangal", "Yamunanagar"
            ].map((city, index, array) => (
            <span key={city} className="text-sm text-slate-500 font-medium hover:text-green-500 cursor-default transition-colors">
                {city}{index !== array.length - 1 ? " •" : ""}
            </span>
            ))}
        </div>
        </section>
      </div>

      {/* --- FOOTER COPYRIGHT --- */}
      <footer className="mt-20 text-center px-6">
        <div className="max-w-7xl mx-auto border-t border-slate-200 pt-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Blink Commerce Private Limited</p>
          <p className="text-[10px] text-slate-400 max-w-xl mx-auto leading-relaxed">
            By continuing past this page, you agree to our Terms of Service, Cookie Policy, Staff Policy and Privacy Policy. All trademarks are properties of their respective owners. © 2016-2026 green.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;