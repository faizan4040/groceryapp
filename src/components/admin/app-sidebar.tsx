"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  LogOut,
  Bell,
  Search,
  Settings,
  User,
  ChevronRight,
  Zap,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { adminSidebarMenu } from "@/lib/adminSidebarMenu";
import { useSession, signOut } from "next-auth/react";

/* ─────────────────────────────────────────────────────────
   TOP BAR
───────────────────────────────────────────────────────── */
export function TopBar() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 gap-4 sticky top-0 z-30 shadow-sm shadow-gray-100/80">

      {/* ── LEFT: Search ── */}
      <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 w-72 group transition-all duration-300 hover:border-green-400/60 focus-within:border-green-500 focus-within:bg-white focus-within:shadow-sm focus-within:shadow-green-500/10">
        <Search size={14} className="text-gray-400 group-focus-within:text-green-500 transition-colors duration-200 shrink-0" />
        <input
          placeholder="Search anything…"
          className="bg-transparent text-sm text-gray-600 placeholder:text-gray-400 outline-none w-full"
        />
        <kbd className="text-[10px] text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono shrink-0 shadow-sm">
          ⌘K
        </kbd>
      </div>

      {/* ── RIGHT: Notifs + Settings + Profile ── */}
      <div className="flex items-center gap-2">

        {/* Notification Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((p) => !p); setDropdownOpen(false); }}
            className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 active:scale-95"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                <p className="text-sm font-bold text-gray-800">Notifications</p>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-200">
                  3 new
                </span>
              </div>
              {[
                { msg: "New order #4821 received", time: "2m ago", dot: "bg-green-500", icon_bg: "bg-green-50" },
                { msg: "Low stock: Organic Apples", time: "15m ago", dot: "bg-amber-400", icon_bg: "bg-amber-50" },
                { msg: "User report submitted", time: "1h ago", dot: "bg-blue-400", icon_bg: "bg-blue-50" },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group border-b border-gray-50 last:border-0">
                  <div className={`w-8 h-8 ${n.icon_bg} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                    <div className={`w-2 h-2 ${n.dot} rounded-full`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{n.msg}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center bg-gray-50/60">
                <button className="text-[11px] text-green-600 hover:text-green-700 font-semibold transition-colors">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 active:scale-95">
          <Settings size={16} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => { setDropdownOpen((p) => !p); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200"
          >
            {/* Avatar */}
            <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-md shadow-green-500/25">
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-gray-400 leading-tight">Administrator</p>
            </div>
            <ChevronDown
              size={13}
              className={`text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="px-4 py-4 bg-linear-to-br from-green-50 to-emerald-50/50 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg shadow-green-500/20">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "admin@email.com"}</p>
                </div>
              </div>

              {/* Items */}
              <div className="p-1.5">
                {[
                  { icon: User, label: "My Profile", desc: "View & edit your profile", href: "/admin/profile" },
                  { icon: Settings, label: "Settings", desc: "Preferences & config", href: "/admin/settings" },
                ].map(({ icon: Icon, label, desc, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-all duration-150"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-green-600 group-hover:bg-green-50 transition-all shrink-0">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
                      <p className="text-[10px] text-gray-400">{desc}</p>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </Link>
                ))}
              </div>

              <div className="mx-3 border-t border-gray-100" />

              {/* Logout */}
              <div className="p-1.5">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 group transition-all duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-100 transition-all shrink-0">
                    <LogOut size={14} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[13px] font-semibold text-gray-600 group-hover:text-red-500 transition-colors">Sign out</p>
                    <p className="text-[10px] text-gray-400">End your session</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────── */
export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const activeMenus = adminSidebarMenu
      .filter((item) => item.submenu?.some((sub) => sub.url === pathname))
      .map((item) => item.title);
    setOpenMenus(activeMenus);
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((i) => i !== title) : [...prev, title]
    );
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AD";

  return (
    <>
      <style>{`
        [data-sidebar="sidebar"],
        [data-sidebar="sidebar"] > *,
        [data-sidebar="sidebar"][data-mobile="true"] {
          background-color: #ffffff !important;
        }
      `}</style>
    <Sidebar className="bg-white! border-r! border-gray-100! w-60! flex flex-col shadow-sm **:data-sidebar:bg-white! [&_.sidebar-content]:bg-white!">

      {/* ── LOGO ── */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md shadow-green-500/25 shrink-0">
          <Zap size={15} className="text-white fill-white" />
        </div>
        <span className="text-[17px] font-extrabold tracking-tight text-gray-900">
          Fresh<span className="text-green-600">Cart</span>
        </span>
        <span className="ml-auto text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 tracking-widest">
          ADMIN
        </span>
      </div>

      {/* ── SECTION LABEL ── */}
      <p className="px-5 pt-5 pb-2 text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase">
        Main Menu
      </p>

      {/* ── NAV MENU ── */}
      <SidebarContent className="flex-1 overflow-y-auto px-3 pb-3 [&::-webkit-scrollbar]:hidden">
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="p-0">
            <SidebarMenu className="gap-0.5">
              {adminSidebarMenu.map((item, idx) => {
                const isOpen = openMenus.includes(item.title);
                const isActive = pathname === item.url;
                const hasSubActive = item.submenu?.some((s) => s.url === pathname);
                const highlighted = isActive || hasSubActive;

                return (
                  <div
                    key={item.title}
                    className={`transition-all duration-300 ${
                      mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                    }`}
                    style={{ transitionDelay: `${idx * 45}ms` }}
                  >
                    <SidebarMenuItem className="list-none">
                      <SidebarMenuButton
                        onClick={() => item.submenu ? toggleMenu(item.title) : null}
                        asChild={!item.submenu}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm border cursor-pointer
                          transition-all duration-200
                          ${highlighted
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-transparent border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-100"
                          }
                        `}
                      >
                        {item.submenu ? (
                          <div className="flex items-center gap-3 w-full">
                            {/* Icon Box */}
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                              ${highlighted
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                              }`}>
                              <item.icon size={14} />
                            </div>
                            <span className="flex-1 font-semibold text-[13px]">{item.title}</span>
                            <ChevronDown
                              size={13}
                              className={`transition-transform duration-300 ${
                                isOpen ? "rotate-180 text-green-600" : "text-gray-400"
                              }`}
                            />
                          </div>
                        ) : (
                          <Link href={item.url} className="flex items-center gap-3 w-full">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                              ${highlighted
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                              }`}>
                              <item.icon size={14} />
                            </div>
                            <span className="flex-1 font-semibold text-[13px]">{item.title}</span>
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm" />
                            )}
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Submenu — smooth height transition */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="ml-4 pl-4 mt-1 mb-1 border-l-2 border-green-100 space-y-0.5">
                        {item.submenu?.map((sub) => {
                          const isSubActive = pathname === sub.url;
                          return (
                            <Link
                              key={sub.title}
                              href={sub.url}
                              className={`flex items-center gap-2.5 text-[12.5px] px-3 py-2 rounded-lg transition-all duration-150
                                ${isSubActive
                                  ? "bg-green-50 text-green-700 font-semibold"
                                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200
                                ${isSubActive ? "bg-green-500" : "bg-gray-300"}`} />
                              {sub.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── FOOTER PROFILE CARD ── */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-green-500/20">
            {initials}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-gray-800 leading-tight truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight truncate">
              {user?.email || "admin@email.com"}
            </p>
          </div>
          {/* Logout icon */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 active:scale-90 shrink-0"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </Sidebar>
    </>
  );
}