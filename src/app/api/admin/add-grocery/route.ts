import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { uploadOnCloudinary } from "@/lib/cloudinary";
import Grocery from "@/models/grocery.models";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 🔐 Check admin
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not admin" },
        { status: 403 }
      );
    }

    // 📦 Get form data
    const formData = await req.formData();

    const name     = formData.get("name") as string;
    const category = formData.get("category") as string;
    const unit     = formData.get("unit") as string;
    const price    = formData.get("price") as string;
    const stock    = formData.get("stock") as string;
    const discount = formData.get("discount") as string | null; // ✅ NEW
    const image    = formData.get("image") as File;

    console.log("FORM DATA:", {
      name, category, unit, price, stock, discount, image
    });

    // ❗ Validation
    if (!name || !category || !unit || !price || !stock || !image) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Invalid image file" },
        { status: 400 }
      );
    }

    // ☁️ Upload image
    const imageUrl = await uploadOnCloudinary(image);
    if (!imageUrl) {
      throw new Error("Cloudinary upload failed");
    }

    // 💰 Price logic
    const basePrice = Number(price);
    const parsedStock = Number(stock);
    const parsedDiscount = discount ? Number(discount) : 0;

    // ❗ Validate numbers
    if (isNaN(basePrice) || isNaN(parsedStock)) {
      return NextResponse.json(
        { message: "Invalid price or stock" },
        { status: 400 }
      );
    }

    if (parsedDiscount < 0 || parsedDiscount > 100) {
      return NextResponse.json(
        { message: "Discount must be between 0 and 100" },
        { status: 400 }
      );
    }

    // ✅ Final price (after discount)
    const finalPrice =
      parsedDiscount > 0
        ? parseFloat((basePrice * (1 - parsedDiscount / 100)).toFixed(2))
        : basePrice;

    // ✅ Original price (for UI cut)
    const originalPrice =
      parsedDiscount > 0 ? basePrice : null;

    // 🧾 Create grocery
    const grocery = await Grocery.create({
      name,
      category,
      unit,
      price: finalPrice,        // 👈 user sees this
      originalPrice,            // 👈 cut price
      discount: parsedDiscount, // 👈 badge
      stock: parsedStock,
      image: imageUrl,
    });

    return NextResponse.json(
      {
        message: "Grocery added successfully",
        data: grocery,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Add grocery error:", error);

    return NextResponse.json(
      {
        message: error.message || "Server Error",
      },
      { status: 500 }
    );
  }
}






// import { auth } from "@/auth";
// import connectDB from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import { uploadOnCloudinary } from "@/lib/cloudinary";
// import Grocery from "@/models/grocery.models";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const session = await auth();

//     if (session?.user?.role !== "admin") {
//       return NextResponse.json(
//         { message: "You are not admin" },
//         { status: 403 }
//       );
//     }

//     const formData = await req.formData();

//     const name     = formData.get("name")     as string;
//     const category = formData.get("category") as string;
//     const unit     = formData.get("unit")     as string;
//     const price    = formData.get("price")    as string;
      
//     const image    = formData.get("image")    as File;  // File extends Blob ✓

//     if (!name || !category || !unit || !price || !image) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const imageUrl = await uploadOnCloudinary(image);

//     if (!imageUrl) {
//       return NextResponse.json(
//         { message: "Image upload failed" },
//         { status: 500 }
//       );
//     }

//     const grocery = await Grocery.create({
//       name,
//       category,
//       unit,
//       price: parseFloat(price),
//       image: imageUrl,
//     });

//     return NextResponse.json(
//       { message: "Grocery added successfully", data: grocery },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("Add grocery error:", error);
//     return NextResponse.json(
//       { message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }