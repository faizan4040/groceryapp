"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  Ticket, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Filter,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react"
import { motion } from "motion/react"
import axios from "axios"

interface Coupon {
  _id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  expiryDate: string
  usageLimit: number
  usedCount: number
  minPurchase: number
}

export default function CouponsShow() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get("/api/admin/coupons")
      setCoupons(data.coupons || [])
    } catch (err) {
      console.error("Failed to fetch coupons")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return
    try {
      await axios.delete(`/api/admin/coupons/${id}`)
      setCoupons(prev => prev.filter(c => c._id !== id))
    } catch (err) {
      alert("Delete failed")
    }
  }

  const isExpired = (date: string) => new Date(date) < new Date()

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const thClass = "px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest"

  return (
    <div className="w-full space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-xl outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl border border-gray-100 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className={thClass}>Coupon Details</th>
                <th className={thClass}>Discount</th>
                <th className={thClass}>Usage Status</th>
                <th className={thClass}>Expiry</th>
                <th className={thClass}>Status</th>
                <th className={thClass + " text-right"}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8"><div className="h-10 bg-gray-100 rounded-xl w-full" /></td>
                  </tr>
                ))
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Ticket className="w-12 h-12 mb-2" />
                      <p className="text-sm font-medium">No coupons found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <motion.tr 
                    layout
                    key={coupon._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Code & Min Purchase */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg font-mono text-sm font-bold flex items-center gap-2">
                          {coupon.code}
                          <button 
                            onClick={() => handleCopy(coupon.code, coupon._id)}
                            className="hover:text-green-400 transition-colors"
                          >
                            {copiedId === coupon._id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Min Purchase</span>
                          <span className="text-xs font-semibold text-gray-700">₹{coupon.minPurchase || 0}</span>
                        </div>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-800">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                      </span>
                    </td>

                    {/* Usage Progress */}
                    <td className="px-6 py-5">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                          <span>{coupon.usedCount} used</span>
                          <span>{coupon.usageLimit} limit</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-medium">
                          {new Date(coupon.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5">
                      {isExpired(coupon.expiryDate) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 uppercase">
                          <AlertCircle className="w-3 h-3" /> Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold border border-green-100 uppercase">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[11px] text-gray-400 font-medium italic">
            * Expired coupons are automatically hidden from customer checkout.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-blue-500 font-bold cursor-pointer hover:underline">
            View Analytics <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  )
}