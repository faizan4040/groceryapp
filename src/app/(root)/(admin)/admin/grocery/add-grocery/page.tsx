"use client"

import {
  PlusCircle, Package, Tag, ImageIcon, CheckCircle2, X, Upload, ChevronDown,
  Trash2, Layers, AlignLeft, AlertCircle, Copy, Camera,
} from "lucide-react"
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"

const UNIT_GROUPS = [
  { label: "Weight", items: ["g", "kg"] },
  { label: "Volume", items: ["ml", "liter"] },
  { label: "Count", items: ["piece", "pack"] },
]
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

interface Category { _id: string; name: string }

interface VariantRow {
  id: number
  quantity: string
  unit: string
  price: string    // MRP
  discount: string
  stock: string
  file: File | null
  preview: string | null
}

let nextId = 1
const emptyRow = (unit = "g"): VariantRow => ({
  id: nextId++, quantity: "", unit, price: "", discount: "", stock: "", file: null, preview: null,
})

const round2 = (n: number) => Math.round(n * 100) / 100
const fmtQty = (q: string) => (q && !isNaN(Number(q)) ? String(round2(Number(q))) : "")

export default function AddGrocery() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [variants, setVariants] = useState<VariantRow[]>(() => [emptyRow()])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/admin/add-category")
        setCategories(data.categories)
      } catch {}
    }
    fetchCategories()
    window.addEventListener("focus", fetchCategories)
    return () => window.removeEventListener("focus", fetchCategories)
  }, [])

  const clearError = (key: string) => setErrors((p) => (p[key] ? { ...p, [key]: "" } : p))

  /* ── main image ── */
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setErrors((p) => ({ ...p, image: "Please choose an image file" })); return }
    if (file.size > MAX_IMAGE_BYTES) { setErrors((p) => ({ ...p, image: "Image must be under 10 MB" })); return }
    setMainImage(file)
    setPreview(URL.createObjectURL(file))
    clearError("image")
  }
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── variants ── */
  const updateRow = (id: number, patch: Partial<VariantRow>) => {
    setVariants((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    Object.keys(patch).forEach((k) => clearError(`${id}.${k}`))
    clearError("variants")
  }
  const addRow = () => setVariants((rows) => [...rows, emptyRow(rows[rows.length - 1]?.unit || "g")])
  const duplicateRow = (row: VariantRow) =>
    setVariants((rows) => {
      const i = rows.findIndex((r) => r.id === row.id)
      const copy = { ...row, id: nextId++, quantity: "", file: null, preview: null }
      return [...rows.slice(0, i + 1), copy, ...rows.slice(i + 1)]
    })
  const removeRow = (id: number) => setVariants((rows) => (rows.length > 1 ? rows.filter((r) => r.id !== id) : rows))
  const makeDefault = (id: number) =>
    setVariants((rows) => [rows.find((r) => r.id === id)!, ...rows.filter((r) => r.id !== id)])

  const setRowImage = (id: number, file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) { setErrors((p) => ({ ...p, [`${id}.file`]: "Not an image" })); return }
    if (file.size > MAX_IMAGE_BYTES) { setErrors((p) => ({ ...p, [`${id}.file`]: "Max 10 MB" })); return }
    updateRow(id, { file, preview: URL.createObjectURL(file) })
  }

  /* ── validation ── */
  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = "Required"
    if (!category) e.category = "Select a category"
    if (!mainImage) e.image = "Upload the main product image"

    const labels = new Map<string, number>()
    variants.forEach((v) => {
      const q = Number(v.quantity)
      if (!v.quantity || isNaN(q) || q <= 0) e[`${v.id}.quantity`] = "Size > 0"
      if (!v.unit) e[`${v.id}.unit`] = "Unit"
      if (!v.price || isNaN(Number(v.price)) || Number(v.price) <= 0) e[`${v.id}.price`] = "Price > 0"
      if (v.discount && (isNaN(Number(v.discount)) || Number(v.discount) < 0 || Number(v.discount) > 100)) e[`${v.id}.discount`] = "0–100"
      if (v.stock === "" || !Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) e[`${v.id}.stock`] = "Whole no."
      if (v.quantity && v.unit) {
        const label = `${fmtQty(v.quantity)} ${v.unit}`
        if (labels.has(label)) { e[`${v.id}.quantity`] = "Duplicate size"; e.variants = `"${label}" is added twice` }
        labels.set(label, v.id)
      }
    })
    setErrors(e)
    return Object.keys(e).filter((k) => e[k]).length === 0
  }

  const resetForm = () => {
    setName(""); setCategory(""); setDescription("")
    setPreview(null); setMainImage(null)
    setVariants([emptyRow()])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    setServerError("")
    if (!validate()) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("name", name.trim())
      fd.append("category", category)
      if (description.trim()) fd.append("description", description.trim())
      fd.append("image", mainImage!)
      fd.append(
        "variants",
        JSON.stringify(variants.map((v) => ({
          quantity: Number(v.quantity),
          unit: v.unit,
          price: Number(v.price),
          discount: v.discount ? Number(v.discount) : 0,
          stock: Number(v.stock),
        }))),
      )
      variants.forEach((v, i) => { if (v.file) fd.append(`variantImage_${i}`, v.file) })

      await axios.post("/api/admin/add-grocery", fd, { headers: { "Content-Type": "multipart/form-data" } })

      setSuccess(true)
      resetForm()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Could not add the product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /* ── style helpers ── */
  const labelClass = "flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 mb-1.5"
  const inputClass = (err?: string) =>
    `w-full bg-gray-50 border ${err ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] transition-all duration-200`
  const cellClass = (err?: string) =>
    `w-full bg-white border ${err ? "border-red-400" : "border-gray-200"} rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] transition`
  const triggerClass = (err?: string) =>
    `w-full justify-between rounded-xl px-4 py-2.5 text-sm font-normal border transition-all duration-200 bg-gray-50 hover:bg-white
    ${err ? "border-red-400" : "border-gray-200 hover:border-green-400 hover:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]"}`
  const cellLabel = "block text-[11px] font-semibold text-gray-500 mb-1 lg:hidden"

  const totalStock = variants.reduce((s, v) => s + (Number(v.stock) || 0), 0)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add Product</h1>
          <p className="text-xs text-gray-400 mt-0.5">Product details, then every pack size it comes in</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 text-green-600" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6"
      >
        {/* ── 1. Product ─────────────────────────────── */}
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">1 · Product</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}><Package className="w-3.5 h-3.5 text-green-500" /> Product Name <span className="text-red-400">*</span></label>
            <input
              type="text" value={name} placeholder="e.g. Kashmiri Red Chilli Powder"
              className={inputClass(errors.name)}
              onChange={(e) => { setName(e.target.value); clearError("name") }}
            />
            {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}><Tag className="w-3.5 h-3.5 text-green-500" /> Category <span className="text-red-400">*</span></label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={triggerClass(errors.category)}>
                  <span className={category ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}>{category || "Select category"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-xl border border-gray-100 shadow-lg p-1 max-h-60 overflow-y-auto">
                {categories.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-gray-400">
                    No categories found. <a href="/admin/category/add-category" className="text-green-500 underline font-medium">Add one</a>
                  </div>
                ) : (
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">Categories</DropdownMenuLabel>
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat._id}
                        onSelect={() => { setCategory(cat.name); clearError("category") }}
                        className={`rounded-lg text-sm px-3 py-2 cursor-pointer flex items-center gap-2 ${category === cat.name ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        {category === cat.name && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.category && <p className="text-red-400 text-[11px] mt-1">{errors.category}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}><AlignLeft className="w-3.5 h-3.5 text-green-500" /> Description <span className="text-gray-400 text-[11px] font-normal ml-1">optional</span></label>
          <textarea
            value={description} rows={3} maxLength={600}
            placeholder="Short description shown on the product page — taste, colour, how to use…"
            className={inputClass() + " resize-y min-h-20"}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-[11px] text-gray-400 mt-1 text-right">{description.length}/600</p>
        </div>

        {/* Main image */}
        <div className="mb-6">
          <label className={labelClass}><ImageIcon className="w-3.5 h-3.5 text-green-500" /> Main Product Image <span className="text-red-400">*</span></label>
          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="drop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${isDragging ? "border-green-400 bg-green-50" : errors.image ? "border-red-300 bg-red-50/20" : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/40"}`}
              >
                <div className="flex items-center gap-4 px-6 py-5">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${isDragging ? "bg-green-100 border-green-300" : "bg-white border-gray-200"}`}>
                    <Upload className={`w-5 h-5 ${isDragging ? "text-green-500" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{isDragging ? "Drop it here!" : "Drag & drop image"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">or <span className="text-green-500 underline underline-offset-2 font-medium">browse files</span> · PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="prev" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview" className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white shrink-0 p-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <p className="text-sm font-semibold text-gray-800 truncate">{mainImage?.name}</p>
                    </div>
                    <p className="text-xs text-gray-400">{mainImage ? (mainImage.size / 1024).toFixed(1) + " KB" : ""}</p>
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs text-green-600 font-medium mt-1 hover:underline">Change image</button>
                  </div>
                  <button
                    onClick={() => { setPreview(null); setMainImage(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                    className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 shrink-0"
                    aria-label="Remove image"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          {errors.image && <p className="text-red-400 text-[11px] mt-1">{errors.image}</p>}
        </div>

        {/* ── 2. Variants ─────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">2 · Variants (pack sizes)</p>
            <p className="text-xs text-gray-400 mt-0.5">Price is the MRP — discount is applied on top. The first row is the default shown on cards.</p>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg px-2.5 py-1">
            {variants.length} {variants.length === 1 ? "variant" : "variants"} · {totalStock} in stock
          </span>
        </div>

        {/* column headings (desktop) */}
        <div className="hidden lg:grid grid-cols-[56px_1.3fr_1fr_0.8fr_0.8fr_1fr_92px] gap-3 px-3 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <span>Photo</span><span>Size *</span><span>MRP (₹) *</span><span>Disc. %</span><span>Stock *</span><span>Customer pays</span><span />
        </div>

        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {variants.map((v, i) => {
              const mrp = Number(v.price)
              const disc = Number(v.discount) || 0
              const pays = mrp > 0 ? (disc > 0 ? round2(mrp * (1 - disc / 100)) : mrp) : null
              const e = (f: string) => errors[`${v.id}.${f}`]
              return (
                <motion.div
                  key={v.id}
                  layout
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                  className={`relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[56px_1.3fr_1fr_0.8fr_0.8fr_1fr_92px] gap-3 items-start lg:items-center rounded-xl border p-3 ${i === 0 ? "border-green-200 bg-green-50/40" : "border-gray-200 bg-gray-50/60"}`}
                >
                  {/* photo */}
                  <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center gap-3 lg:block">
                    <label className="relative w-14 h-14 rounded-lg border border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer overflow-hidden hover:border-green-400 transition" title="Optional photo for this size">
                      {v.preview
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={v.preview} alt="" className="w-full h-full object-contain p-0.5" />
                        : <Camera className="w-4 h-4 text-gray-400" />}
                      <input type="file" accept="image/*" className="hidden" onChange={(ev) => setRowImage(v.id, ev.target.files?.[0])} />
                    </label>
                    <div className="lg:hidden text-xs">
                      <p className="font-semibold text-gray-700">Variant {i + 1} {i === 0 && <span className="ml-1 text-green-600">· Default</span>}</p>
                      <p className="text-gray-400">{v.preview ? <button type="button" className="text-red-500 hover:underline" onClick={() => updateRow(v.id, { file: null, preview: null })}>Remove photo</button> : "Photo optional — uses main image"}</p>
                    </div>
                    {e("file") && <p className="text-red-400 text-[10px] mt-1">{e("file")}</p>}
                  </div>

                  {/* size + unit */}
                  <div className="col-span-2 sm:col-span-2 lg:col-span-1">
                    <span className={cellLabel}>Size *</span>
                    <div className="flex">
                      <input
                        type="number" inputMode="decimal" min={0} value={v.quantity} placeholder="100"
                        className={cellClass(e("quantity")) + " rounded-r-none"}
                        onChange={(ev) => updateRow(v.id, { quantity: ev.target.value })}
                      />
                      <select
                        value={v.unit}
                        onChange={(ev) => updateRow(v.id, { unit: ev.target.value })}
                        className={`shrink-0 border border-l-0 ${e("unit") ? "border-red-400" : "border-gray-200"} rounded-r-lg bg-gray-100 px-2 text-sm font-semibold text-gray-700 outline-none focus:border-green-400 cursor-pointer`}
                        aria-label="Unit"
                      >
                        {UNIT_GROUPS.map((g) => (
                          <optgroup key={g.label} label={g.label}>
                            {g.items.map((u) => <option key={u} value={u}>{u}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    {e("quantity") && <p className="text-red-400 text-[10px] mt-1">{e("quantity")}</p>}
                  </div>

                  {/* MRP */}
                  <div>
                    <span className={cellLabel}>MRP (₹) *</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                      <input
                        type="number" inputMode="decimal" min={0} value={v.price} placeholder="0"
                        className={cellClass(e("price")) + " pl-7"}
                        onChange={(ev) => updateRow(v.id, { price: ev.target.value })}
                      />
                    </div>
                    {e("price") && <p className="text-red-400 text-[10px] mt-1">{e("price")}</p>}
                  </div>

                  {/* discount */}
                  <div>
                    <span className={cellLabel}>Disc. %</span>
                    <input
                      type="number" inputMode="decimal" min={0} max={100} value={v.discount} placeholder="0"
                      className={cellClass(e("discount"))}
                      onChange={(ev) => updateRow(v.id, { discount: ev.target.value })}
                    />
                    {e("discount") && <p className="text-red-400 text-[10px] mt-1">{e("discount")}</p>}
                  </div>

                  {/* stock */}
                  <div>
                    <span className={cellLabel}>Stock *</span>
                    <input
                      type="number" inputMode="numeric" min={0} step={1} value={v.stock} placeholder="0"
                      className={cellClass(e("stock"))}
                      onChange={(ev) => updateRow(v.id, { stock: ev.target.value })}
                    />
                    {e("stock") && <p className="text-red-400 text-[10px] mt-1">{e("stock")}</p>}
                  </div>

                  {/* customer pays */}
                  <div>
                    <span className={cellLabel}>Customer pays</span>
                    <p className="text-sm font-bold text-gray-800 py-2">
                      {pays != null ? <>₹{pays}{disc > 0 && <span className="ml-1.5 text-[11px] font-normal text-gray-400 line-through">₹{mrp}</span>}</> : <span className="text-gray-300 font-normal">—</span>}
                    </p>
                  </div>

                  {/* actions */}
                  <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center justify-end gap-1">
                    {i === 0 ? (
                      <span className="hidden lg:inline text-[10px] font-bold text-green-700 bg-green-100 rounded-md px-1.5 py-0.5 mr-auto">DEFAULT</span>
                    ) : (
                      <button type="button" onClick={() => makeDefault(v.id)} className="text-[11px] text-gray-500 hover:text-green-600 mr-auto lg:mr-0 px-1" title="Make this the default size">
                        Set default
                      </button>
                    )}
                    <button type="button" onClick={() => duplicateRow(v)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-700" aria-label="Duplicate variant" title="Duplicate">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button" onClick={() => removeRow(v.id)} disabled={variants.length === 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:pointer-events-none"
                      aria-label="Remove variant" title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {errors.variants && <p className="text-red-400 text-xs mt-2">{errors.variants}</p>}

        <button
          type="button"
          onClick={addRow}
          className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50/40 transition"
        >
          <Layers className="w-4 h-4" /> Add another variant
        </button>

        <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-5" />

        {serverError && (
          <div className="flex items-start gap-2 mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {serverError}
          </div>
        )}

        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-bold text-sm text-white bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-[0_4px_20px_-4px_rgba(34,197,94,0.5)] disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploading & saving…
            </>
          ) : (
            <><PlusCircle className="w-4 h-4" /> Add product with {variants.length} {variants.length === 1 ? "variant" : "variants"}</>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-white border border-green-200 px-5 py-3 rounded-2xl shadow-xl"
          >
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Product added!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  )
}
