import { auth } from "@/auth"
import connectDB from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import Category from "@/models/category.model"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB()

    const session = await auth()
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params  // ← await it

    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 })
    }

    const deleted = await Category.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 })
  }
}