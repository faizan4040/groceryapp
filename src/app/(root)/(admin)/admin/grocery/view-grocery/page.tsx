"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Loader2, CheckCircle2, AlertCircle, ShoppingBasket, SlidersHorizontal } from "lucide-react"
import axios from "axios"
import { motion, AnimatePresence } from "motion/react"

interface Grocery {
  _id: string
  name: string
  category: string
  unit: string
  price: number
  image: string
  createdAt: string
}

export default function ViewGrocery() {
  const [groceries, setGroceries] = useState<Grocery[]>([])
  const [filtered, setFiltered] = useState<Grocery[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const fetchGroceries = async () => {
    try {
      const { data } = await axios.get("/api/admin/grocery")
      setGroceries(data.groceries)
      setFiltered(data.groceries)
    } catch {
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchGroceries() }, [])

  useEffect(() => {
    let result = groceries
    if (categoryFilter !== "All") result = result.filter(g => g.category === categoryFilter)
    if (search) result = result.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [search, categoryFilter, groceries])

  const categories = ["All", ...Array.from(new Set(groceries.map(g => g.category)))]

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 2500)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await axios.delete(`/api/admin/grocery/grocery/${id}`)
      setGroceries(prev => prev.filter(g => g._id !== id))
      showToast("success", "Grocery item deleted")
    } catch {
      showToast("error", "Failed to delete")
    } finally {
      setDeletingId(null)
    }
  }

  const totalValue = groceries.reduce((sum, g) => sum + g.price, 0)

  return (
    <div className="w-full">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">All Groceries</h1>
          <p className="text-xs text-gray-400 mt-0.5">View and manage your grocery inventory</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
          <ShoppingBasket className="w-5 h-5 text-green-600" />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Total Items", value: groceries.length, color: "bg-green-100 text-green-600" },
          { label: "Categories", value: categories.length - 1, color: "bg-blue-100 text-blue-600" },
          { label: "Showing", value: filtered.length, color: "bg-amber-100 text-amber-600" },
          { label: "Total Value", value: `₹${totalValue.toLocaleString("en-IN")}`, color: "bg-purple-100 text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <p className="text-[11px] text-gray-400 font-medium mb-1">{s.label}</p>
            <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="flex flex-col md:flex-row gap-3 mb-5">

        {/* Search */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5 flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search grocery items..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
          {search && <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Table Head */}
        <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">#</div>
          <div className="col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Image</div>
          <div className="col-span-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</div>
          <div className="col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</div>
          <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Unit</div>
          <div className="col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</div>
          <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Del</div>
        </div>

        {/* Rows */}
        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingBasket className="w-9 h-9 mb-2 opacity-25" />
            <p className="text-sm font-medium">{search ? `No results for "${search}"` : "No grocery items yet"}</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: idx * 0.025 }}
                className="grid grid-cols-12 px-5 py-3 border-b border-gray-50 last:border-0
                  hover:bg-gray-50/60 transition-colors duration-150 group items-center"
              >
                {/* Index */}
                <div className="col-span-1">
                  <span className="text-xs font-bold text-gray-300">{String(idx + 1).padStart(2, "0")}</span>
                </div>

                {/* Image */}
                <div className="col-span-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBasket className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div className="col-span-3">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 border border-green-100 text-green-700 text-[11px] font-semibold truncate max-w-full">
                    {item.category}
                  </span>
                </div>

                {/* Unit */}
                <div className="col-span-1">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{item.unit}</span>
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <span className="text-sm font-bold text-gray-800">
                    ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Delete */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center
                      text-gray-300 hover:bg-red-50 hover:text-red-400
                      disabled:opacity-50 transition-all duration-150
                      opacity-0 group-hover:opacity-100"
                  >
                    {deletingId === item._id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
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
              <span className="text-gray-600 font-bold">{groceries.length}</span> items
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
              ${toast.type === "success" ? "bg-white border-green-200" : "bg-white border-red-200"}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center
              ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {toast.type === "success"
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
            <span className="text-sm font-semibold text-gray-800">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}