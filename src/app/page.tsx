import { auth } from '@/auth'
import React from 'react'
import connectDB from '@/lib/db'
import User from '@/models/user.models'
import { redirect } from 'next/navigation'
import EditRolemobile from '@/components/EditRolemobile'
import Navbar from '@/components/Navbar'
import UserDashboard from '@/components/UserDashboard'
import DevliveryBoy from '@/components/DevliveryBoy'
import AdminDashboard from '@/components/AdminDashboard'


const Home = async () => {

  await connectDB()
  const session=await auth()
  const user=await User.findById(session?.user?.id)
  if(!user){
    redirect("/login")
  }

  const inComplete=!user.mobile || !user.role || (!user.mobile && user.role=="user")
  if(inComplete){
  return <EditRolemobile/>
  }

  const plainUser=JSON.parse(JSON.stringify(user))


  return (
    <div>
    <Navbar user={plainUser}/>
    {user.role == "user" ? (
      <UserDashboard/>
    ) : user.role == "admin" ? (
      <AdminDashboard/>
    ) :<DevliveryBoy/> }
    </div>
  )
}

export default Home

