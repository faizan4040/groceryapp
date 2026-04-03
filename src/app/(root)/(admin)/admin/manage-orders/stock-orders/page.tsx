"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import {
  Package, Pencil, Trash2, Search, ChevronDown, X,
  CheckCircle2, AlertTriangle, TrendingDown, RefreshCw,
  Filter, ArrowUpDown, Save, ArchiveIcon, ShoppingCart,
  Bell
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import axios from "axios"

/* ─── Types ──────────────────────────────────────────────── */
interface GroceryItem {
  _id: string
  name: string
  category: string
  unit: string
  price: number
  discount?: number
  stock: number
  image?: string
}

interface LowStockNotif {
  id: string
  itemName: string
  stock: number
  time: string
}

/* ─── helpers ────────────────────────────────────────────── */
const badge = (stock: number) => {
  if (stock === 0)  return { label: "Out of Stock", cls: "bg-red-100 text-red-600 border-red-200" }
  if (stock <= 5)   return { label: "Low Stock",    cls: "bg-amber-100 text-amber-600 border-amber-200" }
  return               { label: "In Stock",      cls: "bg-green-100 text-green-700 border-green-200" }
}

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

/* ─── Component ──────────────────────────────────────────── */
export default function StockOrders() {
  const [items,        setItems]        = useState<GroceryItem[]>([])
  const [filtered,     setFiltered]     = useState<GroceryItem[]>([])
  const [search,       setSearch]       = useState("")
  const [sortKey,      setSortKey]      = useState<"name"|"stock"|"price">("name")
  const [sortDir,      setSortDir]      = useState<"asc"|"desc">("asc")
  const [loading,      setLoading]      = useState(true)
  const [editId,       setEditId]       = useState<string|null>(null)
  const [editStock,    setEditStock]    = useState("")
  const [editPrice,    setEditPrice]    = useState("")
  const [deleteId,     setDeleteId]     = useState<string|null>(null)
  const [savingId,     setSavingId]     = useState<string|null>(null)
  const [toast,        setToast]        = useState<{ msg: string; type: "success"|"error" }|null>(null)
  const [lowNotifs,    setLowNotifs]    = useState<LowStockNotif[]>([])
  const [notifSeen,    setNotifSeen]    = useState<Set<string>>(new Set())
  const prevItemsRef   = useRef<GroceryItem[]>([])

  /* ── fetch ── */
  const fetchItems = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/admin/stock-orders")
      const list: GroceryItem[] = data.items ?? data.groceries ?? []
      setItems(list)

      /* detect newly-low-stock items */
      const prev = prevItemsRef.current
      list.forEach(item => {
        if (item.stock <= 5 && item.stock > 0) {
          const prevItem = prev.find(p => p._id === item._id)
          if (!prevItem || prevItem.stock > 5) {
            setLowNotifs(n => [
              { id: item._id, itemName: item.name, stock: item.stock, time: new Date().toISOString() },
              ...n.filter(x => x.id !== item._id),
            ])
          }
        }
        if (item.stock === 0) {
          const prevItem = prev.find(p => p._id === item._id)
          if (!prevItem || prevItem.stock > 0) {
            setLowNotifs(n => [
              { id: item._id + "-out", itemName: item.name, stock: 0, time: new Date().toISOString() },
              ...n.filter(x => x.id !== item._id + "-out"),
            ])
          }
        }
      })
      prevItemsRef.current = list
    } catch {
      showToast("Failed to load items", "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  /* ── filter + sort ── */
  useEffect(() => {
    let out = items.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
    )
    out = [...out].sort((a, b) => {
      const av = sortKey === "name" ? a.name : sortKey === "stock" ? a.stock : a.price
      const bv = sortKey === "name" ? b.name : sortKey === "stock" ? b.stock : b.price
      return sortDir === "asc"
        ? typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number)
        : typeof bv === "string" ? bv.localeCompare(av as string) : (bv as number) - (av as number)
    })
    setFiltered(out)
  }, [items, search, sortKey, sortDir])

  /* ── toast ── */
  const showToast = (msg: string, type: "success"|"error") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── edit save ── */
  const handleSave = async (id: string) => {
    if (!editStock || isNaN(Number(editStock)) || Number(editStock) < 0) {
      showToast("Enter a valid stock quantity", "error"); return
    }
    setSavingId(id)
    try {
      await axios.patch(`/api/admin/add-grocery/${id}`, {
        stock: Number(editStock),
        price: editPrice ? Number(editPrice) : undefined,
      })
      setItems(prev => prev.map(i =>
        i._id === id
          ? { ...i, stock: Number(editStock), price: editPrice ? Number(editPrice) : i.price }
          : i
      ))
      setEditId(null)
      showToast("Item updated successfully", "success")
    } catch {
      showToast("Update failed", "error")
    } finally {
      setSavingId(null)
    }
  }

  /* ── delete ── */
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/add-grocery/${id}`)
      setItems(prev => prev.filter(i => i._id !== id))
      setDeleteId(null)
      showToast("Item deleted", "success")
    } catch {
      showToast("Delete failed", "error")
    }
  }

  /* ── simulate order (reduce stock) ── */
  const handleOrder = async (id: string) => {
    const item = items.find(i => i._id === id)
    if (!item || item.stock === 0) return
    const newStock = item.stock - 1
    try {
      await axios.patch(`/api/admin/add-grocery/${id}`, { stock: newStock })
      setItems(prev => prev.map(i => i._id === id ? { ...i, stock: newStock } : i))
      if (newStock <= 5) {
        setLowNotifs(n => [
          { id: newStock === 0 ? id + "-out" : id, itemName: item.name, stock: newStock, time: new Date().toISOString() },
          ...n.filter(x => x.id !== id && x.id !== id + "-out"),
        ])
      }
      showToast(`Order placed · ${item.name} stock → ${newStock}`, "success")
    } catch {
      showToast("Order failed", "error")
    }
  }

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const newNotifCount = lowNotifs.filter(n => !notifSeen.has(n.id)).length
  const markAllSeen = () => setNotifSeen(new Set(lowNotifs.map(n => n.id)))

  const labelClass = "flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
  const thClass    = "px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider"

  /* ── UI ── */
  return (
    <div className="w-full space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Stock & Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage inventory levels and product details</p>
        </div>
        <button
          onClick={fetchItems}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-green-600 border border-gray-200 px-3 py-2 rounded-xl hover:border-green-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Items",   value: items.length,                                  icon: <Package className="w-4 h-4 text-green-500" />,  bg: "bg-green-50" },
          { label: "In Stock",      value: items.filter(i => i.stock > 5).length,         icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />, bg: "bg-blue-50" },
          { label: "Low Stock",     value: items.filter(i => i.stock > 0 && i.stock <= 5).length, icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, bg: "bg-amber-50" },
          { label: "Out of Stock",  value: items.filter(i => i.stock === 0).length,       icon: <TrendingDown className="w-4 h-4 text-red-500" />, bg: "bg-red-50" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">{s.label}</span>
              <div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center`}>{s.icon}</div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Notification Panel ── */}
      <AnimatePresence>
        {lowNotifs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-amber-800">Stock Alerts</p>
                {newNotifCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold">{newNotifCount} new</span>
                )}
              </div>
              <button onClick={markAllSeen} className="text-[11px] text-amber-600 hover:text-amber-800 font-semibold">
                Mark all seen
              </button>
            </div>
            <div className="space-y-2">
              {lowNotifs.slice(0, 4).map(n => (
                <div key={n.id} className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-3 py-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${n.stock === 0 ? "bg-red-500" : "bg-amber-400"}`} />
                  <p className="text-xs text-gray-700 flex-1">
                    <span className="font-semibold">{n.itemName}</span>
                    {n.stock === 0
                      ? " is out of stock"
                      : ` has only ${n.stock} ${n.stock === 1 ? "unit" : "units"} left`}
                  </p>
                  <span className="text-[10px] text-gray-400 shrink-0">{timeAgo(n.time)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search items…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] bg-gray-50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">Sort by:</span>
            {(["name","stock","price"] as const).map(k => (
              <button
                key={k}
                onClick={() => toggleSort(k)}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all
                  ${sortKey === k ? "border-green-400 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                {k.charAt(0).toUpperCase() + k.slice(1)}
                <ArrowUpDown className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-175">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className={thClass}>Product</th>
                <th className={thClass}>Category</th>
                <th className={thClass}>Unit</th>
                <th className={thClass}>Price</th>
                <th className={thClass}>Stock</th>
                <th className={thClass}>Status</th>
                <th className={thClass + " text-right"}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random()*30}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <ArchiveIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 font-medium">No items found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const isEditing = editId === item._id
                  const b = badge(item.stock)
                  return (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`group transition-colors hover:bg-gray-50/60 ${item.stock <= 5 ? "bg-amber-50/30" : ""}`}
                    >
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-contain border border-gray-100 bg-white p-0.5 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="text-sm font-semibold text-gray-800 truncate max-w-35">{item.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg font-medium">{item.category}</span>
                      </td>

                      {/* Unit */}
                      <td className="px-4 py-3 text-sm text-gray-600">{item.unit}</td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            placeholder={String(item.price)}
                            className="w-24 border border-green-300 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 ring-green-200 bg-white"
                          />
                        ) : (
                          <div>
                            <span className="text-sm font-bold text-gray-800">
                              ₹{item.discount ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price}
                            </span>
                            {item.discount ? (
                              <span className="text-[10px] text-gray-400 line-through ml-1">₹{item.price}</span>
                            ) : null}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={e => setEditStock(e.target.value)}
                            min={0}
                            className="w-24 border border-green-300 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 ring-green-200 bg-white"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {item.stock <= 5 && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            <span className={`text-sm font-bold ${item.stock === 0 ? "text-red-500" : item.stock <= 5 ? "text-amber-600" : "text-gray-800"}`}>
                              {item.stock}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${b.cls}`}>{b.label}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(item._id)}
                                disabled={savingId === item._id}
                                className="flex items-center gap-1 text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-60"
                              >
                                {savingId === item._id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                Save
                              </button>
                              <button
                                onClick={() => setEditId(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 border border-gray-200 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Simulate order */}
                              <button
                                onClick={() => handleOrder(item._id)}
                                disabled={item.stock === 0}
                                title="Simulate 1 order"
                                className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center hover:bg-blue-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 text-blue-500" />
                              </button>
                              {/* Edit */}
                              <button
                                onClick={() => { setEditId(item._id); setEditStock(String(item.stock)); setEditPrice(String(item.price)) }}
                                className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5 text-gray-500" />
                              </button>
                              {/* Delete */}
                              <button
                                onClick={() => setDeleteId(item._id)}
                                className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{items.length}</span> items
            </p>
            <p className="text-[10px] text-gray-300">
              🛒 Cart icon = simulate 1 order (reduces stock)
            </p>
          </div>
        )}
      </motion.div>

      {/* ── Delete Modal ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 w-85 border border-gray-100"
            >
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 text-center">Delete Item?</h3>
              <p className="text-sm text-gray-500 text-center mt-1 mb-5">
                This action cannot be undone. The item will be permanently removed from inventory.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-white border px-5 py-3 rounded-2xl shadow-xl
              ${toast.type === "success" ? "border-green-200" : "border-red-200"}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {toast.type === "success"
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : <X className="w-4 h-4 text-red-500" />
              }
            </div>
            <span className="text-sm font-semibold text-gray-800">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}