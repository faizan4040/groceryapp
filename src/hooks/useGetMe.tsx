'use client'

import { AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

function useGetMe() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await axios.get("/api/me")
        console.log("🟢 /api/me response:", result.data) // ← remove after testing
        dispatch(setUserData(result.data))               // result.data IS the user object
      } catch (error: any) {
        console.error("❌ useGetMe failed:", error?.response?.data || error)
        dispatch(setUserData(null))
      }
    }
    getMe()
  }, [])
}

export default useGetMe





// 'use client'

// import { AppDispatch } from '@/redux/store'
// import { setUserData } from '@/redux/userSlice'
// import axios from 'axios'
// import React, { useEffect } from 'react'
// import { useDispatch } from 'react-redux'

// function useGetMe() {
//     const dispatch=useDispatch<AppDispatch>()
//     useEffect(()=>{
//         const getMe=async ()=>{
//             try{
//                 const result=await axios.get("/api/me")
//                 dispatch(setUserData(result.data))
//             } catch (error){
//                 console.log(error)
//             }
//         }      
//         getMe()
//     },[])
// }

// export default useGetMe