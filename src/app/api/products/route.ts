import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Grocery from "@/models/grocery.models"


export async function GET() {
  try {
    await connectDB()
    const products = await Grocery.find().sort({ createdAt: -1 })
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error("GET ALL ERROR:", error)
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 })
  }
}