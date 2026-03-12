"use client";

import React from "react";
import mongoose from "mongoose";
import {
  ShoppingCart,
  User,
  Search,
  Menu
} from "lucide-react";

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile: string;
  role: "user" | "deliveryBoy" | "admin";
  image: string;
}

const Navbar = ({ user }: { user?: IUser }) => {
  return (
    <nav className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white shadow-md rounded-xl px-6 py-3 flex items-center justify-between">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl cursor-pointer">
          <div className="bg-green-100 p-2 rounded-md">
            <ShoppingCart className="text-green-600 w-5 h-5" />
          </div>
          <span>
            Fresh<span className="text-green-600">Cart</span>
          </span>
        </div>

        {/* Categories Button */}
        <button className="cursor-pointer hidden md:flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium transition">
          <Menu size={18} />
          Categories
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="flex-1 max-w-xl mx-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search for fresh fruits, vegetables, dairy..."
            className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-6">

        {/* Login / User */}
        <button className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600 transition">
          <User size={20} />
          <span className="hidden sm:block">
            {user ? user.name : "Login"}
          </span>
        </button>

        {/* Cart */}
        <button className="relative flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">

          <ShoppingCart size={18} />

          <span className="hidden sm:block cursor-pointer">Cart</span>

          {/* Cart Badge */}
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded-full">
            0
          </span>

        </button>
      </div>
    </nav>
  );
};

export default Navbar;