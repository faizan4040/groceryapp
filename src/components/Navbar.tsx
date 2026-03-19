"use client";

import React, { useState, useRef, useEffect } from "react";
import mongoose from "mongoose";
import {
  ShoppingCart,
  User,
  Search,
  Box,
  LogOut,
  LocateFixed,
  MapPin,
  X,
  Loader2,
  Menu,
  PlusCircle,
  List,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";

interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

const Navbar = ({ user }: { user?: IUser }) => {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState("Select your location");
  const [detecting, setDetecting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  /* ── load saved location ── */
  useEffect(() => {
    const saved = localStorage.getItem("deliveryLocation");
    if (saved) setLocation(saved);
  }, []);

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node))
        setLocationOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── prevent body scroll when sidebar open ── */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* ── save location helper ── */
  const saveLocation = (address: string) => {
    localStorage.setItem("deliveryLocation", address);
    setLocation(address);
    setLocationOpen(false);
    setQuery("");
    setResults([]);
  };

  /* ── GPS detect ── */
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/reverse-location?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          saveLocation(data.display_name);
        } catch (err) {
          console.error("Location detect error:", err);
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        alert("Could not retrieve your location. Please allow location access.");
      }
    );
  };

  /* ── search locations ── */
  const searchLocation = async (value: string) => {
    setQuery(value);
    if (value.length < 3) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/location?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  /* ── location display (truncated) ── */
  const shortLocation =
    location === "Select your location"
      ? location
      : location.split(",").slice(0, 2).join(", ");

  const isAdmin = user?.role === "admin";

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-70 md:hidden shadow-2xl flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-green-50">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 font-extrabold text-lg"
                >
                  <div className="bg-green-100 p-1.5 rounded-lg">
                    <ShoppingCart className="text-green-600 w-4 h-4" />
                  </div>
                  Fresh<span className="text-green-600">Cart</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-red-500 flex items-center justify-center shrink-0 shadow">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User size={22} className="text-white" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm text-gray-800 truncate">
                    {user?.name ?? "Guest"}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {user?.email ?? ""}
                  </span>
                  {user?.role && (
                    <span
                      className={`mt-0.5 inline-flex items-center self-start px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        isAdmin
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "deliveryBoy"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role === "deliveryBoy" ? "Delivery Boy" : user.role}
                    </span>
                  )}
                </div>
              </div>

              {/* admin Nav Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">

                {/* Admin-only section */}
                {isAdmin && (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 pt-2 pb-1">
                      Admin
                    </p>
                    <Link
                      href="/admin/add-grocery"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 text-gray-700 text-sm font-medium transition"
                    >
                      <PlusCircle size={17} className="text-green-600 shrink-0" />
                      Add Grocery
                    </Link>
                    <Link
                      href="/admin/view-grocery"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 text-gray-700 text-sm font-medium transition"
                    >
                      <List size={17} className="text-green-600 shrink-0" />
                      View Grocery
                    </Link>
                    <Link
                      href="/admin/manage-orders"
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 text-gray-700 text-sm font-medium transition"
                    >
                      <ClipboardList size={17} className="text-green-600 shrink-0" />
                      Manage Orders
                    </Link>
                    <div className="h-px bg-gray-100 my-2" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 pt-1 pb-1">
                      General
                    </p>
                  </>
                )}

                <Link
                  href="/orders"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-medium transition"
                >
                  <Box size={17} className="text-gray-500 shrink-0" />
                  My Orders
                </Link>
              </nav>

              {/* Logout */}
              <div className="px-3 pb-5 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 text-sm font-medium transition"
                >
                  <LogOut size={17} className="shrink-0" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
         {isAdmin ? (
        <div></div>
          ) : (
            <nav
        className="
          w-[95%] fixed top-3 left-1/2 -translate-x-1/2 z-50
          bg-white shadow-lg rounded-2xl
          px-4 md:px-6
          py-2.5 md:py-3
        "
      >
        {/* ── Single flex row (all screen sizes) ── */}
        <div className="flex items-center justify-between gap-3">

          {/* ────────── LEFT: Hamburger (mobile) + Logo + Location ────────── */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-600 transition"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 font-extrabold text-lg md:text-xl whitespace-nowrap">
              <div className="bg-green-100 p-1.5 md:p-2 rounded-lg">
                <ShoppingCart className="text-green-600 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="hidden sm:inline">
                Fresh<span className="text-green-600">Cart</span>
              </span>
            </Link>

            {/* Location Dropdown */}
            {isAdmin ? (
           <div></div>
          ) : (
             <div ref={locationRef} className="relative">
              <button
                onClick={() => setLocationOpen((p) => !p)}
                className="flex items-center gap-2 hover:bg-gray-50 px-2 md:px-3 py-1.5 md:py-2 rounded-xl transition cursor-pointer max-w-40 sm:max-w-55 md:max-w-none"
                aria-label="Change delivery location"
              >
                <div className="bg-green-100 p-1.5 md:p-2 rounded-full shrink-0">
                  <MapPin size={15} className="text-green-600" />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs md:text-sm font-bold text-black leading-tight">
                    Delivery in 30 min
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold text-gray-500 truncate max-w-30 md:max-w-45">
                    {shortLocation}
                  </span>
                </div>
              </button>

              
              <AnimatePresence>
                {locationOpen && (
                  <motion.div
                    initial={{ y: 8, opacity: 0, scale: 0.97 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 8, opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="
                      absolute top-full mt-3 z-50
                      bg-white border border-gray-100 shadow-2xl rounded-2xl p-4
                      w-[calc(100vw-2rem)] max-w-sm
                      left-0
                      sm:left-auto sm:w-95
                    "
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base text-gray-800">Change Location</h3>
                      <button
                        onClick={() => setLocationOpen(false)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>

                  
                    <button
                      onClick={detectLocation}
                      disabled={detecting}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-green-50 hover:bg-green-100 transition mb-3 disabled:opacity-60"
                    >
                      {detecting ? (
                        <Loader2 size={18} className="text-green-600 animate-spin" />
                      ) : (
                        <LocateFixed size={18} className="text-green-600" />
                      )}
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-sm text-gray-800">
                          {detecting ? "Detecting…" : "Use my current location"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Accurate GPS-based detection
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium">or search</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                   
                    <div className="relative mb-2">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={query}
                        onChange={(e) => searchLocation(e.target.value)}
                        placeholder="Search area, street, city…"
                        className="w-full border border-gray-200 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                      />
                      {query && (
                        <button
                          onClick={() => { setQuery(""); setResults([]); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                   
                    {results.length > 0 && (
                      <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                        {results.map((item: any) => (
                          <button
                            key={item.place_id}
                            onClick={() => saveLocation(item.display_name)}
                            className="flex items-start gap-3 w-full text-left px-3 py-2.5 hover:bg-green-50 transition"
                          >
                            <MapPin size={14} className="mt-0.5 shrink-0 text-green-500" />
                            <span className="text-sm text-gray-700 leading-snug">
                              {item.display_name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {query.length >= 3 && results.length === 0 && (
                      <p className="text-sm text-center text-gray-400 py-3">
                        No results found. Try a different query.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
           
          </div>

          {/* ────────── CENTER: Search bar — desktop only ────────── */}
         {isAdmin ? (
        <div></div>
          ) : (
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input
                  type="text"
                  placeholder="Search for fruits, vegetables, dairy…"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
              </div>
            </div>
          )}
         
          {/* ────────── RIGHT: Role Badge (desktop) + User + Cart ────────── */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">

            {/* Role badge — desktop only */}
            {user?.role && (
              <span
                className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                  isAdmin
                    ? "bg-purple-100 text-purple-700"
                    : user.role === "deliveryBoy"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {user.role === "deliveryBoy" ? "Delivery Boy" : user.role}
              </span>
            )}

            {/* User Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-red-500 rounded-full text-white hover:bg-red-600 transition shadow-sm overflow-hidden"
                aria-label="User menu"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <User size={20} />
                )}
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ y: 8, opacity: 0, scale: 0.97 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 8, opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    {/* Profile Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-red-500 flex items-center justify-center shrink-0">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <User size={22} className="text-white" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-gray-800 truncate">
                          {user?.name ?? "Guest"}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {user?.email ?? ""}
                        </span>
                        {/* Role badge inside dropdown */}
                        {user?.role && (
                          <span
                            className={`mt-1 inline-flex items-center self-start px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                              isAdmin
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "deliveryBoy"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.role === "deliveryBoy" ? "Delivery Boy" : user.role}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Admin links — desktop dropdown */}
                    {isAdmin && (
                      <>
                        <div className="px-3 pt-2 pb-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">
                            Admin
                          </p>
                        </div>
                        <Link
                          href="/admin/manage-orders"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 text-gray-700 text-sm transition"
                        >
                          <ClipboardList size={16} className="text-green-600" />
                          Setting
                        </Link>
                        <div className="h-px bg-gray-100 mx-3 my-1" />
                      </>
                    )}

                    
                    <div className="py-1">
                      <Link
                        href="/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 text-sm transition"
                      >
                        <Box size={16} />
                        My Orders
                      </Link>
                      <button
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-500 text-sm w-full transition"
                        onClick={() => {
                          setOpen(false);
                          signOut({ callbackUrl: "/login" });
                        }}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                    
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
             {isAdmin ? (
            <div></div>
              ) : (
                <button
                  className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={19} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-4.5 min-h-4.5 flex items-center justify-center rounded-full shadow leading-none">
                    0
                  </span>
                </button>
              )}

          </div>
        </div>

        {/* ────────── Mobile Search Bar (below main row) ────────── */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search fruits, vegetables, dairy…"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>
        </div>

      </nav>
          )}
      

      <div className="h-12 md:h-4" />
    </>
  );
};

export default Navbar;