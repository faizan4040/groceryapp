'use client'

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function BlogCard({ blog }: any) {
  return (
    <Link href={`/blog/${blog.slug}`} className="block group">
      
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
      >
        {/* 🔥 IMAGE */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            {blog.category}
          </span>

          {/* Title on Image */}
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-white text-lg font-bold leading-snug line-clamp-2">
              {blog.title}
            </h2>
          </div>
        </div>

        {/* 📄 CONTENT */}
        <div className="p-5">

          {/* Meta */}
          <p className="text-xs text-gray-500">
            {blog.author} • {blog.date} • {blog.readTime}
          </p>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mt-3 line-clamp-3 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Read More */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-500 transition-colors">
              Read More →
            </span>

            <span className="text-xs text-gray-400">
              {blog.category}
            </span>
          </div>

        </div>
      </motion.div>

    </Link>
  );
}