"use client"

import { useState, useEffect } from "react"
import { Tag, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react"
import axios from "axios"
import { motion, AnimatePresence } from "motion/react"

interface Category {
  _id: string
  name: string
}

export default function AddCategoryPage() {
  const [name, setName] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/admin/add-category")
      setCategories(data.categories)
    } catch {
      // silent
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const handleAdd = async () => {
    if (!name.trim()) return setError("Category name is required")
    setError("")
    setLoading(true)
    try {
      const { data } = await axios.post("/api/admin/add-category", { name })
      setCategories(prev => [data.category, ...prev])
      setName("")
      setSuccess("Category added!")
      setTimeout(() => setSuccess(""), 2500)
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/add-category/category/${id}`)
      setCategories(prev => prev.filter(c => c._id !== id))
    } catch {
      // silent
    }
  }

  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manage Categories</h1>
          <p className="text-xs text-gray-400 mt-0.5">Add categories shown in the Add Grocery form</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
          <Tag className="w-5 h-5 text-green-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Add Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit"
        >
          <h2 className="text-sm font-bold text-gray-700 mb-4">Add New Category</h2>

          <label className="text-[13px] font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-green-500" /> Category Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError("") }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. Frozen Foods"
            className={`w-full bg-gray-50 border ${error ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400
              outline-none focus:border-green-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] transition-all duration-200 mb-2`}
          />
          {error && <p className="text-red-400 text-[11px] mb-2">{error}</p>}

          <motion.button
            onClick={handleAdd}
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-white
              bg-linear-to-r from-green-500 to-emerald-500
              hover:from-green-400 hover:to-emerald-400
              shadow-[0_4px_20px_-4px_rgba(34,197,94,0.4)]
              disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? "Adding..." : "Add Category"}
          </motion.button>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 mt-3 text-green-600 text-xs font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> {success}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category List */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <h2 className="text-sm font-bold text-gray-700 mb-4">
            All Categories
            <span className="ml-2 text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          </h2>

          {fetching ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No categories yet</div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <AnimatePresence>
                {categories.map((cat) => (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300
                        hover:bg-red-50 hover:text-red-400 transition-all duration-150 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}