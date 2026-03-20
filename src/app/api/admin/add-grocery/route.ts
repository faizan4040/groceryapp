import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import Grocery from "@/models/grocery.models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not admin" },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const name     = formData.get("name")     as string;
    const category = formData.get("category") as string;
    const unit     = formData.get("unit")     as string;
    const price    = formData.get("price")    as string;
    const image    = formData.get("image")    as File;  // File extends Blob ✓

    if (!name || !category || !unit || !price || !image) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadOnCloudinary(image);

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 500 }
      );
    }

    const grocery = await Grocery.create({
      name,
      category,
      unit,
      price: parseFloat(price),
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Grocery added successfully", data: grocery },
      { status: 201 }
    );

  } catch (error) {
    console.error("Add grocery error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}