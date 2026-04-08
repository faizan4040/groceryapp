import connectDB from "@/lib/db";
import User from "@/models/user.models";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const admin = await User.findOne({ role: "admin" });

    return NextResponse.json(
      {
        success: true,
        adminExist: !!admin,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("CHECK ADMIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}