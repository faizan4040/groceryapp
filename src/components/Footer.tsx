'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Truck, PackageOpen, LockKeyhole, Headset, Mail, ArrowRight, Loader2, Check } from 'lucide-react'
import { FaInstagram, FaFacebookF, FaYoutube, FaPinterestP, FaWhatsapp } from 'react-icons/fa'
import Logo, { BRAND } from '@/components/BrandLogo'

/* ───────────────────────────── content ─────────────────────────────
   Social links: replace "#" with your real profile URLs. Links left as "#"
   are hidden automatically so visitors never hit a dead icon.          */
const SOCIALS = [
  { Icon: FaInstagram, label: 'Instagram', href: '#' },
  { Icon: FaFacebookF, label: 'Facebook', href: '#' },
  { Icon: FaYoutube, label: 'YouTube', href: '#' },
  { Icon: FaPinterestP, label: 'Pinterest', href: '#' },
  { Icon: FaWhatsapp, label: 'WhatsApp', href: '#' },
]

const PERKS = [
  { Icon: Truck, title: 'Free Shipping', text: 'On orders over ₹499', href: '/shippingpolicy' },
  { Icon: PackageOpen, title: 'Easy Returns', text: 'Hassle-free process', href: '/refund' },
  { Icon: LockKeyhole, title: 'Secure Payment', text: 'Razorpay, UPI & COD', href: '/terms' },
  { Icon: Headset, title: 'Customer Support', text: 'We’re here to help', href: '/contactus' },
]

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Spices', href: '/#shop' },
      { label: 'Ground Spices', href: '/#shop' },
      { label: 'Whole Spices', href: '/#shop' },
      { label: 'Blended Masala', href: '/#shop' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Recipes', href: '/blog' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping Policy', href: '/shippingpolicy' },
      { label: 'Track Order', href: '/track' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Store Locator', href: '/store_locator' },
      { label: 'Become a Seller', href: '/seller' },
      { label: 'Contact', href: '/contactus' },
    ],
  },
]

// 2 columns on mobile, 4 on desktop — dividers and padding line up in both
const PERK_CELL = [
  'pr-3 sm:pr-6',
  'pl-4 sm:pl-6 border-l border-white/10',
  'pr-3 sm:pr-6 lg:pl-8 lg:border-l lg:border-white/10',
  'pl-4 sm:pl-6 lg:pl-8 border-l border-white/10',
]

/* ───────────────────────────── newsletter ───────────────────────────── */

type Status = 'idle' | 'loading' | 'done' | 'error'

function useSubscribe() {
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')

  const subscribe = async (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error'); setMsg('Please enter a valid email address.'); return false
    }
    setStatus('loading'); setMsg('')
    try {
      const res = await fetch('/api/auth/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) { setStatus('done'); setMsg('You’re in! Watch your inbox for recipes & offers.'); return true }
      setStatus(res.status === 409 ? 'done' : 'error')
      setMsg(data.message || 'Something went wrong. Please try again.')
    } catch {
      setStatus('error'); setMsg('Network error. Please try again.')
    }
    return false
  }
  return { status, msg, subscribe }
}

function SubscribeForm({ variant }: { variant: 'band' | 'compact' }) {
  const [email, setEmail] = useState('')
  const { status, msg, subscribe } = useSubscribe()
  const band = variant === 'band'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await subscribe(email.trim())) setEmail('')
  }

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className={
          band
            ? 'flex items-center w-full bg-white/70 border border-neutral-900/15 rounded-full p-1.5 pl-5 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-600/10 transition'
            : 'flex items-center w-full border border-white/20 rounded-xl p-1 pl-4 focus-within:border-red-500 transition'
        }
      >
        {band && <Mail size={18} className="text-neutral-500 shrink-0" />}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={band ? 'Enter your email address' : 'Enter your email'}
          aria-label="Email address"
          className={`flex-1 min-w-0 bg-transparent text-sm focus:outline-none ${band ? 'px-3 py-2.5 text-neutral-900 placeholder:text-neutral-500' : 'py-2 text-white placeholder:text-white/45'}`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label="Subscribe"
          className={`shrink-0 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-60 cursor-pointer ${
            band ? 'h-11 px-5 sm:px-7 rounded-full text-sm' : 'w-10 h-10 rounded-lg'
          }`}
        >
          {status === 'loading' ? <Loader2 size={17} className="animate-spin" />
            : status === 'done' ? <Check size={17} />
            : band ? <>Subscribe <ArrowRight size={16} /></> : <ArrowRight size={17} />}
        </button>
      </form>
      {msg && (
        <p role="status" className={`text-xs mt-2 ${band ? 'pl-5' : ''} ${status === 'error' ? (band ? 'text-red-700' : 'text-red-400') : (band ? 'text-green-700' : 'text-green-400')}`}>
          {msg}
        </p>
      )}
    </div>
  )
}

