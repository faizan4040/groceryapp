import React from 'react'
import Herosection from './Herosection'
import Category from "@/components/Category";
import FeatureProduct from "@/components/FeatureProduct";
import InfoProducts from "@/components/infoProducts";
import BestSeller from "@/components/BestSeller";
import Customer from "@/components/Customer";
import NewsLetter from "@/components/NewsLetter";
import Footer from "@/components/Footer";

const UserDashboard = () => {
  return (
    <div>
      <Herosection/>
      <Category />
      <FeatureProduct />
      <InfoProducts />
      <BestSeller />
      <Customer />
      <NewsLetter />
      <Footer />
    </div>
  )
}

export default UserDashboard