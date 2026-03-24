"use client"

import {
  PlusCircle, Package, Tag, Ruler, IndianRupee,
  ImageIcon, CheckCircle2, X, Upload, ChevronDown,
  Percent, ArchiveIcon,
} from "lucide-react"
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from "axios"

const unitGroups = [
  { label: "Weight",  items: ["kg", "g"] },
  { label: "Volume",  items: ["liter", "ml"] },
  { label: "Count",   items: ["piece", "pack"] },
]

interface Category { _id: string; name: string }

export default function AddGrocery() {
  const [name,          setName]          = useState("")
  const [category,      setCategory]      = useState("")
  const [unit,          setUnit]          = useState("")
  const [price,         setPrice]         = useState("")
  const [discount,      setDiscount]      = useState("") 
  const [stock,         setStock]         = useState("") 
  const [preview,       setPreview]       = useState<string | null>(null)
  const [backendImage,  setBackendImage]  = useState<File | null>(null)
  const [isDragging,    setIsDragging]    = useState(false)
  const [errors,        setErrors]        = useState<Record<string, string>>({})
  const [loading,       setLoading]       = useState(false)
  const [success,       setSuccess]       = useState(false)
  const [categories,    setCategories]    = useState<Category[]>([])
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

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setBackendImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setErrors(p => ({ ...p, image: "" }))
  }

  const handleImageChange  = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim())                         e.name     = "Required"
    if (!category)                            e.category = "Select a category"
    if (!unit)                                e.unit     = "Select a unit"
    if (!price || isNaN(Number(price)))       e.price    = "Enter valid price"
    if (!stock || isNaN(Number(stock)))       e.stock    = "Enter valid stock"
    if (discount && isNaN(Number(discount)))  e.discount = "Enter valid discount %"
    if (discount && (Number(discount) < 0 || Number(discount) > 100))
                                              e.discount = "Must be 0–100"
    if (!backendImage)                        e.image    = "Upload an image"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name",     name)
      formData.append("category", category)
      formData.append("unit",     unit)
      formData.append("price",    price)
      formData.append("stock",     stock)
      if (discount) formData.append("discount", discount)
      formData.append("image",    backendImage!)

      await axios.post("/api/admin/add-grocery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setSuccess(true)
      setName(""); setCategory(""); setUnit(""); setPrice("")
      setDiscount(""); setStock("")
      setPreview(null); setBackendImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error(err.response?.data)
    } finally {
      setLoading(false)
    }
  }

  /* ── style helpers ── */
  const labelClass = "flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 mb-1.5"
  const inputClass = (err?: string) =>
    `w-full bg-gray-50 border ${err ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] transition-all duration-200`
  const triggerClass = (val: string, err?: string) =>
    `w-full justify-between rounded-xl px-4 py-2.5 text-sm font-normal border transition-all duration-200 bg-gray-50 hover:bg-white
    ${err ? "border-red-400" : "border-gray-200 hover:border-green-400 hover:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]"}`

  /* ── discounted price preview ── */
  const discountedPrice = price && discount && !isNaN(Number(price)) && !isNaN(Number(discount))
    ? (Number(price) * (1 - Number(discount) / 100)).toFixed(2)
    : null

  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add Grocery Item</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new product</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 text-green-600" />
        </div>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
      >

        {/* Row 1: Name + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>
              <Package className="w-3.5 h-3.5 text-green-500" /> Grocery Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g. Organic Basmati Rice"
              className={inputClass(errors.name)}
              onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })) }}
            />
            {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>
              <Tag className="w-3.5 h-3.5 text-green-500" /> Category <span className="text-red-400">*</span>
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={triggerClass(category, errors.category)}>
                  <span className={category ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}>
                    {category || "Select category"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-xl border border-gray-100 shadow-lg p-1 max-h-60 overflow-y-auto">
                {categories.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-gray-400">
                    No categories found.{" "}
                    <a href="/admin/add-category" className="text-green-500 underline font-medium">Add one</a>
                  </div>
                ) : (
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
                      Categories
                    </DropdownMenuLabel>
                    {categories.map(cat => (
                      <DropdownMenuItem
                        key={cat._id}
                        onSelect={() => { setCategory(cat.name); setErrors(p => ({ ...p, category: "" })) }}
                        className={`rounded-lg text-sm px-3 py-2 cursor-pointer flex items-center gap-2
                          ${category === cat.name ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
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

        {/* Row 2: Unit + Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>
              <Ruler className="w-3.5 h-3.5 text-green-500" /> Unit <span className="text-red-400">*</span>
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={triggerClass(unit, errors.unit)}>
                  <span className={unit ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}>
                    {unit || "Select unit"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 rounded-xl border border-gray-100 shadow-lg p-1">
                {unitGroups.map((group, gi) => (
                  <React.Fragment key={group.label}>
                    {gi > 0 && <div className="my-1 h-px bg-gray-100" />}
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
                        {group.label}
                      </DropdownMenuLabel>
                      {group.items.map(item => (
                        <DropdownMenuItem
                          key={item}
                          onSelect={() => { setUnit(item); setErrors(p => ({ ...p, unit: "" })) }}
                          className={`rounded-lg text-sm px-3 py-2 cursor-pointer flex items-center gap-2
                            ${unit === item ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          {unit === item && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                          {item}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {errors.unit && <p className="text-red-400 text-[11px] mt-1">{errors.unit}</p>}
          </div>

          <div>
            <label className={labelClass}>
              <IndianRupee className="w-3.5 h-3.5 text-green-500" /> Price (₹) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">₹</span>
              <input
                type="number"
                value={price}
                placeholder="0.00"
                className={inputClass(errors.price) + " pl-8"}
                onChange={(e) => { setPrice(e.target.value); setErrors(p => ({ ...p, price: "" })) }}
              />
            </div>
            {errors.price && <p className="text-red-400 text-[11px] mt-1">{errors.price}</p>}
          </div>
        </div>

        {/* Row 3: Discount + Stock  ← NEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* Discount */}
          <div>
            <label className={labelClass}>
              <Percent className="w-3.5 h-3.5 text-green-500" /> Discount (%) <span className="text-gray-400 text-[11px] font-normal ml-1">optional</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={discount}
                placeholder="e.g. 20"
                min={0} max={100}
                className={inputClass(errors.discount) + " pr-8"}
                onChange={(e) => { setDiscount(e.target.value); setErrors(p => ({ ...p, discount: "" })) }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">%</span>
            </div>
            {errors.discount && <p className="text-red-400 text-[11px] mt-1">{errors.discount}</p>}
            {/* live discounted price preview */}
            {discountedPrice && (
              <p className="text-[11px] text-green-600 mt-1 font-medium">
                Customer pays: <span className="font-bold">₹{discountedPrice}</span>
                <span className="text-gray-400 ml-1">(original ₹{price})</span>
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className={labelClass}>
              <ArchiveIcon className="w-3.5 h-3.5 text-green-500" /> Stock Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={stock}
              placeholder="e.g. 100"
              min={0}
              className={inputClass(errors.stock)}
              onChange={(e) => { setStock(e.target.value); setErrors(p => ({ ...p, stock: "" })) }}
            />
            {errors.stock && <p className="text-red-400 text-[11px] mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-5">
          <label className={labelClass}>
            <ImageIcon className="w-3.5 h-3.5 text-green-500" /> Product Image <span className="text-red-400">*</span>
          </label>

          <AnimatePresence mode="wait">
            {!preview ? (
              <motion.div
                key="drop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
                  ${isDragging ? "border-green-400 bg-green-50" : errors.image ? "border-red-300 bg-red-50/20" : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/40"}`}
              >
                <div className="flex items-center gap-4 px-6 py-5">
                  <motion.div
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors
                      ${isDragging ? "bg-green-100 border-green-300" : "bg-white border-gray-200"}`}
                  >
                    <Upload className={`w-5 h-5 ${isDragging ? "text-green-500" : "text-gray-400"}`} />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{isDragging ? "Drop it here!" : "Drag & drop image"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">or <span className="text-green-500 underline underline-offset-2 font-medium">browse files</span> · PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="prev"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
              >
                <div className="flex items-center gap-4 p-3">
                  <img src={preview} alt="preview" className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white shrink-0 p-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <p className="text-sm font-semibold text-gray-800 truncate">{backendImage?.name}</p>
                    </div>
                    <p className="text-xs text-gray-400">{backendImage ? (backendImage.size / 1024).toFixed(1) + " KB" : ""}</p>
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs text-green-600 font-medium mt-1 hover:underline">
                      Change image
                    </button>
                  </div>
                  <button
                    onClick={() => { setPreview(null); setBackendImage(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                    className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
                <div className="h-1 w-full bg-gray-100">
                  <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full bg-green-400 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          {errors.image && <p className="text-red-400 text-[11px] mt-1">{errors.image}</p>}
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-5" />

        {/* Submit */}
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-bold text-sm text-white
            bg-linear-to-r from-green-500 to-emerald-500
            hover:from-green-400 hover:to-emerald-400
            shadow-[0_4px_20px_-4px_rgba(34,197,94,0.5)]
            disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Adding item...
            </>
          ) : (
            <><PlusCircle className="w-4 h-4" /> Add to Inventory</>
          )}
        </motion.button>
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-white border border-green-200 px-5 py-3 rounded-2xl shadow-xl"
          >
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Grocery item added!</span>
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



// "use client"

// import { PlusCircle, Package, Tag, Ruler, IndianRupee, ImageIcon, CheckCircle2, X, Upload, ChevronDown } from "lucide-react"
// import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
// import { motion, AnimatePresence } from "motion/react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import axios from "axios"

// const unitGroups = [
//   { label: "Weight", items: ["kg", "g"] },
//   { label: "Volume", items: ["liter", "ml"] },
//   { label: "Count", items: ["piece", "pack"] },
// ]

// interface Category { _id: string; name: string }

// export default function AddGrocery() {
//   const [name, setName] = useState("")
//   const [category, setCategory] = useState("")
//   const [unit, setUnit] = useState("")
//   const [price, setPrice] = useState("")
//   const [preview, setPreview] = useState<string | null>(null)
//   const [backendImage, setBackendImage] = useState<File | null>(null)
//   const [isDragging, setIsDragging] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [categories, setCategories] = useState<Category[]>([])
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   // Fetch categories from DB
// // Replace your current useEffect with this:
// useEffect(() => {
//   const fetchCategories = async () => {
//     try {
//       const { data } = await axios.get("/api/admin/add-category")
//       setCategories(data.categories)
//     } catch {}
//   }

//   fetchCategories() // fetch on mount

//   // Re-fetch when user comes back to this tab/page
//   window.addEventListener("focus", fetchCategories)
//   return () => window.removeEventListener("focus", fetchCategories)
// }, [])

//   const processFile = (file: File) => {
//     if (!file.type.startsWith("image/")) return
//     setBackendImage(file)
//     const reader = new FileReader()
//     reader.onload = (e) => setPreview(e.target?.result as string)
//     reader.readAsDataURL(file)
//     setErrors(p => ({ ...p, image: "" }))
//   }

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) processFile(file)
//   }

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragging(false)
//     const file = e.dataTransfer.files?.[0]
//     if (file) processFile(file)
//   }, [])

//   const validate = () => {
//     const e: Record<string, string> = {}
//     if (!name.trim()) e.name = "Required"
//     if (!category) e.category = "Select a category"
//     if (!unit) e.unit = "Select a unit"
//     if (!price || isNaN(Number(price))) e.price = "Enter valid price"
//     if (!backendImage) e.image = "Upload an image"
//     setErrors(e)
//     return Object.keys(e).length === 0
//   }

//   const handleSubmit = async () => {
//     if (!validate()) return
//     setLoading(true)
//     try {
//       const formData = new FormData()
//       formData.append("name", name)
//       formData.append("category", category)
//       formData.append("unit", unit)
//       formData.append("price", price)
//       formData.append("image", backendImage!)
//       await axios.post("/api/admin/add-grocery", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       setSuccess(true)
//       setName(""); setCategory(""); setUnit(""); setPrice("")
//       setPreview(null); setBackendImage(null)
//       if (fileInputRef.current) fileInputRef.current.value = ""
//       setTimeout(() => setSuccess(false), 3000)
//     } catch (err: any) {
//       console.error(err.response?.data)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const labelClass = "flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 mb-1.5"
//   const inputClass = (err?: string) =>
//     `w-full bg-gray-50 border ${err ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] transition-all duration-200`
//   const triggerClass = (val: string, err?: string) =>
//     `w-full justify-between rounded-xl px-4 py-2.5 text-sm font-normal border transition-all duration-200 bg-gray-50 hover:bg-white
//     ${err ? "border-red-400" : "border-gray-200 hover:border-green-400 hover:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]"}`

//   return (
//     <div className="w-full">

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Add Grocery Item</h1>
//           <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new product</p>
//         </div>
//         <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
//           <PlusCircle className="w-5 h-5 text-green-600" />
//         </div>
//       </div>

//       {/* Form Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//         className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
//       >
//         {/* Row 1: Name + Category */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

//           <div>
//             <label className={labelClass}>
//               <Package className="w-3.5 h-3.5 text-green-500" /> Grocery Name <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               value={name}
//               placeholder="e.g. Organic Basmati Rice"
//               className={inputClass(errors.name)}
//               onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })) }}
//             />
//             {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
//           </div>

//           {/* Category — from DB */}
//           <div>
//             <label className={labelClass}>
//               <Tag className="w-3.5 h-3.5 text-green-500" /> Category <span className="text-red-400">*</span>
//             </label>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className={triggerClass(category, errors.category)}>
//                   <span className={category ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}>
//                     {category || "Select category"}
//                   </span>
//                   <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-64 rounded-xl border border-gray-100 shadow-lg p-1 max-h-60 overflow-y-auto">
//                 {categories.length === 0 ? (
//                   <div className="px-3 py-4 text-center text-xs text-gray-400">
//                     No categories found.{" "}
//                     <a href="/admin/add-category" className="text-green-500 underline font-medium">Add one</a>
//                   </div>
//                 ) : (
//                   <DropdownMenuGroup>
//                     <DropdownMenuLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
//                       Categories
//                     </DropdownMenuLabel>
//                     {categories.map(cat => (
//                       <DropdownMenuItem
//                         key={cat._id}
//                         onSelect={() => { setCategory(cat.name); setErrors(p => ({ ...p, category: "" })) }}
//                         className={`rounded-lg text-sm px-3 py-2 cursor-pointer transition-colors flex items-center gap-2
//                           ${category === cat.name ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
//                       >
//                         {category === cat.name && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
//                         {cat.name}
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuGroup>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {errors.category && <p className="text-red-400 text-[11px] mt-1">{errors.category}</p>}
//           </div>
//         </div>

//         {/* Row 2: Unit + Price */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

//           <div>
//             <label className={labelClass}>
//               <Ruler className="w-3.5 h-3.5 text-green-500" /> Unit <span className="text-red-400">*</span>
//             </label>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className={triggerClass(unit, errors.unit)}>
//                   <span className={unit ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}>
//                     {unit || "Select unit"}
//                   </span>
//                   <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-48 rounded-xl border border-gray-100 shadow-lg p-1">
//                 {unitGroups.map((group, gi) => (
//                   <React.Fragment key={group.label}>
//                     {gi > 0 && <div className="my-1 h-px bg-gray-100" />}
//                     <DropdownMenuGroup>
//                       <DropdownMenuLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
//                         {group.label}
//                       </DropdownMenuLabel>
//                       {group.items.map(item => (
//                         <DropdownMenuItem
//                           key={item}
//                           onSelect={() => { setUnit(item); setErrors(p => ({ ...p, unit: "" })) }}
//                           className={`rounded-lg text-sm px-3 py-2 cursor-pointer flex items-center gap-2
//                             ${unit === item ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
//                         >
//                           {unit === item && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
//                           {item}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuGroup>
//                   </React.Fragment>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {errors.unit && <p className="text-red-400 text-[11px] mt-1">{errors.unit}</p>}
//           </div>

//           <div>
//             <label className={labelClass}>
//               <IndianRupee className="w-3.5 h-3.5 text-green-500" /> Price (₹) <span className="text-red-400">*</span>
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">₹</span>
//               <input
//                 type="number"
//                 value={price}
//                 placeholder="0.00"
//                 className={inputClass(errors.price) + " pl-8"}
//                 onChange={(e) => { setPrice(e.target.value); setErrors(p => ({ ...p, price: "" })) }}
//               />
//             </div>
//             {errors.price && <p className="text-red-400 text-[11px] mt-1">{errors.price}</p>}
//           </div>
//         </div>

//         {/* Image Upload */}
//         <div className="mb-5">
//           <label className={labelClass}>
//             <ImageIcon className="w-3.5 h-3.5 text-green-500" /> Product Image <span className="text-red-400">*</span>
//           </label>

//           <AnimatePresence mode="wait">
//             {!preview ? (
//               <motion.div
//                 key="drop"
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                 onDrop={handleDrop}
//                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
//                 onDragLeave={() => setIsDragging(false)}
//                 onClick={() => fileInputRef.current?.click()}
//                 className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
//                   ${isDragging ? "border-green-400 bg-green-50" : errors.image ? "border-red-300 bg-red-50/20" : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/40"}`}
//               >
//                 <div className="flex items-center gap-4 px-6 py-5">
//                   <motion.div
//                     animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
//                     className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors
//                       ${isDragging ? "bg-green-100 border-green-300" : "bg-white border-gray-200"}`}
//                   >
//                     <Upload className={`w-5 h-5 ${isDragging ? "text-green-500" : "text-gray-400"}`} />
//                   </motion.div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-700">{isDragging ? "Drop it here!" : "Drag & drop image"}</p>
//                     <p className="text-xs text-gray-400 mt-0.5">or <span className="text-green-500 underline underline-offset-2 font-medium">browse files</span> · PNG, JPG, WEBP up to 10MB</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="prev"
//                 initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
//                 className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
//               >
//                 <div className="flex items-center gap-4 p-3">
//                   <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-1.5 mb-0.5">
//                       <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
//                       <p className="text-sm font-semibold text-gray-800 truncate">{backendImage?.name}</p>
//                     </div>
//                     <p className="text-xs text-gray-400">{backendImage ? (backendImage.size / 1024).toFixed(1) + " KB" : ""}</p>
//                     <button onClick={() => fileInputRef.current?.click()} className="text-xs text-green-600 font-medium mt-1 hover:underline">
//                       Change image
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => { setPreview(null); setBackendImage(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
//                     className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
//                   >
//                     <X className="w-3 h-3 text-red-500" />
//                   </button>
//                 </div>
//                 <div className="h-1 w-full bg-gray-100">
//                   <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full bg-green-400 rounded-full" />
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//           {errors.image && <p className="text-red-400 text-[11px] mt-1">{errors.image}</p>}
//         </div>

//         <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-5" />

//         {/* Submit */}
//         <motion.button
//           onClick={handleSubmit}
//           disabled={loading}
//           whileTap={{ scale: 0.98 }}
//           className="w-full py-3 rounded-xl font-bold text-sm text-white
//             bg-linear-to-r from-green-500 to-emerald-500
//             hover:from-green-400 hover:to-emerald-400
//             shadow-[0_4px_20px_-4px_rgba(34,197,94,0.5)]
//             disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
//         >
//           {loading ? (
//             <>
//               <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//               </svg>
//               Adding item...
//             </>
//           ) : (
//             <><PlusCircle className="w-4 h-4" /> Add to Inventory</>
//           )}
//         </motion.button>
//       </motion.div>

//       {/* Success Toast */}
//       <AnimatePresence>
//         {success && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, x: "-50%" }}
//             animate={{ opacity: 1, y: 0, x: "-50%" }}
//             exit={{ opacity: 0, y: 10, x: "-50%" }}
//             className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-white border border-green-200 px-5 py-3 rounded-2xl shadow-xl"
//           >
//             <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
//               <CheckCircle2 className="w-4 h-4 text-green-600" />
//             </div>
//             <span className="text-sm font-semibold text-gray-800">Grocery item added!</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <style>{`
//         input[type=number]::-webkit-inner-spin-button,
//         input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
//         input[type=number] { -moz-appearance: textfield; }
//       `}</style>
//     </div>
//   )
// }















// "use client"

// import { PlusCircle, Package, Tag, Ruler, IndianRupee, ImageIcon, CheckCircle2, X, Upload, ChevronDown } from "lucide-react"
// import React, { ChangeEvent, useCallback, useRef, useState } from "react"
// import { motion, AnimatePresence } from "motion/react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import axios from "axios"

// const categoryGroups = [
//   {
//     label: "Food & Beverages",
//     items: ["Fruits & Vegetables", "Dairy & Eggs", "Rice, Atta & Grains", "Snacks & Biscuits", "Spices & Masalas", "Beverages & Drinks", "Instant & Packaged Food"],
//   },
//   {
//     label: "Lifestyle",
//     items: ["Personal Care", "Household Essentials", "Baby & Pet Care"],
//   },
// ]

// const unitGroups = [
//   { label: "Weight", items: ["kg", "g"] },
//   { label: "Volume", items: ["liter", "ml"] },
//   { label: "Count", items: ["piece", "pack"] },
// ]

// const AddGrocery = () => {
//   const [name, setName] = useState("")
//   const [category, setCategory] = useState("")
//   const [unit, setUnit] = useState("")
//   const [price, setPrice] = useState("")
//   const [preview, setPreview] = useState<string | null>(null)
//   const [backendImage, setBackendImage] = useState<File | null>(null)
//   const [isDragging, setIsDragging] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const processFile = (file: File) => {
//     if (!file.type.startsWith("image/")) return
//     setBackendImage(file)
//     const reader = new FileReader()
//     reader.onload = (e) => setPreview(e.target?.result as string)
//     reader.readAsDataURL(file)
//     setErrors(p => ({ ...p, image: "" }))
//   }

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) processFile(file)
//   }

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setIsDragging(false)
//     const file = e.dataTransfer.files?.[0]
//     if (file) processFile(file)
//   }, [])

//   const validate = () => {
//     const e: Record<string, string> = {}
//     if (!name.trim()) e.name = "Required"
//     if (!category) e.category = "Select a category"
//     if (!unit) e.unit = "Select a unit"
//     if (!price || isNaN(Number(price))) e.price = "Enter valid price"
//     if (!backendImage) e.image = "Upload an image"
//     setErrors(e)
//     return Object.keys(e).length === 0
//   }

// const handleSubmit = async () => {
//   if (!validate()) return
//   setLoading(true)
//   try {
//     const formData = new FormData()
//     formData.append("name", name)
//     formData.append("category", category)
//     formData.append("unit", unit)
//     formData.append("price", price)
//     formData.append("image", backendImage!)

//     await axios.post("/api/admin/add-grocery", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     })

//     setSuccess(true)
//     setName(""); setCategory(""); setUnit(""); setPrice("")
//     setPreview(null); setBackendImage(null)
//     if (fileInputRef.current) fileInputRef.current.value = ""
//     setTimeout(() => setSuccess(false), 3000)
//   } catch (err) {
//     console.error(err)
//   } finally {
//     setLoading(false)
//   }
// }

//   const labelClass = "flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 mb-1.5"
//   const inputClass = (err?: string) =>
//     `w-full bg-gray-50 border ${err ? "border-red-400 bg-red-50/30" : "border-gray-200"} rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-green-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)] transition-all duration-200`

//   // Shared trigger style for both dropdowns
//   const dropdownTriggerClass = (value: string, err?: string) =>
//     `w-full justify-between rounded-xl px-4 py-2.5 text-sm font-normal border transition-all duration-200 bg-gray-50 hover:bg-white
//     ${err ? "border-red-400 bg-red-50/30 text-gray-400" : value ? "border-gray-200 text-gray-800 hover:border-green-400 hover:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]" : "border-gray-200 text-gray-400 hover:border-green-400 hover:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]"}`

//   return (
//     <div className="w-full">

//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Add Grocery Item</h1>
//           <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a new product</p>
//         </div>
//         <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
//           <PlusCircle className="w-5 h-5 text-green-600" />
//         </div>
//       </motion.div>

//       {/* Form Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//         className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
//       >

//         {/* Row 1: Name + Category */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

//           {/* Name */}
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
//             <label className={labelClass}>
//               <Package className="w-3.5 h-3.5 text-green-500" /> Grocery Name <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               value={name}
//               placeholder="e.g. Organic Basmati Rice"
//               className={inputClass(errors.name)}
//               onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })) }}
//             />
//             {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
//           </motion.div>

//           {/* Category Dropdown */}
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
//             <label className={labelClass}>
//               <Tag className="w-3.5 h-3.5 text-green-500" /> Category <span className="text-red-400">*</span>
//             </label>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className={dropdownTriggerClass(category, errors.category)}>
//                   <span className={category ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}>
//                     {category || "Select category"}
//                   </span>
//                   <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-64 rounded-xl border border-gray-100 shadow-lg p-1">
//                 {categoryGroups.map((group, gi) => (
//                   <React.Fragment key={group.label}>
//                     {gi > 0 && <DropdownMenuSeparator className="my-1 bg-gray-100" />}
//                     <DropdownMenuGroup>
//                       <DropdownMenuLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
//                         {group.label}
//                       </DropdownMenuLabel>
//                       {group.items.map(item => (
//                         <DropdownMenuItem
//                           key={item}
//                           onSelect={() => { setCategory(item); setErrors(p => ({ ...p, category: "" })) }}
//                           className={`rounded-lg text-sm px-3 py-2 cursor-pointer transition-colors
//                             ${category === item
//                               ? "bg-green-50 text-green-700 font-semibold"
//                               : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                             }`}
//                         >
//                           {category === item && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2 shrink-0" />}
//                           {item}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuGroup>
//                   </React.Fragment>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {errors.category && <p className="text-red-400 text-[11px] mt-1">{errors.category}</p>}
//           </motion.div>
//         </div>

//         {/* Row 2: Unit + Price */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

//           {/* Unit Dropdown */}
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
//             <label className={labelClass}>
//               <Ruler className="w-3.5 h-3.5 text-green-500" /> Unit <span className="text-red-400">*</span>
//             </label>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className={dropdownTriggerClass(unit, errors.unit)}>
//                   <span className={unit ? "text-gray-800 font-medium" : "text-gray-400 font-normal"}>
//                     {unit || "Select unit"}
//                   </span>
//                   <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-48 rounded-xl border border-gray-100 shadow-lg p-1">
//                 {unitGroups.map((group, gi) => (
//                   <React.Fragment key={group.label}>
//                     {gi > 0 && <DropdownMenuSeparator className="my-1 bg-gray-100" />}
//                     <DropdownMenuGroup>
//                       <DropdownMenuLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 py-1.5">
//                         {group.label}
//                       </DropdownMenuLabel>
//                       {group.items.map(item => (
//                         <DropdownMenuItem
//                           key={item}
//                           onSelect={() => { setUnit(item); setErrors(p => ({ ...p, unit: "" })) }}
//                           className={`rounded-lg text-sm px-3 py-2 cursor-pointer transition-colors
//                             ${unit === item
//                               ? "bg-green-50 text-green-700 font-semibold"
//                               : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                             }`}
//                         >
//                           {unit === item && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-2 shrink-0" />}
//                           {item}
//                         </DropdownMenuItem>
//                       ))}
//                     </DropdownMenuGroup>
//                   </React.Fragment>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {errors.unit && <p className="text-red-400 text-[11px] mt-1">{errors.unit}</p>}
//           </motion.div>

//           {/* Price */}
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
//             <label className={labelClass}>
//               <IndianRupee className="w-3.5 h-3.5 text-green-500" /> Price (₹) <span className="text-red-400">*</span>
//             </label>
//             <div className="relative">
//               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">₹</span>
//               <input
//                 type="number"
//                 value={price}
//                 placeholder="0.00"
//                 className={inputClass(errors.price) + " pl-8"}
//                 onChange={(e) => { setPrice(e.target.value); setErrors(p => ({ ...p, price: "" })) }}
//               />
//             </div>
//             {errors.price && <p className="text-red-400 text-[11px] mt-1">{errors.price}</p>}
//           </motion.div>
//         </div>

//         {/* Image Upload */}
//         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }} className="mb-5">
//           <label className={labelClass}>
//             <ImageIcon className="w-3.5 h-3.5 text-green-500" /> Product Image <span className="text-red-400">*</span>
//           </label>

//           <AnimatePresence mode="wait">
//             {!preview ? (
//               <motion.div
//                 key="drop"
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                 onDrop={handleDrop}
//                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
//                 onDragLeave={() => setIsDragging(false)}
//                 onClick={() => fileInputRef.current?.click()}
//                 className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
//                   ${isDragging ? "border-green-400 bg-green-50" : errors.image ? "border-red-300 bg-red-50/20" : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/40"}`}
//               >
//                 <div className="flex items-center gap-4 px-6 py-5">
//                   <motion.div
//                     animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
//                     className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors
//                       ${isDragging ? "bg-green-100 border-green-300" : "bg-white border-gray-200"}`}
//                   >
//                     <Upload className={`w-5 h-5 ${isDragging ? "text-green-500" : "text-gray-400"}`} />
//                   </motion.div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-700">{isDragging ? "Drop it here!" : "Drag & drop image"}</p>
//                     <p className="text-xs text-gray-400 mt-0.5">or <span className="text-green-500 underline underline-offset-2 font-medium">browse files</span> · PNG, JPG, WEBP up to 10MB</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="prev"
//                 initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
//                 className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
//               >
//                 <div className="flex items-center gap-4 p-3">
//                   <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-1.5 mb-0.5">
//                       <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
//                       <p className="text-sm font-semibold text-gray-800 truncate">{backendImage?.name}</p>
//                     </div>
//                     <p className="text-xs text-gray-400">{backendImage ? (backendImage.size / 1024).toFixed(1) + " KB" : ""}</p>
//                     <button onClick={() => fileInputRef.current?.click()} className="text-xs text-green-600 font-medium mt-1 hover:underline">
//                       Change image
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => { setPreview(null); setBackendImage(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
//                     className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
//                   >
//                     <X className="w-3 h-3 text-red-500" />
//                   </button>
//                 </div>
//                 <div className="h-1 w-full bg-gray-100">
//                   <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full bg-green-400 rounded-full" />
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//           {errors.image && <p className="text-red-400 text-[11px] mt-1">{errors.image}</p>}
//         </motion.div>

//         {/* Divider */}
//         <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-5" />

//         {/* Submit */}
//         <motion.button
//           onClick={handleSubmit}
//           disabled={loading}
//           whileTap={{ scale: 0.98 }}
//           whileHover={{ scale: 1.01 }}
//           className="w-full py-3 rounded-xl font-bold text-sm text-white
//             bg-linear-to-r from-green-500 to-emerald-500
//             hover:from-green-400 hover:to-emerald-400
//             shadow-[0_4px_20px_-4px_rgba(34,197,94,0.5)]
//             disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
//         >
//           {loading ? (
//             <span className="flex items-center justify-center gap-2">
//               <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//               </svg>
//               Adding item...
//             </span>
//           ) : (
//             <span className="flex items-center justify-center gap-2">
//               <PlusCircle className="w-4 h-4" /> Add to Inventory
//             </span>
//           )}
//         </motion.button>
//       </motion.div>

//       {/* Success Toast */}
//       <AnimatePresence>
//         {success && (
//           <motion.div
//             initial={{ opacity: 0, y: 20, x: "-50%" }}
//             animate={{ opacity: 1, y: 0, x: "-50%" }}
//             exit={{ opacity: 0, y: 10, x: "-50%" }}
//             className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-white border border-green-200 px-5 py-3 rounded-2xl shadow-xl shadow-green-100/60"
//           >
//             <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
//               <CheckCircle2 className="w-4 h-4 text-green-600" />
//             </div>
//             <span className="text-sm font-semibold text-gray-800">Grocery item added!</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <style>{`
//         input[type=number]::-webkit-inner-spin-button,
//         input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
//         input[type=number] { -moz-appearance: textfield; }
//       `}</style>
//     </div>
//   )
// }

// export default AddGrocery






