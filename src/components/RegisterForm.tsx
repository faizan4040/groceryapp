"use client";

import axios from "axios";
import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Leaf,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "../../routes/AllImages";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react"

type PropType = {
  previousStep: (s: number) => void;
};

const RegisterForm = ({ previousStep }: PropType) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name || !email || !password || !mobile) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const { data } = await axios.post("/api/auth/register", {
      name,
      email,
      mobile,
      password,
    });

    // Check if registration was successful
    if (data.success) {
      toast.success(data.message); // "User registered successfully"

      // Clear form
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");

      setTimeout(() => {
        window.location.href = "/login"; 
      }, 500); 
    } else {
      toast.error(data.message || "Registration failed");
    }

  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 py-10 bg-linear-to-br from-green-50 via-white to-green-100 relative">

      {/* Back Button */}
      <div
        onClick={() => previousStep(1)}
        className="absolute top-5 left-4 sm:left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition cursor-pointer"
      >
        <ArrowLeft size={20} />
        <span className="text-sm sm:text-base">Back</span>
      </div>

      <div className="w-full max-w-md">

        {/* Title */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-700 text-center mb-2"
          >
          Create Account
          </motion.h1>

        <p className="text-gray-600 text-center mb-8 flex items-center justify-center gap-1 text-sm sm:text-base">
          Join FreshCart today
          <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
        </p>

        {/* Form */}
        <motion.form
          onSubmit={handleRegister}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 sm:gap-5 w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
        >

          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm sm:text-base text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm sm:text-base text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Mobile */}
         <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-5 text-gray-400" />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm sm:text-base text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm sm:text-base text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="bg-green-600 text-white py-3 rounded-xl text-sm sm:text-base font-semibold shadow-md hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>

          {/* OR Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs sm:text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={()=>signIn("google",{callbackUrl:"/"})}
            className="flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <Image
              src={IMAGES.Google}
              alt="google"
              width={40}
              height={40}
            />
            Continue with Google
          </motion.button>

          {/* Login Link */}
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-1">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

        </motion.form>
      </div>
    </div>
  );
};

export default RegisterForm;