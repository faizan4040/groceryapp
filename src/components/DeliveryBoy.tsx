import { auth } from "@/auth";

import { redirect } from "next/navigation"
import DeliveryBoyDashboard from "@/components/delivery/DeliveryBoyDashboard"

export default async function DeliveryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

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