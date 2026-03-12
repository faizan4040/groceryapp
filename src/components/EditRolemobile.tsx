"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { User, Shield, Truck, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const roles = [
  { id: "user", label: "Customer", icon: User, color: "bg-green-500" },
  { id: "admin", label: "Admin", icon: Shield, color: "bg-purple-500" },
  { id: "deliveryBoy", label: "Delivery Boy", icon: Truck, color: "bg-orange-500" },
];

const EditRolemobile = () => {

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {

    if (!selectedRole) {
      toast.error("Select your role");
      return;
    }

    if (!mobile || mobile.length !== 10) {
      toast.error("Enter valid mobile number");
      return;
    }

    try {

      const res = await axios.post("/api/user/update-role-mobile", {
        role: selectedRole,
        mobile,
      });

      if (res.data) {
        toast.success("Profile updated 🎉");
        router.push("/");
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 via-white to-yellow-100 p-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10"
      >

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700">
            Complete Your Profile
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Choose your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {roles.map((r) => {

            const Icon = r.icon;

            return (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRole(r.id)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all
                ${
                  selectedRole === r.id
                    ? "border-green-500 bg-green-50 shadow-xl"
                    : "border-gray-200 bg-white hover:shadow-lg"
                }`}
              >

                {/* Icon */}
                <div
                  className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full text-white mb-4 ${r.color}`}
                >
                  <Icon size={26} />
                </div>

                <h3 className="text-lg font-semibold text-center text-gray-800">
                  {r.label}
                </h3>

                <p className="text-sm text-gray-500 text-center mt-2">
                  {r.id === "admin" && "Manage store & orders"}
                  {r.id === "user" && "Shop groceries & essentials"}
                  {r.id === "deliveryBoy" && "Deliver customer orders"}
                </p>

              </motion.div>
            );
          })}

        </div>

        {/* Mobile Input */}
        <div className="relative mb-8">
          <Phone className="absolute left-4 top-4 text-gray-400" />

          <input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Continue Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-full cursor-pointer bg-linear-to-r from-green-500 to-green-600 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition"
        >
          Go to Home
        </motion.button>

      </motion.div>

    </div>
  );
};

export default EditRolemobile;