import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf, FlaskConical, Sprout, House } from 'lucide-react'
import Logo from '@/components/BrandLogo'

const FEATURES = [
  { Icon: Leaf, a: 'Naturally Fermented', b: 'for Deeper Flavor' },
  { Icon: FlaskConical, a: 'Small-Batch', b: 'Artisanal' },
  { Icon: Sprout, a: 'Real Ingredients', b: 'No Shortcuts' },
  { Icon: House, a: 'Kits & Guides', b: 'for Home Cooks' },
]

const INGREDIENTS = [
  { name: 'Chilli Peppers', text: 'The heart of every batch.', img: '/ingredients/chilli.png', blob: '#F8C3A5', href: '/#shop' },
  { name: 'Garlic', text: 'Rich, savory depth.', img: '/ingredients/garlic.png', blob: '#E6CCE3', href: '/#shop' },
  { name: 'Ginger', text: 'A bright, earthy kick.', img: '/ingredients/ginger.png', blob: '#F7D98C', href: '/#shop' },
  { name: 'Sea Salt', text: 'Naturally preserves and builds flavor.', img: '/ingredients/salt.png', blob: '#DDE8C5', href: '/#shop' },
]

// organic blob shapes, one per card so they don't look stamped
const BLOBS = [
  '58% 42% 46% 54% / 52% 44% 56% 48%',
  '46% 54% 58% 42% / 44% 56% 44% 56%',
  '52% 48% 40% 60% / 58% 46% 54% 42%',
  '44% 56% 52% 48% / 50% 58% 42% 50%',
]

/** "Real peppers, real process" story block — sits directly on top of the footer. */
export default function IngredientsStory() {
  return (
    <section className="relative mt-20 md:mt-28 bg-[#FBEEDF] overflow-hidden isolate" aria-labelledby="ingredients-title">
      {/* ── maroon feature band ───────────────────────────── */}
      <div className="relative bg-gradient-to-r from-[#4A0A0C] via-[#6B1214] to-[#4A0A0C] text-white">
        <div className="w-[95%] max-w-[1500px] mx-auto px-2 py-6 md:py-7 lg:pb-10 flex items-center gap-8">
          <div className="hidden xl:block shrink-0 pr-8 border-r border-white/20"><Logo /></div>
          <ul className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-y-5">
            {FEATURES.map(({ Icon, a, b }, i) => (
              <li key={a} className={`flex items-center gap-3 px-3 sm:px-5 ${i % 2 ? 'border-l border-white/20' : ''} ${i === 2 ? 'lg:border-l lg:border-white/20' : ''}`}>
                <Icon size={30} strokeWidth={1.3} className="shrink-0 text-[#F4C9A8]" />
                <span className="text-xs sm:text-sm font-medium leading-snug">{a}<br /><span className="text-white/75">{b}</span></span>
              </li>
            ))}
          </ul>
        </div>
        {/* torn edge into the cream */}
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute -bottom-px left-0 w-full h-5 md:h-8 text-[#FBEEDF]" aria-hidden>
          <path fill="currentColor" d="M0 40 L0 22 C 80 30, 140 12, 230 20 S 380 34, 470 18 S 640 6, 760 22 S 930 36, 1040 20 S 1220 8, 1320 24 S 1410 30, 1440 18 L1440 40 Z" />
        </svg>
      </div>

      {/* ── story ─────────────────────────────────────────── */}
      <div className="relative grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)_minmax(0,2fr)] items-center gap-8 lg:gap-10 xl:gap-14 pb-14 md:pb-16 lg:pb-20 pt-8 lg:pt-10">
        {/* pepper plant — bleeds off the left edge on desktop */}
        <div className="relative mx-4 lg:mx-0 h-64 sm:h-80 lg:h-[440px] overflow-hidden rounded-[28px] lg:rounded-none lg:[border-radius:0_46%_54%_0/0_50%_50%_0] ring-4 ring-[#E9A35B]/40 lg:ring-0 lg:shadow-[8px_0_0_#E9A35B55]">
          <Image src="/ingredients/pepper-plant.jpg" alt="Red chilli peppers ripening on the plant" fill sizes="(max-width: 1024px) 95vw, 30vw" className="object-cover" />
        </div>

        {/* copy */}
        <div className="px-6 lg:px-0">
          <h2 id="ingredients-title" className="font-serif text-[44px] sm:text-6xl lg:text-[58px] xl:text-[68px] leading-[0.98] tracking-tight">
            <span className="text-[#6B1214]">Real</span><br />
            <span className="text-[#6B1214]"><span className="text-[#D9771E]">P</span>eppers,</span><br />
            <span className="bg-gradient-to-r from-[#D9771E] to-[#8A1A16] bg-clip-text text-transparent">Real Process.</span>
          </h2>
          <p className="mt-5 text-[15px] md:text-base text-neutral-700 leading-relaxed max-w-sm">
            We source vibrant, flavour-packed peppers and let time and nature do the magic — creating complex heat
            with real character.
          </p>
          <Link
            href="/aboutus"
            className="group inline-flex items-center gap-2.5 mt-7 pl-7 pr-6 py-3.5 rounded-full bg-gradient-to-b from-[#7A1416] to-[#560C0E] text-white font-semibold shadow-lg shadow-[#6B1214]/30 hover:shadow-xl hover:shadow-[#6B1214]/40 transition"
          >
            Our Ingredients <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ingredient cards */}
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-8 px-4 lg:pl-0 lg:pr-[max(1rem,2.5vw)]">
          {INGREDIENTS.map((it, i) => (
            <li key={it.name} className={i > 0 ? 'md:border-l md:border-[#6B1214]/10' : ''}>
              <Link href={it.href} className="group flex flex-col items-center text-center px-2 xl:px-4">
                <span className="relative w-full max-w-[190px] aspect-[1/1.05] flex items-center justify-center">
                  <span
                    className="absolute inset-[4%] group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500"
                    style={{ background: it.blob, borderRadius: BLOBS[i] }}
                  />
                  <Image
                    src={it.img}
                    alt={it.name}
                    width={360}
                    height={340}
                    className="relative w-[88%] h-auto drop-shadow-[0_14px_14px_rgba(80,20,10,0.25)] group-hover:-translate-y-2 group-hover:scale-105 transition-transform duration-500"
                  />
                </span>
                <span className="mt-5 font-serif text-xl md:text-[22px] text-[#4A0A0C] group-hover:text-[#B3261E] transition-colors">{it.name}</span>
                <span className="mt-1.5 text-sm text-neutral-700 leading-snug max-w-[150px]">{it.text}</span>
                <span className="mt-3 h-0.5 w-10 rounded-full bg-[#E39A3A] group-hover:w-16 transition-all duration-300" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* wooden ledge + spice bowl */}
      <div className="relative h-6 md:h-8 bg-gradient-to-b from-[#7A4A2A] to-[#4A2A16]" aria-hidden>
        <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent_0_38px,rgba(0,0,0,0.25)_38px_40px)]" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/spices/ground-spices.png" alt="" aria-hidden className="hidden md:block absolute right-0 bottom-2 w-40 lg:w-52 drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]" />
    </section>
  )
}
