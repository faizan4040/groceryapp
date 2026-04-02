'use client'

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import { blogs } from "@/app/data/blogs";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import blogBanner from "@/constants/images/blog_banner.png";

const categories = [
  "Everything",
  "Technology",
  "Culture",
  "Humans of Blinkit",
  "Newsroom",
  "Sustainability",
];

export default function Blog() {
  const [active, setActive] = useState("Everything");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredBlogs =
    active === "Everything"
      ? blogs
      : blogs.filter((b) => b.category === active);

  const featuredBlog = filteredBlogs[0];
  const restBlogs = filteredBlogs.slice(1);

  return (
    <div className="bg-[#FAFAF8] min-h-screen font-sans">

      {/* ─── HERO BANNER ─────────────────────────────────── */}
      <div className="relative h-[70vh] md:h-[70vh] overflow-hidden">

        <Image
          src={blogBanner}
          alt="Blog Banner"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
          style={{ transform: "scale(1.02)" }}
        />

        {/* Cinematic gradient overlay — dark bottom, clear top */}
        <div
          className="absolute inset-0"
          // style={{
          //   background:
          //     "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.72) 100%)",
          // }}
        />

        {/* Subtle film-grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-14 md:pb-20 px-6 md:px-16 max-w-7xl mx-auto w-full left-0 right-0">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow label */}
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{ color: "#A8E6C5", letterSpacing: "0.18em" }}
            >
              Stories & Insights
            </span>

            {/* <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] max-w-3xl"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "-0.02em" }}
            >
              Ideas worth reading.
            </h1> */}

            {/* <p className="mt-5 text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
              Perspectives from people building the future of quick commerce — one delivery at a time.
            </p> */}
          </motion.div>
        </div>
      </div>

      {/* ─── STICKY CATEGORY FILTER ───────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="relative whitespace-nowrap px-4 py-4 text-sm font-medium transition-colors duration-200 focus:outline-none"
              style={{
                color: active === cat ? "#111" : "#6B7280",
              }}
            >
              {cat}
              {/* Active indicator line */}
              {active === cat && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-500 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── BLOG CONTENT ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">

        <AnimatePresence mode="wait">
          {filteredBlogs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 text-gray-400"
            >
              <p className="text-5xl mb-4">✦</p>
              <p className="text-lg font-medium text-gray-500">Nothing here yet</p>
              <p className="text-sm mt-1">Try a different category</p>
            </motion.div>
          ) : (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >

              {/* ── FEATURED BLOG (first card, full-width) ── */}
              {featuredBlog && (
                <a
                  href={`/blog/${featuredBlog.slug}`}
                  className="group block mb-14 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
                >
                  <div className="grid md:grid-cols-2">
                    {/* Image — left half */}
                    <div className="relative h-64 md:h-auto min-h-80 overflow-hidden">
                      <Image
                        src={featuredBlog.image}
                        alt={featuredBlog.title}
                        fill
                        quality={95}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Category pill */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          {featuredBlog.category}
                        </span>
                      </div>
                    </div>

                    {/* Text — right half */}
                    <div className="p-8 md:p-12 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-3 tracking-wide uppercase">
                          Featured
                        </p>
                        <h2
                          className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-emerald-700 transition-colors"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {featuredBlog.title}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                          {featuredBlog.excerpt}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Author avatar placeholder */}
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                            {featuredBlog.author?.charAt(0) ?? "A"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{featuredBlog.author}</p>
                            <p className="text-xs text-gray-400">{featuredBlog.date} · {featuredBlog.readTime}</p>
                          </div>
                        </div>

                        <span className="text-sm font-semibold text-emerald-600 group-hover:underline">
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {/* ── REST OF BLOGS — 3-column grid ── */}
              {restBlogs.length > 0 && (
                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                  {restBlogs.map((blog, i) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                    >
                      <BlogCard blog={blog} />
                    </motion.div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── NEWSLETTER CTA ───────────────────────────────── */}
      <div className="mt-8 mx-4 md:mx-8 mb-12 rounded-3xl overflow-hidden relative">
        {/* Dark editorial background */}
        <div className="bg-[#0D1F14] px-8 md:px-16 py-16 md:py-20 relative">
          {/* Decorative circle */}
          <div
            className="absolute right-0 top-0 w-80 h-80 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute left-0 bottom-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)", transform: "translate(-40%, 40%)" }}
          />

          <div className="max-w-xl relative z-10">
            <span className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              Newsletter
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Stay in the loop.
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
              Our best stories, delivered weekly. No spam — we promise. Unsubscribe anytime.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 text-emerald-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">You're subscribed! Welcome aboard.</span>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-500 border border-white/10 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                />
                <button
                  onClick={() => email && setSubscribed(true)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30 whitespace-nowrap"
                >
                  Subscribe →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}