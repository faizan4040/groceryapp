import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/lib/db"
import Grocery from "@/models/grocery.models"

/* ── GET: fetch all grocery items (for notifications/stock checks) ── */
export async function GET() {
  try {
    await connectDB();

    // Optional: Check if user is admin
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Fetch items from your Grocery model
    const groceries = await Grocery.find({}).sort({ updatedAt: -1 });

    // The sidebar expects 'items' or 'groceries' in the response
    return NextResponse.json({ 
      success: true, 
      items: groceries 
    }, { status: 200 });

  } catch (err: any) {
    console.error("[GET /api/admin/stock-orders]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ── PATCH: update stock and/or price ── */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const session = await auth()
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are not admin" }, { status: 403 })
    }

    const body = await req.json()
    const { stock, price } = body

    const update: Record<string, number> = {}
    if (stock !== undefined) update.stock = Number(stock)
    if (price !== undefined) update.price = Number(price)

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    const item = await Grocery.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    )

    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 })

    if (item.stock <= 5) {
      console.warn(`[LOW STOCK] ${item.name} has only ${item.stock} units left`)
    }

    return NextResponse.json({ success: true, item })
  } catch (err: any) {
    console.error("[PATCH /add-grocery/:id]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/* ── DELETE ── */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const session = await auth()
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ message: "You are not admin" }, { status: 403 })
    }

    const item = await Grocery.findByIdAndDelete(params.id)
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 })

    return NextResponse.json({ success: true, deleted: item._id })
  } catch (err: any) {
    console.error("[DELETE /add-grocery/:id]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}