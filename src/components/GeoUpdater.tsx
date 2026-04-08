'use client'

import { useEffect, useRef } from "react"
import { getSocket } from "@/lib/socket"

function GeoUpdater({ userId }: { userId: string }) {

  const socketRef = useRef(getSocket())
  const identitySent = useRef(false)

  useEffect(() => {
    if (!userId) return
    if (!navigator.geolocation) return

    const socket = socketRef.current

    // send identity only once
    if (!identitySent.current) {
      socket.emit("identity", userId)
      identitySent.current = true
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("update-location", {
          userId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    )

    return () => {
      navigator.geolocation.clearWatch(watcher)
    }

  }, [userId])

  return null
}

export default GeoUpdater












// 'use client'
// import { useEffect } from "react"
// import { getSocket } from "@/lib/socket"


// function GeoUpdater({userId}:{userId:string}){
//    let socket=getSocket()
//    socket.emit("identity",userId)
//    useEffect(()=>{
//     if(!userId)return
//     if(!navigator.geolocation)return
//     const watcher = navigator.geolocation.watchPosition((pos)=>{
//         const lat=pos.coords.latitude
//         const lon=pos.coords.longitude
//         socket.emit("update-location",{
//             userId,
//             latitude:lat,
//             longitude:lon,
//         })
//     },(err)=>{
//         console.log(err)
//     },{enableHighAccuracy:true})
//     return()=>navigator.geolocation.clearWatch(watcher)

//    },[userId])
//    return null
// }


// export default GeoUpdater