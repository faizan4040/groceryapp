'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  ShoppingBag, User, Search, Box, LogOut, LocateFixed, MapPin, X, Loader2,
  Menu, ChevronDown, Truck, HelpCircle, ArrowRight,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import CartSidebar from '@/app/user/cartsidebar/page'
import { SPICE_CATEGORIES, SpiceArt } from '@/components/SpiceArt'
import Logo from '@/components/BrandLogo'

/* ─────────────────────────── types & constants ─────────────────────────── */

interface NavUser {
  _id: unknown
  name: string
  email: string
  mobile?: string
  role: 'user' | 'deliveryBoy' | 'admin'
  image?: string
}

interface SearchProduct {
  _id: string
  name: string
  category?: string
  price?: number
  unit?: string
  image?: string
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/#shop', dropdown: true },
  { label: 'Recipes', href: '/blog' },
  { label: 'About', href: '/aboutus' },
  { label: 'Contact', href: '/contactus' },
]

const DEFAULT_LOCATION = 'Select your location'

/* ─────────────────────────────── Search ─────────────────────────────── */

function SearchBox({ autoFocus = false, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<SearchProduct[] | null>(null)
  const [loading, setLoading] = useState(false)

  const ensureProducts = async () => {
    if (products || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (autoFocus) ensureProducts() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || !products) return []
    return products
      .filter((p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query, products])

  const go = (id: string) => {
    setQuery('')
    onNavigate?.()
    router.push(`/products/${id}`)
  }

  return (
    <div className="relative">
      <form
        onSubmit={(e) => { e.preventDefault(); if (results[0]) go(results[0]._id) }}
        className="flex items-center bg-white rounded-full border border-brown-200 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/15 transition"
      >
        <Search size={18} className="ml-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={ensureProducts}
          placeholder="Search garam masala, haldi, lal mirch…"
          className="flex-1 min-w-0 bg-transparent py-3 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          aria-label="Search products"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="p-1 mr-1 text-neutral-400 hover:text-neutral-700" aria-label="Clear search">
            <X size={16} />
          </button>
        )}
        <button type="submit" className="m-1 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition cursor-pointer">
          Search
        </button>
      </form>

      {query.trim() && (
        <div className="mt-2 bg-white rounded-2xl border border-brown-100 shadow-xl overflow-hidden">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-neutral-500">
              <Loader2 size={16} className="animate-spin text-red-600" /> Searching…
            </div>
          )}
          {!loading && results.length === 0 && (
            <p className="px-4 py-4 text-sm text-neutral-500">No masala found for “{query}”.</p>
          )}
          {!loading && results.map((p) => (
            <button
              key={p._id}
              onClick={() => go(p._id)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-brown-50 transition cursor-pointer"
            >
              <span className="w-11 h-11 rounded-lg bg-brown-50 overflow-hidden shrink-0 isolate">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.image && <img src={p.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-neutral-900 truncate">{p.name}</span>
                <span className="block text-xs text-neutral-500 capitalize truncate">{p.category}{p.unit ? ` · ${p.unit}` : ''}</span>
              </span>
              {p.price != null && <span className="text-sm font-bold text-red-600">₹{p.price}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────── Location picker ──────────────────────────── */

function LocationPicker({ location, onSave }: { location: string; onSave: (address: string) => void }) {
  const [open, setOpen] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const save = (address: string) => {
    onSave(address)
    setOpen(false); setQuery(''); setResults([])
  }

  const detect = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return }
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(`/api/reverse-location?lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          if (data?.display_name) save(data.display_name)
        } catch (err) {
          console.error('Location detect error:', err)
        } finally { setDetecting(false) }
      },
      () => { setDetecting(false); alert('Could not retrieve your location. Please allow location access.') },
    )
  }

  const search = async (value: string) => {
    setQuery(value)
    if (value.length < 3) { setResults([]); return }
    try {
      const res = await fetch(`/api/location?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (err) { console.error('Search error:', err) }
  }

  const short = location === DEFAULT_LOCATION ? location : location.split(',').slice(0, 2).join(', ')

  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 text-left text-sm cursor-pointer"
        aria-expanded={open}
      >
        <MapPin size={16} className="text-red-600 shrink-0" />
        <span className="text-neutral-500">Deliver to</span>
        <span className="font-semibold text-neutral-900 truncate max-w-52">{short}</span>
        <ChevronDown size={14} className={`shrink-0 text-neutral-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2.5">
              <button
                onClick={detect} disabled={detecting}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-50 hover:bg-red-100 transition disabled:opacity-60 cursor-pointer"
              >
                {detecting ? <Loader2 size={18} className="text-red-600 animate-spin" /> : <LocateFixed size={18} className="text-red-600" />}
                <span className="font-semibold text-sm text-neutral-900">{detecting ? 'Detecting…' : 'Use my current location'}</span>
              </button>
              <input
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="Or search area, street, city…"
                className="w-full border border-brown-200 rounded-xl py-2.5 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              {results.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-xl border border-brown-100 bg-white divide-y divide-brown-50">
                  {results.map((item: any) => (
                    <button key={item.place_id} onClick={() => save(item.display_name)} className="flex items-start gap-2.5 w-full text-left px-3 py-2.5 hover:bg-brown-50 transition cursor-pointer">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-red-500" />
                      <span className="text-sm text-neutral-700 leading-snug">{item.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────────────────────── Avatar ───────────────────────────────── */

function Avatar({ user, size = 36 }: { user: NavUser | null; size?: number }) {
  return (
    <span
      className="rounded-full overflow-hidden bg-red-600 text-white flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {user?.image
        ? <Image src={user.image} alt={user.name} width={size} height={size} className="object-cover w-full h-full" />
        : user?.name
          ? <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
          : <User size={size * 0.5} />}
    </span>
  )
}

/* ───────────────────────────────── Navbar ───────────────────────────────── */

/**
 * @param overlay  true on the home page: the header floats transparent over the
 *                 hero video and turns solid black once the page is scrolled.
 */
const Navbar = ({ user, overlay = false }: { user?: NavUser; overlay?: boolean }) => {
  const pathname = usePathname()
  const reduxUser = useSelector((state: RootState) => state.user.userData)
  const currentUser: NavUser | null = (user as NavUser) ?? (reduxUser as NavUser | null) ?? null

  const [accountOpen, setAccountOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLLIElement>(null)

  const cartItems = useSelector((state: RootState) => state.cart.cartData)
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0)

  const isAdmin = currentUser?.role === 'admin'
  const isDeliveryBoy = currentUser?.role === 'deliveryBoy'

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('deliveryLocation')
      if (saved) setLocation(saved)
    } catch { /* storage unavailable */ }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false)
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSearchOpen(false); setAccountOpen(false); setShopOpen(false); setDrawerOpen(false) }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [])

  useEffect(() => { setDrawerOpen(false); setAccountOpen(false); setShopOpen(false); setSearchOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen || cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen, cartOpen])

  const saveLocation = (address: string) => {
    try { localStorage.setItem('deliveryLocation', address) } catch { /* ignore */ }
    setLocation(address)
  }

  const isActive = (href: string) => (href === '/' ? pathname === '/' : !href.startsWith('/#') && pathname.startsWith(href))
  const roleLabel = currentUser?.role === 'deliveryBoy' ? 'Delivery Partner' : currentUser?.role

  // admins have their own panel header
  if (isAdmin) return <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

  const solid = !overlay || scrolled || searchOpen
  const iconBtn = 'relative w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 transition cursor-pointer'

  return (
    <>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header
        className={`${overlay ? 'fixed' : 'sticky'} top-0 inset-x-0 z-50 transition-all duration-300 ${
          solid ? 'bg-neutral-950/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className={`w-[95%] max-w-[1600px] mx-auto px-2 flex items-center gap-4 transition-all duration-300 ${solid ? 'h-16 md:h-[72px]' : 'h-18 md:h-24'}`}>
          <Logo />

          {/* centre nav — desktop */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-3 mx-auto">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href)
              const cls = `relative flex items-center gap-1 px-3 py-2 text-[15px] font-medium transition ${active ? 'text-white' : 'text-white/75 hover:text-white'}`
              const underline = active && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-red-600" />

              if (l.dropdown) {
                return (
                  <li key={l.label} ref={shopRef} className="relative">
                    <button onClick={() => setShopOpen((o) => !o)} className={`${cls} cursor-pointer`} aria-expanded={shopOpen}>
                      {l.label} <ChevronDown size={15} className={`transition ${shopOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {shopOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[520px] bg-brown-50 rounded-2xl shadow-2xl p-3 grid grid-cols-3 gap-1"
                        >
                          {SPICE_CATEGORIES.map((c) => (
                            <Link key={c.name} href={c.href} onClick={() => setShopOpen(false)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-white transition">
                              <span className="w-16 h-10">{c.image ? <img src={c.image} alt="" className="w-full h-full object-contain" /> : <SpiceArt kind={c.kind} colors={c.colors} id={`nav-${c.name}`} />}</span>
                              <span className="text-xs font-semibold text-neutral-800 text-center">{c.name}</span>
                            </Link>
                          ))}
                          <Link href="/#shop" onClick={() => setShopOpen(false)} className="col-span-3 mt-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-950 hover:bg-red-600 text-white text-sm font-semibold transition">
                            Shop all products <ArrowRight size={15} />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                )
              }
              return (
                <li key={l.label}>
                  <Link href={l.href} className={cls}>{l.label}{underline}</Link>
                </li>
              )
            })}
          </ul>

          {/* right icons */}
          <div className="ml-auto lg:ml-0 flex items-center gap-0.5 md:gap-1.5">
            {!isDeliveryBoy && (
              <button onClick={() => setSearchOpen((o) => !o)} className={iconBtn} aria-label={searchOpen ? 'Close search' : 'Open search'}>
                {searchOpen ? <X size={21} /> : <Search size={21} />}
              </button>
            )}

            <div ref={accountRef} className="relative hidden sm:block">
              {currentUser ? (
                <button onClick={() => setAccountOpen((p) => !p)} className={iconBtn} aria-label="Account menu">
                  <Avatar user={currentUser} size={30} />
                </button>
              ) : (
                <Link href="/login" className={iconBtn} aria-label="Login">
                  <User size={21} />
                </Link>
              )}

              <AnimatePresence>
                {accountOpen && currentUser && (
                  <motion.div
                    initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-white shadow-2xl rounded-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 bg-brown-50">
                      <Avatar user={currentUser} size={42} />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-neutral-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
                        {roleLabel && <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wide">{roleLabel}</span>}
                      </div>
                    </div>
                    <div className="p-1.5">
                      {!isDeliveryBoy && (
                        <Link href="/user/my-orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brown-50 text-neutral-800 text-sm transition">
                          <Box size={16} className="text-red-600" /> My Orders
                        </Link>
                      )}
                      <Link href="/track" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brown-50 text-neutral-800 text-sm transition">
                        <Truck size={16} className="text-red-600" /> Track Order
                      </Link>
                      <div className="h-px bg-brown-100 my-1.5 mx-2" />
                      <button
                        onClick={() => { setAccountOpen(false); signOut({ callbackUrl: '/' }) }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-600 hover:text-white text-red-600 text-sm font-medium transition cursor-pointer"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isDeliveryBoy && (
              <button onClick={() => setCartOpen(true)} className={iconBtn} aria-label={`Cart, ${totalItems} items`}>
                <ShoppingBag size={21} />
                {mounted && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold ring-2 ring-neutral-950"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </button>
            )}

            <button onClick={() => setDrawerOpen(true)} className={`${iconBtn} lg:hidden`} aria-label="Open menu">
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* search panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden bg-brown-50 border-t border-white/10"
            >
              <div className="w-[95%] max-w-3xl mx-auto px-2 py-5 space-y-4">
                <SearchBox autoFocus onNavigate={() => setSearchOpen(false)} />
                <LocationPicker location={location} onSave={saveLocation} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-neutral-950 text-white z-70 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
                <Logo />
                <button onClick={() => setDrawerOpen(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <Avatar user={currentUser} size={42} />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{currentUser ? `Hi, ${currentUser.name}` : 'Welcome, Guest'}</p>
                  {currentUser
                    ? <p className="text-xs text-white/50 truncate capitalize">{roleLabel}</p>
                    : <Link href="/login" className="text-xs text-red-400 font-semibold">Login / Register →</Link>}
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-3">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-medium transition ${isActive(l.href) ? 'text-white bg-white/10' : 'text-white/75 hover:bg-white/5'}`}
                  >
                    {l.label}
                    {isActive(l.href) ? <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> : <ArrowRight size={15} className="opacity-40" />}
                  </Link>
                ))}

                <p className="px-3 pt-5 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Shop by category</p>
                <div className="grid grid-cols-3 gap-2 px-1">
                  {SPICE_CATEGORIES.map((c) => (
                    <Link key={c.name} href={c.href} onClick={() => setDrawerOpen(false)} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-brown-50 text-neutral-900">
                      <span className="w-12 h-8">{c.image ? <img src={c.image} alt="" className="w-full h-full object-contain" /> : <SpiceArt kind={c.kind} colors={c.colors} id={`dr-${c.name}`} />}</span>
                      <span className="text-[10px] font-semibold text-center leading-tight">{c.name}</span>
                    </Link>
                  ))}
                </div>

                {!isDeliveryBoy && (
                  <div className="mt-5 mx-1 p-3 rounded-xl bg-brown-50">
                    <LocationPicker location={location} onSave={saveLocation} />
                  </div>
                )}

                <div className="mt-4 space-y-0.5">
                  {currentUser && !isDeliveryBoy && (
                    <Link href="/user/my-orders" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 text-sm">
                      <Box size={17} className="text-red-500" /> My Orders
                    </Link>
                  )}
                  <Link href="/track" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 text-sm">
                    <Truck size={17} className="text-red-500" /> Track Order
                  </Link>
                  <Link href="/faqs" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/80 text-sm">
                    <HelpCircle size={17} className="text-red-500" /> Help & FAQs
                  </Link>
                </div>
              </nav>

              <div className="p-4 border-t border-white/10">
                {currentUser ? (
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full border border-white/20 hover:bg-red-600 hover:border-red-600 text-sm font-semibold transition cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                ) : (
                  <Link href="/login" className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-sm font-semibold transition">
                    <User size={16} /> Login / Register
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
