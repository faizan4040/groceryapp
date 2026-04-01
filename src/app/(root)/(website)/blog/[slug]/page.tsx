import { blogs } from "@/app/data/blogs";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function BlogDetails({ params }: any) {
  const blog = blogs.find((b) => b.slug === params.slug);

  if (!blog) return notFound();

  const related = blogs.filter((b) => b.slug !== blog.slug).slice(0, 3);

  return (
    <div className="bg-[#FAFAF8] min-h-screen font-sans">

      {/* ─── HERO BANNER ──────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[65vh] md:h-[78vh] overflow-hidden">

        {/*
          IMAGE QUALITY FIX:
          • quality={100} — disables compression, renders crisp
          • sizes="100vw" — tells Next.js to serve the full-viewport-width image
          • priority — preloads immediately, no lazy-load blur
          • object-cover + object-center — fills frame without distortion
          If image still looks soft, check next.config.js and ensure
          `images.minimumCacheTTL` and no `loader` is overriding quality.
        */}
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Cinematic dark vignette — barely touches top, heavy at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.80) 100%)",
          }}
        />

        {/* TOP NAV BAR inside banner */}
        <div className="absolute top-0 left-0 right-0 px-6 md:px-14 py-6 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All stories
          </Link>

          {/* Category badge */}
          <span className="text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-sm px-3 py-1.5 rounded-full uppercase tracking-wider">
            {blog.category}
          </span>
        </div>

        {/* Bottom content — title and meta */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-14 pb-10 md:pb-16 max-w-5xl">
          <p className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            {blog.date} · {blog.readTime}
          </p>

          <h1
            className="text-3xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] max-w-3xl"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: "-0.02em" }}
          >
            {blog.title}
          </h1>

          {/* Author row */}
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {blog.author?.charAt(0) ?? "A"}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{blog.author}</p>
              <p className="text-white/50 text-xs">Author</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ARTICLE BODY ─────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-14 md:py-20">

        {/* Decorative first letter */}
        <article>
          {/*
            Render content — if it's a long string with newlines,
            split into paragraphs for rich typography.
          */}
          {blog.content
            ? blog.content.split("\n\n").map((para, idx) => (
                <p
                  key={idx}
                  className={`text-gray-700 leading-[1.9] mb-7 ${
                    idx === 0
                      ? "text-lg md:text-xl first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-gray-900"
                      : "text-base md:text-lg"
                  }`}
                  style={{ fontFamily: idx === 0 ? "'Georgia', serif" : "inherit" }}
                >
                  {para.trim()}
                </p>
              ))
            : (
              <p className="text-gray-500 italic">Content coming soon...</p>
            )}
        </article>

        {/* Tags / share row */}
        <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Filed under</span>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-100">
              {blog.category}
            </span>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium">Share</span>
            {["Twitter", "LinkedIn"].map((s) => (
              <button
                key={s}
                className="text-xs border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 px-3 py-1.5 rounded-full transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RELATED ARTICLES ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="bg-white border-t border-gray-100 py-16 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">

            {/* Section header */}
            <div className="flex items-center gap-4 mb-10">
              <h2
                className="text-xl md:text-2xl font-bold text-gray-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                More to read
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
              <Link
                href="/blog"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 whitespace-nowrap"
              >
                View all →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-7">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg transition-shadow duration-400"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Category chip */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card text */}
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">{item.author} · {item.date}</p>
                    <h3
                      className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    )}
                    <p className="text-emerald-600 text-sm font-medium mt-4 group-hover:underline">
                      Read story →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER CTA ───────────────────────────────────────────────────────── */}
      <div className="bg-[#0D1F14] text-white text-center py-16 px-6">
        <p className="text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          Enjoyed this?
        </p>
        <h3
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Subscribe to our newsletter
        </h3>
        <p className="text-gray-400 text-sm mb-7">
          Get fresh stories delivered to your inbox every week.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30"
        >
          Explore all stories
        </Link>
      </div>

    </div>
  );
}