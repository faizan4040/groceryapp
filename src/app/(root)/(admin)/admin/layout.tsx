// "use client";

// import { AppSidebar } from "@/components/admin/app-sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { usePathname } from "next/navigation";
// import {
//   ChevronRight,
//   Home,
//   Bell,
//   Search,
//   Settings,
//   User,
//   LogOut,
//   ChevronDown,
// } from "lucide-react";
// import { useState, useEffect, useRef } from "react";
// import { useSession, signOut } from "next-auth/react";
// import Link from "next/link";

// /* ─────────────────────────────────────────
//    Breadcrumbs
// ───────────────────────────────────────── */
// function Breadcrumbs() {
//   const pathname = usePathname();
//   const segments = pathname.split("/").filter(Boolean);

//   return (
//     <nav className="flex items-center gap-1.5 text-xs">
//       <Home size={12} className="text-gray-400" />
//       {segments.map((seg, i) => {
//         const isLast = i === segments.length - 1;
//         const label =
//           seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
//         return (
//           <span key={i} className="flex items-center gap-1.5">
//             <ChevronRight size={11} className="text-gray-300" />
//             <span
//               className={
//                 isLast
//                   ? "text-green-600 font-semibold"
//                   : "text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-150"
//               }
//             >
//               {label}
//             </span>
//           </span>
//         );
//       })}
//     </nav>
//   );
// }

// /* ─────────────────────────────────────────
//    Page title
// ───────────────────────────────────────── */
// function PageTitle() {
//   const pathname = usePathname();
//   const segments = pathname.split("/").filter(Boolean);
//   const last = segments[segments.length - 1] || "dashboard";
//   return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, " ");
// }

// /* ─────────────────────────────────────────
//    TopBar Right
// ───────────────────────────────────────── */
// function TopBarRight() {
//   const { data: session } = useSession();
//   const user = session?.user as any;
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const notifRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClick(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
//         setDropdownOpen(false);
//       if (notifRef.current && !notifRef.current.contains(e.target as Node))
//         setNotifOpen(false);
//     }
//     document.addEventListener("mousedown", handleClick);
//     return () => document.removeEventListener("mousedown", handleClick);
//   }, []);

//   const initials = user?.name
//     ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
//     : "AD";

//   return (
//     <div className="flex items-center gap-2 shrink-0">

//       {/* Search */}
//       <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-56 group transition-all duration-300 hover:border-green-400/60 focus-within:border-green-500 focus-within:bg-white focus-within:shadow-sm focus-within:shadow-green-500/10">
//         <Search size={13} className="text-gray-400 group-focus-within:text-green-500 transition-colors shrink-0" />
//         <input
//           placeholder="Search anything…"
//           className="bg-transparent text-xs text-gray-600 placeholder:text-gray-400 outline-none w-full"
//         />
//         <kbd className="text-[9px] text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono shrink-0 shadow-sm">
//           ⌘K
//         </kbd>
//       </div>

//       {/* Notification Bell */}
//       <div ref={notifRef} className="relative">
//         <button
//           onClick={() => { setNotifOpen((p) => !p); setDropdownOpen(false); }}
//           className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 active:scale-95"
//         >
//           <Bell size={16} />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white animate-pulse" />
//         </button>

//         {notifOpen && (
//           <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//             <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
//               <p className="text-sm font-bold text-gray-800">Notifications</p>
//               <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-200">
//                 3 new
//               </span>
//             </div>
//             {[
//               { msg: "New order #4821 received", time: "2m ago", dot: "bg-green-500", icon_bg: "bg-green-50" },
//               { msg: "Low stock: Organic Apples", time: "15m ago", dot: "bg-amber-400", icon_bg: "bg-amber-50" },
//               { msg: "User report submitted", time: "1h ago", dot: "bg-blue-400", icon_bg: "bg-blue-50" },
//             ].map((n, i) => (
//               <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors cursor-pointer group border-b border-gray-50 last:border-0">
//                 <div className={`w-8 h-8 ${n.icon_bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
//                   <div className={`w-2 h-2 ${n.dot} rounded-full`} />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{n.msg}</p>
//                   <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
//                 </div>
//               </div>
//             ))}
//             <div className="px-4 py-2.5 text-center bg-gray-50/60">
//               <button className="text-[11px] text-green-600 hover:text-green-700 font-semibold transition-colors">
//                 View all notifications →
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Settings */}
//       <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 active:scale-95">
//         <Settings size={16} />
//       </button>

//       {/* Divider */}
//       <div className="w-px h-6 bg-gray-200 mx-1" />

