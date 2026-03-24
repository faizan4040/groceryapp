import React from 'react'
import Herosection from './Herosection'
import Category from "@/components/Category";
import InfoProducts from "@/components/infoProducts";
import BestSeller from "@/components/BestSeller";
import Customer from "@/components/Customer";
import NewsLetter from "@/components/NewsLetter";
import Footer from "@/components/Footer";
import connectDB from '@/lib/db';
import Grocery from '@/models/grocery.models';
import CategorySection from './Categorysection';
import { IGrocery } from '@/types/grocery';

const UserDashboard = async () => {
  await connectDB()

  const raw = await Grocery.find().lean()

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
  }))

  // Group by category
  const grouped = groceries.reduce<Record<string, IGrocery[]>>((acc, item) => {
    const key = item.category.toLowerCase()
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div>
      <Herosection />
      <Category />

      {/* One section per category — Blinkit style */}
      {Object.entries(grouped).map(([category, items]) => (
        <CategorySection key={category} category={category} items={items} />
      ))}

      <InfoProducts />
      <BestSeller />
      <Customer />
      <NewsLetter />
      <Footer />
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

