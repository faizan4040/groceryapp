import React from "react";
import { auth } from "@/auth";
import EditRolemobile from "@/components/EditRolemobile";
import connectDB from "@/lib/db";
import User from "@/models/user.models";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Herosection from "@/components/Herosection";
import Category from "@/components/Category";
import FeatureProduct from "@/components/FeatureProduct";
import InfoProducts from "@/components/infoProducts";
import BestSeller from "@/components/BestSeller";
import Customer from "@/components/Customer";
import NewsLetter from "@/components/NewsLetter";
import Footer from "@/components/Footer";


const PageShell = ({ user }: { user?: any }) => (
  <div>
    <Navbar user={user} />
    <Herosection />
    <Category />
    <FeatureProduct />
    <InfoProducts />
    <BestSeller />
    <Customer />
    <NewsLetter />
    <Footer />
  </div>
);

const Home = async () => {
  const session = await auth();

  /* ── Not logged in → public landing page ── */
  if (!session?.user?.id) {
    return <PageShell />;
  }

  /* ── Logged in → fetch user from DB ── */
  await connectDB();
  const user = await User.findById(session.user.id).lean();

  /* ── User record missing → force re-login ── */
  if (!user) {
    redirect("/login");
  }

  /* ── Profile incomplete → collect mobile / role ── */
  const isIncomplete = !user.mobile || !user.role || user.role === "user" && !user.mobile;

  if (isIncomplete) {
    return <EditRolemobile />;
  }

  /* ── Fully authenticated user ── */
  return <PageShell user={user} />;
};

export default Home;







// import React from 'react'
// import { auth } from '@/auth'
// import EditRolemobile from '@/components/EditRolemobile'
// import connectDB from '@/lib/db'
// import User from '@/models/user.models'
// import { redirect } from 'next/navigation'

// const Home = async () => {
//   await connectDB()
//   const session=await auth()
//   const user=await User.findById(session?.user?.id)
//   if(!user){
//     redirect("/login")
//   }

//   const inComplete=!user.mobile || !user.role || (!user.mobile && user.role=="user")

//   if(inComplete){
//   return <EditRolemobile/>
//   }

//   return (
//     <div>
      
      
//     </div>
//   )
// }

// export default Home