/* ───────────────────────────── decoration ───────────────────────────── */

function RedLeaves({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 320" className={className} aria-hidden>
      <g fill="#B3170F">
        <path d="M60 300 C 20 230, 10 150, 70 60 C 120 140, 120 230, 60 300 Z" opacity=".55" />
        <path d="M70 290 C 110 220, 170 190, 195 120 C 120 120, 80 190, 70 290 Z" opacity=".4" />
        <path d="M50 280 C 10 250, -20 200, -10 150 C 40 170, 60 220, 50 280 Z" opacity=".35" />
      </g>
      <g stroke="#2a0503" strokeWidth="1.5" fill="none" opacity=".6">
        <path d="M62 295 C 66 220, 68 140, 70 70" />
        <path d="M72 285 C 110 220, 150 170, 190 125" />
      </g>
    </svg>
  )
}

/* ───────────────────────────── footer ───────────────────────────── */

/** @param flush  no top margin — used when a section sits directly on the footer */
export default function Footer({ flush = false }: { flush?: boolean }) {
  const socials = SOCIALS.filter((s) => s.href && s.href !== '#')
  const year = new Date().getFullYear()

  return (
    <footer className={`relative ${flush ? '' : 'mt-20 md:mt-28'} bg-[#0E0B0A] text-white overflow-hidden isolate`}>
      {/* ambient red glow + leaves */}
      <div className="absolute -z-10 -left-32 bottom-0 w-96 h-96 rounded-full bg-red-700/20 blur-[120px]" />
      <div className="absolute -z-10 -right-32 top-1/3 w-96 h-96 rounded-full bg-red-700/15 blur-[120px]" />
      <RedLeaves className="absolute -z-10 -left-10 top-40 w-40 md:w-56 opacity-70" />
      <RedLeaves className="absolute -z-10 -right-10 bottom-0 w-40 md:w-52 opacity-60 -scale-x-100" />
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="w-[95%] max-w-[1400px] mx-auto px-2">
        {/* perks */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 py-8 md:py-10">
          {PERKS.map(({ Icon, title, text, href }, i) => (
            <li key={title} className={PERK_CELL[i]}>
              <Link href={href} className="group flex items-center gap-3 md:gap-4">
                <Icon size={34} strokeWidth={1.4} className="shrink-0 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="min-w-0">
                  <span className="block text-sm md:text-[15px] font-semibold">{title}</span>
                  <span className="block text-xs md:text-sm text-white/55 mt-0.5">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* newsletter band */}
        <section className="relative rounded-[22px] md:rounded-[28px] bg-gradient-to-r from-[#F3E4CF] via-[#F7EBDA] to-[#F3E4CF] text-neutral-900 overflow-hidden">
          <div className="grid md:grid-cols-[auto_1fr_minmax(0,440px)] items-center gap-5 md:gap-8 px-5 py-6 sm:px-8 md:pl-4 md:pr-24 lg:pr-28 md:py-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/spices/ground-spices.png" alt="" className="hidden md:block w-36 lg:w-44 h-auto drop-shadow-[0_10px_12px_rgba(0,0,0,0.25)]" />
            <div>
              <h2 className="font-serif text-2xl md:text-[28px] leading-tight">Join the {BRAND.first}{BRAND.second} Circle</h2>
              <p className="text-sm text-neutral-600 mt-1.5 max-w-md">Get new recipes, exclusive offers, and early access to new masala blends.</p>
            </div>
            <SubscribeForm variant="band" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/spices/herbs.png" alt="" className="hidden md:block absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 h-[120%] w-auto rotate-12 drop-shadow-[0_8px_10px_rgba(0,0,0,0.2)]" />
        </section>

        {/* link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1.45fr] gap-x-6 gap-y-10 py-12 md:py-14">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Logo />
            <p className="text-sm text-white/60 leading-relaxed mt-4 max-w-56">
              Pure masala for every Indian kitchen — freshly ground, honestly packed.
            </p>
            {socials.length > 0 && (
              <ul className="flex items-center gap-2.5 mt-6">
                {socials.map(({ Icon, label, href }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:bg-red-600 hover:border-red-600 hover:text-white transition">
                      <Icon size={15} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-[15px] font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition">
                      <span className="w-0 h-px bg-red-500 group-hover:w-3 transition-all" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="text-[15px] font-semibold">Stay Connected</h3>
            <p className="text-sm text-white/60 leading-relaxed mt-4 mb-4 max-w-72">
              Be the first to know about new products, recipes, and special offers.
            </p>
            <div className="max-w-sm">
              <SubscribeForm variant="compact" />
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/45">
          <p>© {year} {BRAND.first}{BRAND.second}. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
            <li><Link href="/refund" className="hover:text-white transition">Refunds</Link></li>
            <li><Link href="/shippingpolicy" className="hover:text-white transition">Shipping</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
