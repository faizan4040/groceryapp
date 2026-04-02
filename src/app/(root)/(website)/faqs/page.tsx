'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  ChevronDown, 
  HelpCircle, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Package, 
  Search,
  Zap,
  Info
} from 'lucide-react'

// FAQ Data Structure
const faqData = [
  {
    category: "General",
    icon: <Info className="w-5 h-5" />,
    questions: [
      {
        q: "What is Blinkit and why was the name changed?",
        a: "Blinkit (formerly Grofers) is India's #1 instant delivery service. The name was changed to reflect our commitment to speed—delivering your needs in the blink of an eye. We specialize in lightning-fast delivery of groceries and essentials."
      },
      {
        q: "What kind of products does Blinkit sell?",
        a: "We offer thousands of products including milk, eggs, bread, fresh fruits & vegetables, meat, seafood, electronics, cosmetics, baby care, and even pet food. If you need it daily, we likely have it."
      },
      {
        q: "What cities and locations does Blinkit operate in?",
        a: "We currently operate in over 100+ cities across India including Delhi, Mumbai, Bengaluru, Gurugram, Kolkata, Pune, and many more. Check the 'Cities we serve' section below for the full list."
      }
    ]
  },
  {
    category: "Miscellaneous",
    icon: <HelpCircle className="w-5 h-5" />,
    questions: [
      { q: "Does Blinkit deliver cigarettes?", a: "No, we do not deliver tobacco products or cigarettes through our platform." },
      { q: "Does Blinkit deliver sanitary pads?", a: "Yes, we have a wide range of personal hygiene and wellness products available for instant delivery." },
      { q: "Does Blinkit deliver condoms?", a: "Yes, sexual wellness products are available on the app with discreet packaging." },
      { q: "Does Blinkit deliver 24 hours/all night?", a: "Operating hours depend on the local regulations and store availability in your specific area. Please check the app for real-time status." },
      { q: "Does Blinkit deliver ice cream?", a: "Yes! We use specialized cold-storage bags to ensure your ice cream reaches you frozen and ready to eat." },
      { q: "Do you take into consideration delivery partners’ safety?", a: "Absolutely. Safety is our top priority. We do not set unrealistic delivery targets that compromise the safety of our partners on the road." }
    ]
  },
  {
    category: "Orders & Delivery",
    icon: <Truck className="w-5 h-5" />,
    questions: [
      { q: "How does Blinkit deliver at your doorstep?", a: "Once an order is placed, our system assigns it to the nearest dark store. A delivery partner picks it up and uses GPS-optimized routes to reach your doorstep within minutes." },
      { q: "Cancellation and return policy?", a: "Orders can be cancelled before they are picked up. For quality issues with fresh produce or damaged items, we offer a hassle-free return/refund process via the 'Help' section in the app." },
      { q: "Taxes on your Order?", a: "All prices shown are inclusive of applicable GST. A small delivery and handling fee may be applied at checkout." }
    ]
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: any) => {
  return (
    <div className="border-b border-slate-100 last:border-none">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left hover:text-green-600 transition-colors"
      >
        <span className="font-bold text-slate-800 pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-slate-500 leading-relaxed text-sm">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<string | null>("General-0");
  const [searchQuery, setSearchQuery] = useState("");

  const cities = "Agra, Ahmedabad, Ajmer, Akola, Aligarh, Alwar, Amravati, Amritsar, Anand, Ankleshwar, Asansol, Aurangabad, Ayodhya, Bahadurgarh, Ballari, Bardhaman, Bareilly, Bathinda, Begusarai, Belagavi, Bengaluru, Bhopal, Bhagalpur, Bharuch, Bhavnagar, Bhimavaram, Bhiwadi, Bhubaneswar, Bhuj, Bidar, Bikaner, Bokaro, Chandigarh, Chandrapur, Chennai, Coimbatore, Cuttack, Darbhanga, Davanagere, Dehradun, Dewas, Deoria, Delhi, Dhanbad, Dharamshala, Dharwad, Durg, Durgapur, Erode, Faridabad, Firozabad, Firozpur, Gandhidham, Gaya, Ghaziabad, Goa, Gonda, Gorakhpur, Greater Noida, Guntur, Guwahati, Gwalior, Haldwani, Hamirpur, Haridwar, Hassan, Hisar, Hoshiarpur, Hosur, Hubballi, Hyderabad, Indore, Jabalpur, Jaipur, Jalandhar, Jammu, Jamshedpur, Jaunpur, Jind, Jodhpur, Kaithal, Kakinada, Kalaburagi, Kanpur, Kapurthala, Karnal, Kharagpur, Kharar, Khanna, Kochi, Kolhapur, Kolkata, Kota, Kotdwar, Kottayam, Kozhikode, Kurnool, Kurukshetra, Lakhimpur, Latur, Lucknow, Ludhiana, Madurai, Mangaluru, Manali, Manipal, Mathura, Meerut, Mehsana, Mohali, Moga, Modinagar, Moradabad, Mumbai, Muzaffarnagar, Muzaffarpur, Mysuru, Nadiad, Nagpur, Narmadapuram, Nashik, Navsari, Nellore, Noida, Panipat, Panchkula, Patiala, Patna, Pathankot, Phagwara, Prayagraj, Puducherry, Pune, Puri, Purnia, Raebareli, Raipur, Rajahmundry, Rajkot, Rajpura, Rampur, Ranchi, Rewari, Rishikesh, Rohtak, Roorkee, Rudrapur, Saharanpur, Salem, Sangrur, Satna, Satara, Shillong, Shivamogga, Sikar, Siliguri, Sirsa, Sitapur, Solan, Solapur, Sonipat, Sri Ganganagar, Surat, Thiruvananthapuram, Tiruchirappalli, Tirupati, Tumakuru, Udaipur, Udupi, Una, Unnao, Ujjain, Vadodara, Vapi, Varanasi, Vellore, Vijayapura, Vijayawada, Visakhapatnam, Vizianagaram, Vrindavan, Warangal, Yamunanagar.";

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-900 pb-20">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100"
          >
            <HelpCircle className="text-black w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight mb-4">How can we help?</h1>
          <p className="text-slate-500 mb-8 font-medium">Search for answers or browse our frequently asked questions.</p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search for 'delivery', 'ice cream', 'returns'..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-green-100 focus:border-green-400 outline-none transition-all shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- FAQ ACCORDIONS --- */}
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {faqData.map((category) => (
          <section key={category.category}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-green-600">
                {category.icon}
              </div>
              <h2 className="font-black uppercase tracking-wider text-slate-400 text-sm">
                {category.category}
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 px-8 shadow-sm">
              {category.questions.map((item, idx) => {
                const itemKey = `${category.category}-${idx}`;
                // Simple search filter logic
                if (searchQuery && !item.q.toLowerCase().includes(searchQuery.toLowerCase())) return null;

                return (
                  <AccordionItem
                    key={itemKey}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === itemKey}
                    onClick={() => setOpenIndex(openIndex === itemKey ? null : itemKey)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        {/* --- CITIES SECTION --- */}
        <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <MapPin size={120} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Zap className="text-green-400" /> Cities we currently serve
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm font-medium">
              {cities}
            </p>
          </div>
        </section>

        {/* --- CONTACT & INFO --- */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <Package />
            </div>
            <h3 className="text-lg font-bold mb-2">#1 Instant Delivery</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Shop on the go and get anything delivered at your doorstep—from groceries to fresh vegetables and electronics.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
              <ShieldCheck />
            </div>
            <h3 className="text-lg font-bold mb-2">Safe & Secure</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We ensure your orders are delivered in the fastest and safest way possible, prioritizing delivery partner safety.
            </p>
          </div>
        </div>
      </div>

      {/* --- FOOTER CARD --- */}
      <footer className="max-w-4xl mx-auto px-6 mt-20">
        <div className="bg-green-400 rounded-[3rem] p-12 text-center text-black">
          <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
          <p className="font-medium mb-8 opacity-80">We're here to help you 24/7 with any issues regarding your order.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:info@blinkit.com" className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all">
              Email Us
            </a>
            <div className="bg-white/20 backdrop-blur-md px-10 py-4 rounded-full font-bold border border-black/10">
              011-40592373
            </div>
          </div>
          <div className="mt-12 text-xs font-bold opacity-60">
            CIN: U74140HR2015PTC055568 | Ground Floor, Pioneer Square, Sector 62, Gurugram
          </div>
        </div>
      </footer>
    </div>
  )
}