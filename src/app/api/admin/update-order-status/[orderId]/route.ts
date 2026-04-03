import connectDB from "@/lib/db"
import Order from "@/models/order.model"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req:NextRequest,{parmas}:{parmas:{orderId:string}}) {
  try{
    await connectDB()
    const {orderId}=await parmas
    const {status}=await req.json()
    const order=await Order.findById(orderId)
    if(!order){
        return NextResponse.json(
            {message:"order not found"},
            {status:400}
        )
    }
    order.status=status
    let availableDeliveryBoys:any=[]
    if(status==="out of delivery" && !order.assigment){
        
    }

  } catch(error){

  }
}