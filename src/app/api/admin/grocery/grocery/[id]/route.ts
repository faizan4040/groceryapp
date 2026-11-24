import { auth } from "@/auth"
import connectDB from "@/lib/db"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import Grocery from "@/models/grocery.models"

type Ctx = { params: Promise<{ id: string }> }

async function requireAdmin() {
  await connectDB()
  const session = await auth()
  return session?.user?.role === "admin"
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  const { id } = await params
  await Grocery.findByIdAndDelete(id)
  return NextResponse.json({ message: "Deleted" })
}

/** Inline edit from admin → View Grocery (name, category, unit, price, stock, discount). */
export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const update: Record<string, unknown> = {}
  for (const k of ["name", "category", "unit"] as const) {
    if (typeof body[k] === "string" && body[k].trim()) update[k] = body[k].trim()
  }
  for (const k of ["price", "stock", "discount"] as const) {
    if (body[k] !== undefined && body[k] !== "" && !Number.isNaN(Number(body[k]))) update[k] = Number(body[k])
  }

  try {
    const doc = await Grocery.findByIdAndUpdate(id, update, { new: true, runValidators: true })
    if (!doc) return NextResponse.json({ message: "Product not found" }, { status: 404 })
    return NextResponse.json({ message: "Updated", grocery: doc })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Update failed" }, { status: 400 })
  }
}

/** Toggle "Featured" (home-page carousel). Body: { featured: boolean } */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin()))
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
  const { id } = await params
  if (!mongoose.Types.ObjectId.isValid(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  if (typeof body.featured !== "boolean")
    return NextResponse.json({ message: "featured must be true or false" }, { status: 400 })

  const doc = await Grocery.findByIdAndUpdate(
    id,
    body.featured ? { featured: true, featuredAt: new Date() } : { featured: false, $unset: { featuredAt: 1 } },
    { new: true },
  )
  if (!doc) return NextResponse.json({ message: "Product not found" }, { status: 404 })
  return NextResponse.json({ message: body.featured ? "Added to featured" : "Removed from featured", featured: doc.featured })
}
