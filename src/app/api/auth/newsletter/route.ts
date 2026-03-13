import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Newsletter from "@/models/newletter.models";


export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    await connectDB();

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "This email is already subscribed." }, { status: 409 });
    }

    await Newsletter.create({ email });

    return NextResponse.json({ message: "Subscribed successfully." }, { status: 201 });

  } catch (err) {
    console.error("[NEWSLETTER]", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}