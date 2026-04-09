import { auth } from "@/auth";
// app/delivery/page.tsx
// Protected page — only accessible to users with role: "delivery"

import { redirect } from "next/navigation"
import DeliveryBoyDashboard from "@/components/delivery/DeliveryBoyDashboard"

export default async function DeliveryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Uncomment if you store role in session:
  // if (session.user.role !== "delivery") {
  //   redirect("/")
  // }

  return <DeliveryBoyDashboard />
}







// import React from 'react'
// import DeliveryBoyDashboard from './delivery/DeliveryBoyDashboard'


// function DeliveryBoy () {
//   return (
//     <div className='mt-24'>
//        <DeliveryBoyDashboard/>
//     </div>
//   )
// }

// export default DeliveryBoy