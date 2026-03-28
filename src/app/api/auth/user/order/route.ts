import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("🟡 ORDER PAYLOAD:", body);

    const { userId, items, paymentMethod, totalAmount, address } = body;

    /* ───────────────────────── VALIDATION ───────────────────────── */

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Items must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!["cod", "online"].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: "Invalid paymentMethod (cod | online)" },
        { status: 400 }
      );
    }

    if (!totalAmount || isNaN(Number(totalAmount))) {
      return NextResponse.json(
        { success: false, message: "Invalid totalAmount" },
        { status: 400 }
      );
    }

    if (!address?.fullName || !address?.mobile || !address?.fullAddress) {
      return NextResponse.json(
        { success: false, message: "Incomplete address details" },
        { status: 400 }
      );
    }

    /* ───────────────────────── USER CHECK ───────────────────────── */

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /* ───────────────────────── VALIDATE ITEMS ───────────────────────── */

    const validatedItems = items.map((item: any, i: number) => {
      if (!item.grocery || !mongoose.Types.ObjectId.isValid(item.grocery)) {
        throw new Error(`Invalid grocery id at index ${i}`);
      }

      return {
        grocery: new mongoose.Types.ObjectId(item.grocery),
        name: item.name || "Item",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        unit: item.unit || "unit",
        image: item.image || "",
      };
    });

    const parsedTotal = Number(totalAmount);

    /* ───────────────────────── COD FLOW ───────────────────────── */

    if (paymentMethod === "cod") {
      const order = await Order.create({
        user: userId,
        items: validatedItems,
        paymentMethod: "cod",
        totalAmount: parsedTotal,
        address,
        isPaid: false,
      });

      console.log("✅ COD ORDER CREATED:", order._id);

      return NextResponse.json({
        success: true,
        message: "Order placed successfully (COD)",
        orderId: order._id,
      });
    }

    /* ───────────────────────── RAZORPAY FLOW ───────────────────────── */

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, message: "Razorpay not configured" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(parsedTotal * 100), // ₹ → paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    const order = await Order.create({
      user: userId,
      items: validatedItems,
      paymentMethod: "online",
      totalAmount: parsedTotal,
      address,
      razorpayOrderId: razorpayOrder.id,
      isPaid: false,
    });

    console.log("✅ ONLINE ORDER CREATED:", order._id);

    return NextResponse.json({
      success: true,
      message: "Razorpay order created",
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    console.error("🔴 ORDER ERROR:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}




// import connectDB from "@/lib/db";
// import Order from "@/models/order.model";
// import User from "@/models/user.models";
// import { NextRequest, NextResponse } from "next/server";

// // Must be named POST (uppercase) for Next.js App Router
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { userId, items, paymentMethod, totalAmount, address } = await req.json();

//     // Validate required fields
//     if (!items || !userId || !paymentMethod || !totalAmount || !address) {
//       return NextResponse.json(
//         { message: "Please send all required fields: userId, items, paymentMethod, totalAmount, address" },
//         { status: 400 }
//       );
//     }

//     // Validate user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json(
//         { message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Validate address required fields
//     if (!address.fullName || !address.mobile || !address.fullAddress) {
//       return NextResponse.json(
//         { message: "Address must include fullName, mobile, and fullAddress" },
//         { status: 400 }
//       );
//     }

//     // Validate paymentMethod matches model enum
//     if (!["cod", "online"].includes(paymentMethod)) {
//       return NextResponse.json(
//         { message: "paymentMethod must be 'cod' or 'online'" },
//         { status: 400 }
//       );
//     }

//     // Create the order
//     const newOrder = await Order.create({
//       user: userId,
//       items,
//       paymentMethod,
//       totalAmount,
//       address,
//     });

//     return NextResponse.json(
//       { message: "Order placed successfully", order: newOrder },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     console.error("Place order error:", error);
//     return NextResponse.json(
//       { message: `Place order error: ${error?.message || error}` },
//       { status: 500 }
//     );
//   }
// }







// import connectDB from "@/lib/db";
// import Order from "@/models/order.model";
// import User from "@/models/user.models";
// import { connect } from "http2";
// import { NextRequest, NextResponse } from "next/server";


// export async function post(req:NextRequest){
//     try{
//         await connectDB()
//         const {userId, items, paymentMethod, totalAmount,address} = await req.json()
//            if(!items || !userId || !paymentMethod || !totalAmount || !address){
//               return NextResponse.json(
//                 {message:"please send all credentials"},
//                 {status:400}
//             )
//         }
//         const user = await User.findById(userId)
//         if(!user){
//             return NextResponse.json(
//                 {message:"user not found"},
//                 {status:400}
//             )
//         }

//         const newOrder = await Order.create({
//              user: userId,
//              items,
//              paymentMethod,
//              totalAmount,
//              address
//         })
//         return NextResponse.json(
//             newOrder,
//             { status: 201 }
//         )

//     } catch(error){
//      return NextResponse.json(
//          {message:`place order error ${error}`},
//          {status:500}
//      )   

//     }
// }