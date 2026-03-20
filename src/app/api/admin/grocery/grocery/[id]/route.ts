import { auth } from "@/auth"
import connectDB from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import Grocery from "@/models/grocery.models"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const session = await auth()
  if (session?.user?.role !== "admin")
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  const { id } = await params
  await Grocery.findByIdAndDelete(id)
  return NextResponse.json({ message: "Deleted" })
}