//       {/* Profile Dropdown */}
//       <div ref={dropdownRef} className="relative">
//         <button
//           onClick={() => { setDropdownOpen((p) => !p); setNotifOpen(false); }}
//           className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200"
//         >
//           <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-md shadow-green-500/25">
//             {initials}
//             <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
//           </div>
//           <div className="text-left hidden lg:block">
//             <p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name || "Admin"}</p>
//             <p className="text-[10px] text-gray-400 leading-tight">Administrator</p>
//           </div>
//           <ChevronDown
//             size={13}
//             className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
//           />
//         </button>

//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//             {/* Header */}
//             <div className="px-4 py-4 bg-linear-to-br from-green-50 to-emerald-50/50 border-b border-gray-100 flex items-center gap-3">
//               <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg shadow-green-500/20">
//                 {initials}
//               </div>
//               <div className="min-w-0">
//                 <p className="text-sm font-bold text-gray-800 truncate">{user?.name || "Admin"}</p>
//                 <p className="text-[11px] text-gray-500 truncate">{user?.email || "admin@email.com"}</p>
//               </div>
//             </div>

//             <div className="p-1.5">
//               {[
//                 { icon: User, label: "My Profile", desc: "View & edit your profile", href: "/admin/profile" },
//                 { icon: Settings, label: "Settings", desc: "Preferences & config", href: "/admin/settings" },
//               ].map(({ icon: Icon, label, desc, href }) => (
//                 <Link
//                   key={label}
//                   href={href}
//                   onClick={() => setDropdownOpen(false)}
//                   className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-all duration-150"
//                 >
//                   <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-green-600 group-hover:bg-green-50 transition-all shrink-0">
//                     <Icon size={14} />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
//                     <p className="text-[10px] text-gray-400">{desc}</p>
//                   </div>
//                   <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
//                 </Link>
//               ))}
//             </div>

//             <div className="mx-3 border-t border-gray-100" />

//             <div className="p-1.5">
//               <button
//                 onClick={() => signOut({ callbackUrl: "/login" })}
//                 className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 group transition-all duration-150"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-100 transition-all shrink-0">
//                   <LogOut size={14} />
//                 </div>
//                 <div className="flex-1 text-left">
//                   <p className="text-[13px] font-semibold text-gray-600 group-hover:text-red-500 transition-colors">Sign out</p>
//                   <p className="text-[10px] text-gray-400">End your session</p>
//                 </div>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────
//    ADMIN LAYOUT
// ───────────────────────────────────────── */
// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-[#f4f6fb]">

//         {/* ── SIDEBAR ── */}
//         <AppSidebar />

//         {/* ── RIGHT COLUMN ── */}
//         <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>

//           {/* ── TOP NAVBAR ── */}
//           <header className="h-16 bg-white/90 border-b border-gray-100 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 gap-4 shadow-sm shadow-gray-100/80">
//             {/* LEFT */}
//             <div className="flex items-center gap-3 min-w-0">
//               <SidebarTrigger className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 active:scale-95 shrink-0" />
//               <div className="w-px h-5 bg-gray-200 shrink-0" />
//               <div className="hidden sm:flex">
//                 <Breadcrumbs />
//               </div>
//             </div>
//             {/* RIGHT */}
//             <TopBarRight />
//           </header>

//           {/* ── PAGE HEADER ── */}
//           <div className={`px-7 pt-7 pb-5 transition-all duration-500 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
//             <div className="flex items-end justify-between gap-4">
//               <div>
//                 <p className="text-[11px] font-bold tracking-[0.12em] text-green-600/70 uppercase mb-1.5">
//                   FreshCart Admin
//                 </p>
//                 <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">
//                   <PageTitle />
//                 </h1>
//               </div>

//               {/* Live badge */}
//               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 shrink-0 shadow-sm">
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//                 <span className="text-[11px] font-bold text-green-700 tracking-wide">LIVE</span>
//               </div>
//             </div>

//             {/* Gradient divider */}
//             <div className="mt-5 h-px bg-linear-to-r from-green-400/40 via-gray-200 to-transparent" />
//           </div>

//           {/* ── MAIN CONTENT ── */}
//           <main className={`flex-1 px-7 pb-8 transition-all duration-500 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
//             {children}
//           </main>

//           {/* ── FOOTER ── */}
//           <footer className="px-7 py-4 border-t border-gray-100 bg-white/70 flex items-center justify-between">
//             <p className="text-[11px] text-gray-400">
//               © {new Date().getFullYear()} FreshCart. All rights reserved.
//             </p>
//             <p className="text-[11px] text-gray-400">
//               v2.4.1 &nbsp;·&nbsp;
//               <span className="text-green-600 font-semibold">All systems operational</span>
//             </p>
//           </footer>

//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }