import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

import mongoose from "mongoose"
import Grocery from "@/models/grocery.models"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await context.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    const product = await Grocery.findById(id)

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}