import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    await connectDB();

    const { role, mobile } = await req.json();
    
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      { role, mobile },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    );

  } catch (error) {

    return NextResponse.json(
      { message: `edit role and mobile error ${error}` },
      { status: 500 }
    );

  }
}