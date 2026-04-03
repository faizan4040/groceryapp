"use client"

import React, { useState } from "react"
import { 
  Ticket, 
  Plus, 
  Calendar, 
  Percent, 
  DollarSign, 
  Users, 
  X, 
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import axios from "axios"

export default function Coupons() {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage", // or "fixed"
    discountValue: "",
    expiryDate: "",
    usageLimit: "",
    minPurchase: ""
  })

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Replace with your actual API endpoint
      await axios.post("/api/admin/coupons", {
        ...formData,
        discountValue: Number(formData.discountValue),
        usageLimit: Number(formData.usageLimit),
        minPurchase: Number(formData.minPurchase)
      })
      
      showToast("Coupon created successfully!", "success")
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        expiryDate: "",
        usageLimit: "",
        minPurchase: ""
      })
    } catch (err) {
      showToast("Failed to create coupon", "error")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all bg-gray-50/50"
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1"

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
          <Ticket className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create New Coupon</h1>
          <p className="text-xs text-gray-400">Set up discounts and promotional offers</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
        
        {/* Coupon Code */}
        <div className="md:col-span-2">
          <label className={labelClass}>Coupon Code</label>
          <div className="relative">
            <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. SUMMER50"
              className={`${inputClass} font-mono uppercase text-base font-bold`}
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              required
            />
          </div>
        </div>

        {/* Discount Type */}
        <div>
          <label className={labelClass}>Discount Type</label>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            {['percentage', 'fixed'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({...formData, discountType: type})}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  formData.discountType === type 
                  ? "bg-white text-green-600 shadow-sm" 
                  : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount (₹)'}
              </button>
            ))}
          </div>
        </div>

        {/* Discount Value */}
        <div>
          <label className={labelClass}>Discount Value</label>
          <div className="relative">
            {formData.discountType === 'percentage' ? (
              <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            ) : (
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            )}
            <input
              type="number"
              placeholder="0"
              className={inputClass}
              value={formData.discountValue}
              onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <label className={labelClass}>Expiry Date</label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              className={inputClass}
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Usage Limit */}
        <div>
          <label className={labelClass}>Usage Limit</label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              placeholder="Total uses allowed"
              className={inputClass}
              value={formData.usageLimit}
              onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Coupon
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
            className={`fixed bottom-10 left-1/2 z-50 flex items-center gap-3 bg-white border px-6 py-4 rounded-2xl shadow-2xl min-w-[300px] ${
              toast.type === "success" ? "border-green-200" : "border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-bold text-gray-800">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}