"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Loader2, CheckCircle2, AlertCircle, ShoppingBasket, SlidersHorizontal, Pencil, X, Check, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"
import { motion, AnimatePresence } from "motion/react"

interface Grocery {
  _id: string
  name: string
  category: string
  unit: string
  price: number
  stock: number
  discount: number
  image: string
  createdAt: string
}

interface EditState {
  name: string
  category: string
  unit: string
  price: string
  stock: string
  discount: string
}

const ITEMS_PER_PAGE = 10

export default function ViewGrocery() {
  const [groceries, setGroceries] = useState<Grocery[]>([])
  const [filtered, setFiltered] = useState<Grocery[]>([])
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [fetching, setFetching] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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
    setCurrentPage(1) // reset to page 1 on filter/search change
  }, [search, categoryFilter, groceries])

  const categories = ["All", ...Array.from(new Set(groceries.map(g => g.category)))]

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Page number array with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 4) pages.push("...")
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 3) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

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

  const startEdit = (item: Grocery) => {
    setEditingId(item._id)
    setEditState({
      name: item.name,
      category: item.category,
      unit: item.unit,
      price: String(item.price),
      stock: String(item.stock ?? 0),
      discount: String(item.discount ?? 0),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditState(null)
  }

  const saveEdit = async (id: string) => {
    if (!editState) return
    setSavingId(id)
    try {
      const payload = {
        name: editState.name,
        category: editState.category,
        unit: editState.unit,
        price: parseFloat(editState.price) || 0,
        stock: parseInt(editState.stock) || 0,
        discount: parseFloat(editState.discount) || 0,
      }
      await axios.put(`/api/admin/grocery/grocery/${id}`, payload)
      setGroceries(prev => prev.map(g => g._id === id ? { ...g, ...payload } : g))
      showToast("success", "Item updated successfully")
      cancelEdit()
    } catch {
      showToast("error", "Failed to update item")
    } finally {
      setSavingId(null)
    }
  }

  const totalValue = groceries.reduce((sum, g) => sum + g.price, 0)
  const lowStock = groceries.filter(g => (g.stock ?? 0) <= 5).length

  const stockBadge = (stock: number) => {
    if (stock === 0) return "bg-red-50 border-red-100 text-red-600"
    if (stock <= 5) return "bg-amber-50 border-amber-100 text-amber-600"
    return "bg-green-50 border-green-100 text-green-600"
  }

  const EditableCell = ({
    value, field, type = "text", className = ""
  }: {
    value: string
    field: keyof EditState
    type?: string
    className?: string
  }) => (
    <input
      type={type}
      value={value}
      onChange={e => setEditState(prev => prev ? { ...prev, [field]: e.target.value } : null)}
      className={`w-full text-sm border border-blue-200 rounded-lg px-2 py-1 bg-blue-50/60
        focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 font-semibold ${className}`}
    />
  )

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
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
        {[
          { label: "Total Items", value: groceries.length, color: "bg-green-100 text-green-600" },
          { label: "Categories", value: categories.length - 1, color: "bg-blue-100 text-blue-600" },
          { label: "Showing", value: filtered.length, color: "bg-amber-100 text-amber-600" },
          { label: "Low Stock", value: lowStock, color: "bg-red-100 text-red-600" },
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
        <div className="grid px-5 py-3 bg-gray-50 border-b border-gray-100"
          style={{ gridTemplateColumns: "2.5rem 4rem 1fr 1fr 3.5rem 5rem 4.5rem 4rem 4.5rem" }}>
          {["#", "Image", "Name", "Category", "Unit", "Price", "Stock", "Disc%", ""].map((h, i) => (
            <div key={i} className={`text-[11px] font-bold text-gray-400 uppercase tracking-wider ${i === 8 ? "text-right" : ""}`}>{h}</div>
          ))}
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
          <AnimatePresence mode="wait">
            {paginated.map((item, idx) => {
              const isEditing = editingId === item._id
              const discountedPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : null
              const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: idx * 0.025 }}
                  className={`grid px-5 py-3 border-b border-gray-50 last:border-0
                    transition-colors duration-150 group items-center
                    ${isEditing ? "bg-blue-50/40" : "hover:bg-gray-50/60"}`}
                  style={{ gridTemplateColumns: "2.5rem 4rem 1fr 1fr 3.5rem 5rem 4.5rem 4rem 4.5rem" }}
                >
                  <div>
                    <span className="text-xs font-bold text-gray-300">{String(globalIdx).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBasket className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pr-2">
                    {isEditing && editState ? (
                      <EditableCell value={editState.name} field="name" />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    )}
                  </div>
                  <div className="pr-2">
                    {isEditing && editState ? (
                      <EditableCell value={editState.category} field="category" />
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 border border-green-100 text-green-700 text-[11px] font-semibold truncate max-w-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div>
                    {isEditing && editState ? (
                      <EditableCell value={editState.unit} field="unit" className="w-14" />
                    ) : (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{item.unit}</span>
                    )}
                  </div>
                  <div>
                    {isEditing && editState ? (
                      <EditableCell value={editState.price} field="price" type="number" className="w-20" />
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {discountedPrice ? (
                          <>
                            <span className="text-xs font-bold text-green-700">
                              ₹{discountedPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-800">
                            ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    {isEditing && editState ? (
                      <EditableCell value={editState.stock} field="stock" type="number" className="w-16" />
                    ) : (
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg border text-[11px] font-bold ${stockBadge(item.stock ?? 0)}`}>
                        {(item.stock ?? 0) === 0 ? "Out" : `${item.stock}`}
                      </span>
                    )}
                  </div>
                  <div>
                    {isEditing && editState ? (
                      <EditableCell value={editState.discount} field="discount" type="number" className="w-14" />
                    ) : (
                      item.discount > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 text-[11px] font-bold">
                          -{item.discount}%
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-300 font-semibold">—</span>
                      )
                    )}
                  </div>
                  <div className="flex justify-end items-center gap-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(item._id)}
                          disabled={savingId === item._id}
                          className="w-7 h-7 rounded-lg flex items-center justify-center
                            bg-green-100 text-green-600 hover:bg-green-200
                            disabled:opacity-50 transition-all duration-150"
                        >
                          {savingId === item._id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="w-7 h-7 rounded-lg flex items-center justify-center
                            bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all duration-150"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(item)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center
                            text-gray-300 hover:bg-blue-50 hover:text-blue-400
                            transition-all duration-150 opacity-0 group-hover:opacity-100"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
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
                      </>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}

        {/* Footer */}
        {!fetching && filtered.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Info */}
            <div className="flex items-center gap-3">
              <p className="text-[11px] text-gray-400 font-medium">
                Showing{" "}
                <span className="text-gray-600 font-bold">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                of <span className="text-gray-600 font-bold">{filtered.length}</span> items
              </p>
              {lowStock > 0 && (
                <span className="text-[11px] text-amber-500 font-semibold">{lowStock} low stock</span>
              )}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[11px] text-gray-400 font-medium">Live data</span>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                    text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm
                    disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 border border-transparent hover:border-gray-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                        transition-all duration-150
                        ${currentPage === page
                          ? "bg-green-500 text-white shadow-sm shadow-green-200"
                          : "text-gray-500 hover:bg-white hover:shadow-sm hover:text-gray-800 border border-transparent hover:border-gray-200"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-lg flex items-center justify-center
                    text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm
                    disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 border border-transparent hover:border-gray-200"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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











// "use client"

// import { useEffect, useState } from "react"
// import { Search, Trash2, Loader2, CheckCircle2, AlertCircle, ShoppingBasket, SlidersHorizontal } from "lucide-react"
// import axios from "axios"
// import { motion, AnimatePresence } from "motion/react"

// interface Grocery {
//   _id: string
//   name: string
//   category: string
//   unit: string
//   price: number
//   image: string
//   createdAt: string
// }

// export default function ViewGrocery() {
//   const [groceries, setGroceries] = useState<Grocery[]>([])
//   const [filtered, setFiltered] = useState<Grocery[]>([])
//   const [search, setSearch] = useState("")
//   const [categoryFilter, setCategoryFilter] = useState("All")
//   const [fetching, setFetching] = useState(true)
//   const [deletingId, setDeletingId] = useState<string | null>(null)
//   const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)

//   const fetchGroceries = async () => {
//     try {
//       const { data } = await axios.get("/api/admin/grocery")
//       setGroceries(data.groceries)
//       setFiltered(data.groceries)
//     } catch {
//     } finally {
//       setFetching(false)
//     }
//   }

//   useEffect(() => { fetchGroceries() }, [])

//   useEffect(() => {
//     let result = groceries
//     if (categoryFilter !== "All") result = result.filter(g => g.category === categoryFilter)
//     if (search) result = result.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
//     setFiltered(result)
//   }, [search, categoryFilter, groceries])

//   const categories = ["All", ...Array.from(new Set(groceries.map(g => g.category)))]

//   const showToast = (type: "success" | "error", msg: string) => {
//     setToast({ type, msg })
//     setTimeout(() => setToast(null), 2500)
//   }

//   const handleDelete = async (id: string) => {
//     setDeletingId(id)
//     try {
//       await axios.delete(`/api/admin/grocery/grocery/${id}`)
//       setGroceries(prev => prev.filter(g => g._id !== id))
//       showToast("success", "Grocery item deleted")
//     } catch {
//       showToast("error", "Failed to delete")
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   const totalValue = groceries.reduce((sum, g) => sum + g.price, 0)

//   return (
//     <div className="w-full">

//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">All Groceries</h1>
//           <p className="text-xs text-gray-400 mt-0.5">View and manage your grocery inventory</p>
//         </div>
//         <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
//           <ShoppingBasket className="w-5 h-5 text-green-600" />
//         </div>
//       </motion.div>

//       {/* Stat Cards */}
//       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
//         className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
//         {[
//           { label: "Total Items", value: groceries.length, color: "bg-green-100 text-green-600" },
//           { label: "Categories", value: categories.length - 1, color: "bg-blue-100 text-blue-600" },
//           { label: "Showing", value: filtered.length, color: "bg-amber-100 text-amber-600" },
//           { label: "Total Value", value: `₹${totalValue.toLocaleString("en-IN")}`, color: "bg-purple-100 text-purple-600" },
//         ].map((s, i) => (
//           <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
//             <p className="text-[11px] text-gray-400 font-medium mb-1">{s.label}</p>
//             <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
//           </div>
//         ))}
//       </motion.div>

//       {/* Search + Filter */}
//       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
//         className="flex flex-col md:flex-row gap-3 mb-5">

//         {/* Search */}
//         <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5 flex items-center gap-3">
//           <Search className="w-4 h-4 text-gray-400 shrink-0" />
//           <input
//             type="text"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search grocery items..."
//             className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
//           />
//           {search && <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>}
//         </div>

//         {/* Category filter */}
//         <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5">
//           <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
//           <select
//             value={categoryFilter}
//             onChange={e => setCategoryFilter(e.target.value)}
//             className="text-sm text-gray-700 outline-none bg-transparent cursor-pointer"
//           >
//             {categories.map(c => <option key={c} value={c}>{c}</option>)}
//           </select>
//         </div>
//       </motion.div>

//       {/* Table */}
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
//         className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

//         {/* Table Head */}
//         <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-100">
//           <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">#</div>
//           <div className="col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Image</div>
//           <div className="col-span-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</div>
//           <div className="col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</div>
//           <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Unit</div>
//           <div className="col-span-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</div>
//           <div className="col-span-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Del</div>
//         </div>

//         {/* Rows */}
//         {fetching ? (
//           <div className="flex items-center justify-center py-20">
//             <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
//             <ShoppingBasket className="w-9 h-9 mb-2 opacity-25" />
//             <p className="text-sm font-medium">{search ? `No results for "${search}"` : "No grocery items yet"}</p>
//           </div>
//         ) : (
//           <AnimatePresence>
//             {filtered.map((item, idx) => (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, y: 5 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, x: 16 }}
//                 transition={{ delay: idx * 0.025 }}
//                 className="grid grid-cols-12 px-5 py-3 border-b border-gray-50 last:border-0
//                   hover:bg-gray-50/60 transition-colors duration-150 group items-center"
//               >
//                 {/* Index */}
//                 <div className="col-span-1">
//                   <span className="text-xs font-bold text-gray-300">{String(idx + 1).padStart(2, "0")}</span>
//                 </div>

//                 {/* Image */}
//                 <div className="col-span-2">
//                   <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
//                     {item.image ? (
//                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <ShoppingBasket className="w-5 h-5 text-gray-300" />
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Name */}
//                 <div className="col-span-3">
//                   <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
//                 </div>

//                 {/* Category */}
//                 <div className="col-span-2">
//                   <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 border border-green-100 text-green-700 text-[11px] font-semibold truncate max-w-full">
//                     {item.category}
//                   </span>
//                 </div>

//                 {/* Unit */}
//                 <div className="col-span-1">
//                   <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{item.unit}</span>
//                 </div>

//                 {/* Price */}
//                 <div className="col-span-2">
//                   <span className="text-sm font-bold text-gray-800">
//                     ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//                   </span>
//                 </div>

//                 {/* Delete */}
//                 <div className="col-span-1 flex justify-end">
//                   <button
//                     onClick={() => handleDelete(item._id)}
//                     disabled={deletingId === item._id}
//                     className="w-7 h-7 rounded-lg flex items-center justify-center
//                       text-gray-300 hover:bg-red-50 hover:text-red-400
//                       disabled:opacity-50 transition-all duration-150
//                       opacity-0 group-hover:opacity-100"
//                   >
//                     {deletingId === item._id
//                       ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                       : <Trash2 className="w-3.5 h-3.5" />}
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         )}

//         {/* Footer */}
//         {!fetching && filtered.length > 0 && (
//           <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
//             <p className="text-[11px] text-gray-400 font-medium">
//               Showing <span className="text-gray-600 font-bold">{filtered.length}</span> of{" "}
//               <span className="text-gray-600 font-bold">{groceries.length}</span> items
//             </p>
//             <div className="flex items-center gap-1.5">
//               <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
//               <span className="text-[11px] text-gray-400 font-medium">Live data</span>
//             </div>
//           </div>
//         )}
//       </motion.div>

//       {/* Toast */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, x: "-50%" }}
//             animate={{ opacity: 1, y: 0, x: "-50%" }}
//             exit={{ opacity: 0, y: 10, x: "-50%" }}
//             className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border
//               ${toast.type === "success" ? "bg-white border-green-200" : "bg-white border-red-200"}`}
//           >
//             <div className={`w-7 h-7 rounded-full flex items-center justify-center
//               ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
//               {toast.type === "success"
//                 ? <CheckCircle2 className="w-4 h-4 text-green-600" />
//                 : <AlertCircle className="w-4 h-4 text-red-500" />}
//             </div>
//             <span className="text-sm font-semibold text-gray-800">{toast.msg}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }