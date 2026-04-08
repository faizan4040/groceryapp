'use client'

import { IDeliveryAssignment } from '@/models/deliveryAssignment.model'
import axios from 'axios'
import { useEffect, useState } from 'react'

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignment] = useState<any[]>([])

  useEffect(()=>{
  const fetchAssignment = async ()=>{
    try{
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignment(result.data)
    } catch(error){
      console.log(error)
    }
  }
  fetchAssignment()
  },[])

  return (
    <div className='w-full min-h-screen bg-gray-50 p-4 '>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold mb-7.5'>Delivery Assignments</h2>

        {assignments.map(a=>(
          <div key={a._id} className=''>
             <p><b>Order Id </b>{a?.order._id.slice(-6)}</p>
             <p className='text-gray-600'>{a.order.fullAddress}</p>

             <div className='flex gap-3 mt-4'>
              <button className=''>Accept</button>
              <button className=''>Reject</button>
            
             </div>
          </div>
          
        ))}
      </div>

    </div>
  )
}

export default DeliveryBoyDashboard