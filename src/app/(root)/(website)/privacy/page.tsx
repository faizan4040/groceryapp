'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  UserCheck, 
  Smartphone, 
  Mail, 
  Scale, 
  Clock,
  ArrowRight,
  Database,
  Share2
} from 'lucide-react';

export default function FreshCartitPrivacy() {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: 'Privacy Promise', icon: ShieldCheck },
    { id: 'scope', title: 'Applicability', icon: Scale },
    { id: 'collect', title: 'Data Collection', icon: Database },
    { id: 'usage', title: 'How We Use Info', icon: Eye },
    { id: 'sharing', title: 'Data Sharing', icon: Share2 },
    { id: 'security', title: 'Security', icon: Lock },
    { id: 'rights', title: 'Your Rights', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-900 font-sans selection:bg-green-200">
      
      {/* HEADER / HERO */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">FreshCart <span className="text-slate-400 font-medium">Privacy</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Clock className="w-4 h-4" /> Last Updated: Jan 2025
            </span>
            <a href="mailto:privacy@FreshCartit.com" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
              Contact DPO
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDE NAVIGATION */}
          <aside className="lg:w-64 shrink-0">
            <nav className="sticky top-32 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Contents</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === s.id 
                    ? 'bg-green-500 text-black shadow-md shadow-green-100' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  {s.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* CONTENT AREA */}
          <div className="flex-1 space-y-20 pb-24">
            
            {/* Intro */}
            <section id="intro" className="scroll-mt-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <ShieldCheck size={200} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-slate-950">
                  Protecting your privacy is our priority.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                  We i.e. <strong>"FreshCart Commerce Private Limited"</strong> (formerly known as Grofers India Private Limited) (“Company”), are committed to protecting the privacy and security of your personal information. Your privacy is important to us and maintaining your trust is paramount.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg text-sm text-slate-500">
                    CIN: U74140HR2015PTC055568
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Scope */}
            <section id="scope" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Scale /></div>
                <h2 className="text-2xl font-bold">Applicability & Scope</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-200">
                  <h3 className="font-bold mb-3 text-slate-900">What it Covers</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Applies to all information FreshCartit collects through its Services, emails, texts, and other electronic communications. It specifically covers our website, app, and platform.
                  </p>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl text-white">
                  <h3 className="font-bold mb-3 text-green-400">Permissible Age</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Our services are not intended for users under the age of <strong>18</strong>. We do not knowingly collect or solicit data from minors.
                  </p>
                </div>
              </div>
            </section>

            {/* Collection */}
            <section id="collect" className="scroll-mt-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600"><Database /></div>
                <h2 className="text-2xl font-bold">The Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
                  <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-8">
                      <div className="text-purple-600 font-bold mb-4 uppercase text-xs tracking-widest">Provided by You</div>
                      <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> Name, Address, & Email</li>
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> Order History & Content</li>
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> Payment & Transaction Info</li>
                      </ul>
                    </div>
                    <div className="p-8 bg-slate-50/50">
                      <div className="text-purple-600 font-bold mb-4 uppercase text-xs tracking-widest">Automated Means</div>
                      <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> IP Address & Device IDs</li>
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> Precise GPS Location</li>
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> Browsing Activity & Logs</li>
                      </ul>
                    </div>
                    <div className="p-8">
                      <div className="text-purple-600 font-bold mb-4 uppercase text-xs tracking-widest">Safety & Tech</div>
                      <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> CCTV & Image/Video Data</li>
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> Third-Party Social Sign-ins</li>
                        <li className="flex gap-2"><ArrowRight className="w-4 h-4 text-purple-400 shrink-0" /> Cookies & Pixel Tags</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Usage */}
            <section id="usage" className="scroll-mt-32">
              <div className="bg-green-50 p-8 md:p-12 rounded-[2.5rem] border border-green-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-green-400 rounded-2xl text-black"><Eye /></div>
                  <h2 className="text-2xl font-bold">How We Use Your Data</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    "Administering services & deliveries",
                    "Improving content & personalization",
                    "Sending updates & customized deals",
                    "Diagnosing technical platform issues",
                    "Enforcing Terms of Service",
                    "Detecting & preventing fraud",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Security */}
            <section id="security" className="scroll-mt-32">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Lock /></div>
                    <h2 className="text-2xl font-bold">Data Security</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We follow generally accepted industry standards to protect personal information. Our payment processing is fully <strong>PCI-compliant</strong>. We use encryption during transmission and managerial procedures to prevent unauthorized access.
                  </p>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <Smartphone className="text-slate-400" />
                    <p className="text-xs text-slate-500">
                      <strong>Pro Tip:</strong> Never share your password or OTP. If we receive instructions via your credentials, we assume they are authorized by you.
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-72 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="text-emerald-600 w-8 h-8" />
                  </div>
                  <span className="font-bold text-slate-900 block mb-1">Encrypted Data</span>
                  <span className="text-sm text-slate-500 italic">256-bit SSL Protection</span>
                </div>
              </div>
            </section>

            {/* Rights */}
            <section id="rights" className="scroll-mt-32">
               <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-6">Your Rights & Choices</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                      <div>
                        <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                          <UserCheck className="w-5 h-5" /> Access & Control
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          You can manage your email preferences and unsubscribe from commercial messages. You may review, update, or correct your information via your account settings.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                          <Database className="w-5 h-5" /> Account Deletion
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          You may permanently delete your account. Note that backup copies may exist for legal reasons or risk mitigation purposes even after deletion.
                        </p>
                      </div>
                    </div>
                  </div>
               </div>
            </section>

          </div>
        </div>
      </main>

      {/* FOOTER CONTACT */}
      <footer className="bg-white border-t border-slate-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need Clarification?</h2>
          <p className="text-slate-500 mb-8">Our Data Protection Officer (DPO) is available to answer any questions regarding your data privacy.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:privacy@FreshCartit.com" className="flex items-center justify-center gap-3 bg-slate-100 px-8 py-4 rounded-2xl font-bold hover:bg-[#FFD337] transition-all">
              <Mail className="w-5 h-5" /> privacy@FreshCartit.com
            </a>
            <div className="flex items-center justify-center gap-3 bg-slate-100 px-8 py-4 rounded-2xl font-bold">
              <Smartphone className="w-5 h-5" /> 011-40592373
            </div>
          </div>
          <p className="mt-12 text-xs text-slate-400 leading-relaxed">
            FreshCart Commerce Private Limited<br />
            Ground Floor, Pioneer Square, Sector 62, Gurugram, Haryana - 122098
          </p>
        </div>
      </footer>
    </div>
  );
}