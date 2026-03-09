import connectDB from "@/lib/db";
import User from "@/models/user.models";
import bcrypt from "bcryptjs";
import { connect } from "http2";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try{
        await connectDB()
        const {name,email,password}=await request.json()
        const existingUser=await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {message:"User already exists"}, 
                {status:400}
            )
    }
    if(password.length<6){
        return NextResponse.json(
            {message:"Password must be at least 6 characters long"}, 
            {status:400}
        )
    }

    const hashedPassword=await bcrypt.hash(password,10)
    const user=await User.create({
        name, email, password:hashedPassword
    })

    } catch (error) {
        return NextResponse.json({message:"Internal Server Error"}, {status:500})
    }
}