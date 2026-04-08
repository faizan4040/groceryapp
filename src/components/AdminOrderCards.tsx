"use client";

import { IOrder } from "@/models/order.model";
import React, { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Home, Package, Phone, Truck, User } from "lucide-react";
import axios from "axios";

function AdminOrderCards({ order }: { order: IOrder }) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const statusOptions = ["pending", "out of delivery", "delivered"];

  // FIXED FUNCTION
  const updateStatus = async (orderId: string, status: string) => {
    try {
      setLoading(true);

      const result = await axios.post(`/api/admin/update-order-status/${orderId}`,
        { status }
      );

      setCurrentStatus(status as any);
      console.log(result.data);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={order._id?.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        
        {/* LEFT SECTION */}
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>

          <span
            className={`inline-block text-sm font-semibold px-3 py-1 rounded-full border ${
              order.isPaid
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          {/* FIXED DATE */}
          <p className="text-gray-500 text-sm">
            {new Date(order.createdAt!).toLocaleString()}
          </p>

          <div className="mt-3 space-y-3 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User size={16} className="text-green-600" />
              <span>{order?.address.fullName}</span>
            </p>

            <p className="flex items-center gap-2 font-semibold">
              <Phone size={16} className="text-green-600" />
              <span>{order?.address.mobile}</span>
            </p>

            <p className="flex items-center gap-2 font-semibold">
              <Home size={16} className="text-green-600" />
              <span>{order?.address.fullAddress}</span>
            </p>
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <CreditCard size={16} className="text-green-600" />
            <span>
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"}
            </span>
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              currentStatus === "delivered"
                ? "bg-green-100 text-green-700"
                : currentStatus === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {currentStatus}
          </span>

          {/* FIXED SELECT */}
          <select
            value={currentStatus}
            disabled={loading}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) =>
              updateStatus(order._id!.toString(), e.target.value)
            }
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t pt-3 mt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
        <div className="flex items-center gap-2 text-gray-800">
          <Truck size={16} className=" text-green-600"/>
          <span>
            Delivery:{" "}
            <span className="text-green-700">{order.status}</span>
          </span>
        </div>
        <div>
            Total: <span className="text-green-700 font-bold">₹{order.totalAmount}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminOrderCards;