import { auth } from "@/auth"
import connectDB from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import Category from "@/models/category.model"

// GET — fetch all categories
export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find().sort({ createdAt: -1 }).select("name _id")
    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
}

// POST — add new category
export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await auth()
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { name } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 })
    }

    const exists = await Category.findOne({ name: name.trim() })
    if (exists) {
      return NextResponse.json({ message: "Category already exists" }, { status: 409 })
    }

    const category = await Category.create({ name: name.trim() })
    return NextResponse.json({ message: "Category added", category }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
}