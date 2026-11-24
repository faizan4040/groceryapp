export const dynamic = "force-dynamic";

import { auth } from '@/auth'
import connectDB from '@/lib/db'
import User from '@/models/user.models'
import { redirect } from 'next/navigation'
import EditRolemobile from '@/components/EditRolemobile'
import Navbar from '@/components/Navbar'
import UserDashboard from '@/components/UserDashboard'
import AdminDashboard from '@/components/AdminDashboard'
import GeoUpdater from '@/components/GeoUpdater';
import DeliveryBoy from '@/components/DeliveryBoy';


const Home = async () => {

  await connectDB()

  const session = await auth()

  // Guest (not logged in) → show public homepage
  if (!session?.user?.email) {
    return (
      <div>
        <Navbar overlay />
        <UserDashboard />
      </div>
    )
  }

  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    redirect("/login")
  }

  const inComplete = !user.mobile || !user.role

  if (inComplete) {
    return <EditRolemobile />
  }

  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <div>
      <Navbar user={plainUser} overlay={user.role === "user"} />
       <GeoUpdater userId={plainUser._id}/>
      {user.role === "user" ? (
        <UserDashboard />
      ) : user.role === "admin" ? (
        <AdminDashboard children={undefined} />
      ) : user.role === "delivery" || user.role === "deliveryBoy" ? (
          <DeliveryBoy /> 
        ) : null}
    </div>
  )
}


export default Home


