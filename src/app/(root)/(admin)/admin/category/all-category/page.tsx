"use client"

import { useEffect, useState } from "react"
import { Tag, Trash2, Search, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import axios from "axios"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"

interface Category {
  _id: string
  name: string
  createdAt: string
}

export default function AllCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filtered, setFiltered] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/admin/add-category")
      setCategories(data.categories)
      setFiltered(data.categories)
    } catch {
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(categories.filter(c => c.name.toLowerCase().includes(q)))
  }, [search, categories])

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 2500)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await axios.delete(`/api/admin/add-category/category/${id}`)
      setCategories(prev => prev.filter(c => c._id !== id))
      showToast("success", "Category deleted")
    } catch {
      showToast("error", "Failed to delete")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <div className="w-full">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Categories</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage categories used in grocery items</p>
        </div>
        <Link
          href="/admin/add-category"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-green-500 to-emerald-500
            text-white text-sm font-semibold shadow-[0_4px_14px_-4px_rgba(34,197,94,0.5)]
            hover:from-green-400 hover:to-emerald-400 transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </motion.div>

      {/* Stats + Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5"
      >
        {/* Stat card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Total</p>
            <p className="text-2xl font-extrabold text-gray-900 leading-tight">{categories.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="md:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Table head */}
        <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">#</div>
          <div className="col-span-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category Name</div>
          <div className="col-span-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Created On</div>
          <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</div>
        </div>

        {/* Rows */}
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Tag className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm font-medium">
              {search ? `No results for "${search}"` : "No categories yet"}
            </p>
            {!search && (
              <Link href="/admin/add-category" className="mt-3 text-xs text-green-500 font-semibold hover:underline">
                + Add your first category
              </Link>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((cat, idx) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-12 px-5 py-3.5 border-b border-gray-50 last:border-0
                  hover:bg-gray-50/70 transition-colors duration-150 group items-center"
              >
                {/* Index */}
                <div className="col-span-1">
                  <span className="text-xs font-bold text-gray-300">{String(idx + 1).padStart(2, "0")}</span>
                </div>

                {/* Name */}
                <div className="col-span-6 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Tag className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                </div>

                {/* Date */}
                <div className="col-span-4">
                  <span className="text-xs text-gray-400 font-medium">{formatDate(cat.createdAt)}</span>
                </div>

                {/* Delete */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDelete(cat._id)}
                    disabled={deletingId === cat._id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center
                      text-gray-300 hover:bg-red-50 hover:text-red-400
                      disabled:opacity-50 transition-all duration-150
                      opacity-0 group-hover:opacity-100"
                  >
                    {deletingId === cat._id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Footer */}
        {!fetching && filtered.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[11px] text-gray-400 font-medium">
              Showing <span className="text-gray-600 font-bold">{filtered.length}</span> of{" "}
              <span className="text-gray-600 font-bold">{categories.length}</span> categories
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-[11px] text-gray-400 font-medium">Live data</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border
              ${toast.type === "success"
                ? "bg-white border-green-200 text-gray-800"
                : "bg-white border-red-200 text-gray-800"
              }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center
              ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {toast.type === "success"
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : <AlertCircle className="w-4 h-4 text-red-500" />
              }
            </div>
            <span className="text-sm font-semibold">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}