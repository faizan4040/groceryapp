import connectDB from "@/lib/db"
import { NextResponse } from "next/server"
import Grocery from "@/models/grocery.models"

export async function GET() {
  await connectDB()
  const groceries = await Grocery.find().sort({ createdAt: -1 })
  return NextResponse.json({ groceries })
}