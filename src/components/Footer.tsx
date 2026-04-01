'use client'

import { ShoppingCart, MapPin, Phone, Mail, ArrowUpRight, Leaf } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { SiVisa, SiMastercard, SiPaypal, SiApplepay } from "react-icons/si";
import { motion } from "motion/react";
import Link from "next/link";

const company = [
  { name: "About Us", href: "/aboutus" },
  { name: "Our Farmers", href: "/farmers" },
  { name: "Sustainability", href: "/sustainability" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" }, 
];
const service = ["Contact Us", "Shipping Policy", "Refund & Returns", "FAQs", "Store Locator"];

const socials = [
  { Icon: FaFacebookF,  href: "#", label: "Facebook",  color: "hover:bg-[#1877F2]" },
  { Icon: FaInstagram,  href: "#", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400" },
  { Icon: FaTwitter,    href: "#", label: "Twitter",   color: "hover:bg-[#1DA1F2]" },
  { Icon: FaYoutube,    href: "#", label: "YouTube",   color: "hover:bg-[#FF0000]" },
];

const payments = [
  { Icon: SiVisa,       label: "Visa" },
  { Icon: SiMastercard, label: "Mastercard" },
  { Icon: SiPaypal,     label: "PayPal" },
  { Icon: SiApplepay,   label: "Apple Pay" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 text-white mt-24 overflow-hidden">

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-72 bg-emerald-500/8 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-60 bg-green-400/6 rounded-full blur-3xl" />

      {/* ── Top accent line ── */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* ── Top CTA banner ── */}
      <div className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center shrink-0">
              <Leaf size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Get fresh groceries delivered in 30 minutes</p>
              <p className="text-gray-400 text-xs">Join 50,000+ happy customers across the US</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="shrink-0 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            Start Shopping
            <ArrowUpRight size={15} />
          </motion.button>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="bg-emerald-500 w-10 h-10 flex items-center justify-center rounded-xl shadow-md shadow-emerald-500/30 group-hover:bg-emerald-400 transition-colors">
                <ShoppingCart size={19} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Fresh<span className="text-emerald-400">Cart</span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-57.5">
              Farm-fresh groceries sourced directly from local farmers, delivered to your door with care.
            </p>

            {/* Badges */}
            <div className="flex gap-2 mt-5 flex-wrap">
              {["🌱 100% Organic", "⚡ 30-min Delivery"].map((b) => (
                <span key={b} className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {b}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2.5 mt-6">
              {socials.map(({ Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-white transition-all duration-200 ${color}`}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-400 rounded-full inline-block" />
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-300 transition-colors"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-emerald-400 text-xs">
                      →
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-400 rounded-full inline-block" />
              Customer Service
            </h3>
            <ul className="space-y-3">
              {service.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-300 transition-colors"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-emerald-400 text-xs">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-400 rounded-full inline-block" />
              Contact
            </h3>

            <div className="space-y-4">
              {[
                {
                  Icon: MapPin,
                  text: "123 Fresh Way, Organic Valley, CA 94103, USA",
                },
                {
                  Icon: Phone,
                  text: "+1 (555) 123-4567",
                  href: "tel:+15551234567",
                },
                {
                  Icon: Mail,
                  text: "support@freshcart.com",
                  href: "mailto:support@freshcart.com",
                },
              ].map(({ Icon, text, href }, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon size={14} className="text-emerald-400" />
                  </div>
                  {href ? (
                    <a href={href} className="text-sm text-gray-400 hover:text-emerald-300 transition-colors leading-snug mt-1">
                      {text}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 leading-snug mt-1">{text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-14 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

        {/* ── Bottom bar ── */}
        <div className="mt-7 flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-xs text-gray-500 order-2 md:order-1">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-400 font-semibold">FreshCart</span>. All rights reserved.
            {" "}·{" "}
            <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy</Link>
            {" "}·{" "}
            <Link href="#" className="hover:text-emerald-400 transition-colors">Terms</Link>
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-2 order-1 md:order-2">
            <span className="text-[10px] text-gray-600 font-medium mr-1 uppercase tracking-wider">We accept</span>
            {payments.map(({ Icon, label }) => (
              <div
                key={label}
                className="w-11 h-7 bg-white/5 border border-white/8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                title={label}
              >
                <Icon size={20} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}