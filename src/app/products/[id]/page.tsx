import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import mongoose from 'mongoose'
import {
  Star, Leaf, Flame, Sparkles, Heart, ArrowRight, Smile, ChevronRight,
} from 'lucide-react'

import connectDB from '@/lib/db'
import { auth } from '@/auth'
import Grocery from '@/models/grocery.models'
import Review from '@/models/review.model'
import { IGrocery } from '@/types/grocery'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductHero from '@/components/product/ProductHero'
import { Variant } from '@/components/product/ProductBuyBox'
import ReviewSection from '@/components/ReviewSection'
import { CARD_COLORS } from '@/components/MasalaCard'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

/* ───────────────────────────── data ───────────────────────────── */

async function getData(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null
  await connectDB()

  const product = await Grocery.findById(id).lean()
  if (!product) return null
  const p = JSON.parse(JSON.stringify(product)) as IGrocery

  const [sameCat, others, ratingAgg] = await Promise.all([
    Grocery.find({ _id: { $ne: id }, category: p.category }).limit(5).lean(),
    Grocery.find({ _id: { $ne: id }, category: { $ne: p.category } }).sort({ createdAt: -1 }).limit(5).lean(),
    Review.aggregate([
      { $match: { groceryId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]),
  ])

  const related = JSON.parse(JSON.stringify([...sameCat, ...others].slice(0, 5))) as IGrocery[]
  const rating = ratingAgg[0] ? { avg: Math.round(ratingAgg[0].avg * 10) / 10, count: ratingAgg[0].count as number } : null

  return { product: p, related, rating }
}

/** Stable colour per product so the same item always gets the same panel colour. */
const colorFor = (id: string) =>
  CARD_COLORS[[...id].reduce((n, c) => n + c.charCodeAt(0), 0) % CARD_COLORS.length]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id)) return {}
  await connectDB()
  const p = await Grocery.findById(id).select('name category').lean<{ name: string; category: string }>()
  return p ? { title: `${p.name} | LazzatBits`, description: `Buy ${p.name} — pure ${p.category} masala.` } : {}
}

