import React from 'react'
import Herosection from './Herosection'
import SpiceTicker from './SpiceTicker'
import PromoBanner from './PromoBanner'
import FeaturedCarousel, { FeaturedProduct } from './FeaturedCarousel'
import User from "@/models/user.models";
import Review from "@/models/review.model";
import OriginsBanner from "@/components/OriginsBanner";
import BestSeller from "@/components/BestSeller";
import IngredientsStory from "@/components/IngredientsStory";
import Footer from "@/components/Footer";
import connectDB from '@/lib/db';
import Grocery from '@/models/grocery.models';
import CategorySection from './Categorysection';
import { IGrocery } from '@/types/grocery';

const UserDashboard = async () => {
  await connectDB()

  const [raw, customerCount, reviewStats, recentReviews, featuredRaw, ratingByProduct] = await Promise.all([
    Grocery.find().lean(),
    User.countDocuments({ role: 'user' }).catch(() => 0),
    Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]).catch(() => []),
    // newest reviews first; we keep the first 4 distinct reviewers
    Review.find().sort({ createdAt: -1 }).limit(40).populate('userId', 'name image').lean().catch(() => []),
    // products the admin starred in View Grocery
    Grocery.find({ featured: true }).sort({ featuredAt: -1, createdAt: -1 }).limit(15).lean().catch(() => []),
    Review.aggregate([{ $group: { _id: '$groceryId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }]).catch(() => []),
  ])

  const ratings = new Map<string, { avg: number; count: number }>(
    (ratingByProduct as any[]).map((r) => [String(r._id), { avg: r.avg, count: r.count }]),
  )
  const featured: FeaturedProduct[] = (featuredRaw as any[]).map((g) => {
    const price = Number(g.price)
    const disc = Number(g.discount) || 0
    const original = g.originalPrice && g.originalPrice > price ? Number(g.originalPrice) : disc > 0 ? Math.round(price / (1 - disc / 100)) : null
    const r = ratings.get(String(g._id))
    return {
      _id: String(g._id),
      name: g.name,
      price,
      originalPrice: original,
      image: g.image,
      unit: g.unit,
      packLabel: g.variants?.[0]?.label?.toUpperCase(),
      variant: g.variants?.[0]?.label,
      variantImage: g.variants?.[0]?.image,
      stock: g.stock,
      rating: r ? Math.round(r.avg * 10) / 10 : null,
      reviewCount: r?.count ?? 0,
    }
  })

  // reviewers shown as profile photos in the hero (photo if they have one, else initial)
  const seen = new Set<string>()
  const reviewers: { name: string; image?: string }[] = []
  for (const r of recentReviews as any[]) {
    const u = r.userId
    if (!u?._id || seen.has(String(u._id))) continue
    seen.add(String(u._id))
    reviewers.push({ name: u.name || 'Customer', image: u.image || undefined })
    if (reviewers.length === 4) break
  }
  // reviewers with a real photo go first
  reviewers.sort((a, b) => Number(!!b.image) - Number(!!a.image))

  const rating = reviewStats[0]
    ? { avg: Math.round(reviewStats[0].avg * 10) / 10, count: reviewStats[0].count as number }
    : null

  // Serialize — converts ObjectId → string, removes Mongoose internals
  const groceries: IGrocery[] = raw.map((item: any) => ({
    _id:           item._id.toString(),
    name:          item.name,
    category:      item.category,
    price:         item.price,
    originalPrice: item.originalPrice ?? null,
    discount:      item.discount,
    stock:         item.stock,
    unit:          item.unit,
    image:         item.image,
    description:   item.description ?? "",
    tags:          item.tags ?? [],
    variants:      (item.variants ?? []).map((v: any) => ({ label: v.label, price: v.price, originalPrice: v.originalPrice ?? undefined, stock: v.stock ?? undefined, image: v.image ?? undefined })),
    rating:        ratings.get(String(item._id))?.avg,
    reviewCount:   ratings.get(String(item._id))?.count ?? 0,
  }))

  // Group by category
  const grouped = groceries.reduce<Record<string, IGrocery[]>>((acc, item) => {
    const key = (item.category || 'other').toLowerCase()
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div>
      <Herosection customerCount={customerCount} reviewers={reviewers} rating={rating} />
      <SpiceTicker />
      <PromoBanner />
      <FeaturedCarousel products={featured} />

      {/* One section per category — Blinkit style */}
      <div id="shop" className="scroll-mt-40">
        {Object.entries(grouped).map(([category, items], i) => (
          <CategorySection key={category} category={category} items={items} index={i} />
        ))}
      </div>

      <OriginsBanner />
      <BestSeller />
      <IngredientsStory />
      <Footer flush />
    </div>
  )
}

export default UserDashboard














// import React from 'react'
// import Herosection from './Herosection'
// import Category from "@/components/Category";
// import GroceryItemCard, { IGrocery } from "@/components/GroceryItemCard";
// import InfoProducts from "@/components/infoProducts";
// import BestSeller from "@/components/BestSeller";
// import Customer from "@/components/Customer";
// import NewsLetter from "@/components/NewsLetter";
// import Footer from "@/components/Footer";
// import connectDB from '@/lib/db';
// import Grocery from '@/models/grocery.models';

// const UserDashboard = async () => {
//   await connectDB()

//   const groceries = await Grocery.find();
//   const plainGrocery = JSON.parse(JSON.stringify(groceries)) as IGrocery[];

//   return (
//     <div>
//       <Herosection/>
//       <Category />

//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-[94%] mx-auto mt-16">
//       {plainGrocery.map((item) => (
//         <GroceryItemCard key={item._id} item={item} />
//       ))}
//       </div>
      
//       <InfoProducts />
//       <BestSeller />
//       <Customer />
//       <NewsLetter />
//       <Footer />
//     </div>
//   )
// }

// export default UserDashboard

