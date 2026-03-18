"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { User, Shield, Truck, Phone, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const roles = [
  { id: "user", label: "Customer", icon: User, color: "bg-green-500" },
  { id: "admin", label: "Admin", icon: Shield, color: "bg-purple-500" },
  { id: "deliveryBoy", label: "Delivery Boy", icon: Truck, color: "bg-orange-500" },
];

const dashboards: Record<string, string> = {
  admin: "/admin",
  deliveryBoy: "/delivery",
  user: "/",
};

const EditRolemobile = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { update } = useSession();


  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    if (!mobile || mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });

      if (res.data.success) {
        await update({
          role: selectedRole,
          mobile,
        });

        toast.success("Profile updated successfully");

        router.replace(dashboards[selectedRole] || "/");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
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
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Choose your role and add mobile number
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {roles.map((r) => {
            const Icon = r.icon;

            return (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedRole(r.id)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all ${
                  selectedRole === r.id
                    ? "border-green-500 bg-green-50 shadow-xl"
                    : "border-gray-200 bg-white hover:shadow-lg"
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full text-white mb-4 ${r.color}`}
                >
                  <Icon size={26} />
                </div>

                <h3 className="text-lg font-semibold text-center text-gray-800">
                  {r.label}
                </h3>

                <p className="text-sm text-gray-500 text-center mt-2">
                  {r.id === "admin" && "Manage store and orders"}
                  {r.id === "user" && "Shop groceries and essentials"}
                  {r.id === "deliveryBoy" && "Deliver customer orders"}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="relative mb-8">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder="Enter mobile number"
            value={mobile}
            maxLength={10}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            className="w-full border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-linear-to-r from-green-500 to-green-600 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Continue"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EditRolemobile;