/* ───────────────────────────── page ───────────────────────────── */

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const [data, session] = await Promise.all([getData(id), auth()])
  if (!data) return notFound()

  const { product, related, rating } = data
  const color = colorFor(id)
  const baseImages = product.images?.length ? product.images : product.image ? [product.image] : []
  const images = Array.from(new Set([...baseImages, ...(product.variants ?? []).map((v) => v.image).filter((x): x is string => !!x)]))

  // pack sizes — fall back to the single price when the product has no variants yet
  const hasVariants = !!product.variants?.length
  const price = Number(product.price)
  const discount = Number(product.discount) || 0
  const fallbackOriginal =
    product.originalPrice && Number(product.originalPrice) > price
      ? Number(product.originalPrice)
      : discount > 0 ? Math.round(price / (1 - discount / 100)) : undefined
  const variants: Variant[] = hasVariants
    ? product.variants!.map((v) => ({ label: v.label, price: Number(v.price), originalPrice: v.originalPrice, stock: v.stock, image: v.image }))
    : [{ label: product.unit === 'pack' || product.unit === 'piece' ? `1 ${product.unit}` : 'Regular pack', price, originalPrice: fallbackOriginal, stock: product.stock }]

  const chips = product.tags?.length ? product.tags.slice(0, 3) : ['Freshly packed', 'Rich aroma', 'Authentic taste']
  const chipIcons = [Leaf, Sparkles, Flame]

  const highlights = (product.highlights ?? [])
    .map((h) => (typeof h === 'string' ? { title: h, text: '' } : h))
    .slice(0, 3)
  const loveIcons = [Leaf, Flame, Sparkles]

  const hasDetails = !!product.ingredients || !!product.nutrition?.length

  return (
    <>
      <Navbar />

      <main className="w-[95%] max-w-[1400px] mx-auto px-2 pb-6">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brown-500 py-4 md:py-5 overflow-hidden">
          <Link href="/" className="hover:text-brown-900 shrink-0">Home</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link href="/#shop" className="hover:text-brown-900 capitalize shrink-0">{product.category || 'Products'}</Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-brown-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* ── hero: gallery + buy box ─────────────────────────── */}
        <section className="rounded-[24px] md:rounded-[32px] bg-[#F5ECDF] p-3 sm:p-5 md:p-6">
          <ProductHero
            id={id}
            name={product.name}
            image={product.image}
            unit={product.unit || ''}
            images={images}
            color={color}
            variants={variants}
            hasVariants={hasVariants}
            info={
              <>
              <span className="inline-block px-2.5 py-1 rounded-full bg-brown-600 text-brown-50 text-[10px] font-bold uppercase tracking-wider">
                {product.category || 'Masala'}
              </span>

              <h1 className="font-display font-extrabold text-brown-900 text-[28px] sm:text-4xl xl:text-[42px] leading-[1.1] tracking-tight mt-2.5">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mt-2.5 text-sm">
                <span className="flex text-amber-500" aria-hidden>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={17} fill={rating && i < Math.round(rating.avg) ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  ))}
                </span>
                {rating ? (
                  <a href="#reviews" className="text-brown-700 hover:text-brown-900">
                    {rating.avg} ({rating.count} {rating.count === 1 ? 'review' : 'reviews'})
                  </a>
                ) : (
                  <a href="#reviews" className="text-brown-500 hover:text-brown-900">No reviews yet</a>
                )}
              </div>

              <p className="text-brown-700 text-[15px] leading-relaxed mt-4 max-w-md">
                {product.description || `Pure ${product.category?.toLowerCase() || 'masala'} with bold colour and rich aroma. Packed fresh for your everyday cooking.`}
              </p>

              <ul className="flex flex-wrap gap-2 mt-4">
                {chips.map((c, i) => {
                  const Icon = chipIcons[i % chipIcons.length]
                  return (
                    <li key={c} className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-[#E9E4CF] text-brown-900 text-xs font-semibold">
                      <Icon size={16} strokeWidth={1.75} className="shrink-0" />
                      {c}
                    </li>
                  )
                })}
              </ul>
              </>
            }
          />
        </section>

        {/* ── why you'll love it ─────────────────────────────── */}
        {highlights.length > 0 && (
          <section className="mt-6 md:mt-8 rounded-[28px] md:rounded-[36px] bg-[#E6E2C8] px-5 py-7 md:px-10 md:py-9 relative overflow-hidden">
            <Heart className="absolute right-6 top-6 text-brown-900/20 hidden sm:block" size={36} />
            <h2 className="font-display font-extrabold text-brown-900 text-2xl md:text-3xl">Why you&apos;ll love it</h2>
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-0 mt-6">
              {highlights.map((h, i) => {
                const Icon = loveIcons[i % loveIcons.length]
                return (
                  <div key={h.title} className={`flex sm:flex-col gap-4 sm:gap-3 sm:px-6 ${i > 0 ? 'sm:border-l sm:border-brown-900/15' : 'sm:pl-0'}`}>
                    <span className="w-14 h-14 shrink-0 rounded-full bg-brown-900 text-brown-50 flex items-center justify-center">
                      <Icon size={24} strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="font-bold text-brown-900">{h.title}</h3>
                      {h.text && <p className="text-sm text-brown-700 mt-1 leading-relaxed">{h.text}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── ingredients + nutrition ───────────────────────── */}
        {hasDetails && (
          <section id="details" className="scroll-mt-40 mt-6 md:mt-8 grid md:grid-cols-2 gap-6 md:gap-8">
            {product.ingredients && (
              <div className={`rounded-[28px] md:rounded-[36px] bg-brown-100 p-6 md:p-8 flex flex-col sm:flex-row gap-6 ${!product.nutrition?.length ? 'md:col-span-2' : ''}`}>
                <div className="relative w-full sm:w-40 aspect-square shrink-0 rounded-3xl overflow-hidden isolate" style={{ background: color }}>
                  <Image src={product.image} alt="" fill sizes="160px" className="object-contain p-4 mix-blend-multiply" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-brown-900 text-xl md:text-2xl">Real ingredients</h2>
                  <p className="text-sm text-brown-700 leading-relaxed mt-2">{product.ingredients}</p>
                  {chips.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {chips.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-sm text-brown-900">
                          <Smile size={16} className="text-brown-600" /> {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {!!product.nutrition?.length && (
              <div className={`rounded-[28px] md:rounded-[36px] bg-[#F6E7BE] p-6 md:p-8 ${!product.ingredients ? 'md:col-span-2' : ''}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display font-extrabold text-brown-900 text-xl md:text-2xl">Nutrition facts</h2>
                  {product.nutritionServing && <span className="text-xs text-brown-600">{product.nutritionServing}</span>}
                </div>
                <dl className="mt-4 divide-y divide-brown-900/10 border-t-2 border-brown-900">
                  {product.nutrition.map((n) => (
                    <div key={n.label} className="flex justify-between py-2 text-sm">
                      <dt className="text-brown-900">{n.label}</dt>
                      <dd className="font-semibold text-brown-900">{n.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        )}
        {!hasDetails && <span id="details" className="block scroll-mt-40" />}

        {/* ── reviews ─────────────────────────────────────── */}
        <section id="reviews" className="scroll-mt-40 mt-6 md:mt-8 rounded-[28px] md:rounded-[36px] bg-white/60 p-4 md:p-8">
          <ReviewSection groceryId={id} userId={(session?.user as { id?: string } | undefined)?.id ?? null} />
        </section>

        {/* ── you might also love ─────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-10 md:mt-14">
            <div className="flex items-end justify-between mb-5">
              <h2 className="font-display font-extrabold text-brown-900 text-2xl md:text-3xl">You might also love</h2>
              <Link href="/#shop" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brown-900 hover:text-brown-600">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex lg:grid lg:grid-cols-5 gap-3 md:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-1 px-1">
              {related.map((r) => {
                const rid = r._id.toString()
                return (
                  <Link
                    key={rid}
                    href={`/products/${rid}`}
                    className="group snap-start shrink-0 w-[62%] sm:w-[40%] md:w-[30%] lg:w-auto rounded-[20px] overflow-hidden bg-brown-100 hover:shadow-xl hover:shadow-brown-900/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] isolate" style={{ background: colorFor(rid) }}>
                      <Image src={r.image} alt={r.name} fill sizes="(max-width: 1024px) 60vw, 18vw" className="object-contain p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-brown-900 line-clamp-1">{r.name}</h3>
                      <p className="text-xs text-brown-500 mt-0.5 capitalize line-clamp-1">{r.description || r.category}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-display font-extrabold text-brown-900">₹{r.price}</span>
                        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brown-900 text-brown-50 text-[11px] font-semibold group-hover:bg-brown-600 transition">
                          View details <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── CTA banner ──────────────────────────────────── */}
        <section className="mt-10 md:mt-14 rounded-[28px] md:rounded-[36px] bg-[#F3D9A4] overflow-hidden relative">
          <div className="grid md:grid-cols-[1.2fr_1fr_auto] items-center gap-6 p-6 sm:p-8 md:p-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brown-700">Pure masala. Real taste.</p>
              <h2 className="font-display font-extrabold uppercase text-brown-900 text-4xl md:text-5xl leading-[0.95] mt-2">
                Spice it up <Heart className="inline -mt-2" size={30} />
              </h2>
              <p className="text-brown-700 mt-3 text-sm md:text-base">Fresh spices. Bold flavours. A tastier kitchen.</p>
              <Link href="/#shop" className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full bg-brown-900 hover:bg-brown-600 text-brown-50 text-sm font-semibold transition">
                Explore all products <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative hidden md:block h-52">
              <Image src="/categories/masalas.webp" alt="" fill sizes="30vw" className="object-contain drop-shadow-[0_18px_24px_rgba(46,28,16,0.35)]" />
            </div>
            <ul className="flex md:flex-col gap-5 md:gap-4 flex-wrap">
              {[{ I: Leaf, t: 'Pure & natural' }, { I: Flame, t: 'Bold flavour' }, { I: Smile, t: 'Freshly ground' }].map(({ I, t }) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-semibold text-brown-900">
                  <span className="w-9 h-9 rounded-full border-2 border-brown-900 flex items-center justify-center"><I size={16} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
