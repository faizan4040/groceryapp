import { auth } from "@/auth"
import connectDB from "@/lib/db"           // ← ADD THIS
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB()                       // ← ADD THIS

    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User is not authenticated" },
        { status: 401 }
      )
    }

    const user = await User.findOne({ email: session.user.email })
      .select("-password")                  // ← FIX: was ".password", needs "-password"

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { message: `Get me error: ${error}` },
      { status: 500 }
    )
  }
}





// import { auth } from "@/auth"
// import User from "@/models/user.models";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req:NextRequest){
//     try{
//         const session = await auth()
//         if(!session || !session.user){
//             return NextResponse.json(
//                 {message:"user is not authenticated"},
//                 {status:400}
//             )
//         }

//         const user = await User.findOne({email:session.user.email}).select(".password")
//         if(!user){
//             return NextResponse.json(
//                 {message:"user not fount"},
//                 {status:400}
//             )
//         }
//         return NextResponse.json(
//             user,{status:200}
//         )

//     } catch (error){
//         return NextResponse.json(
//             {message:`get me error : ${error}`},
//             {status: 400}
//         )
//     }
// }