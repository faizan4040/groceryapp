"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { ArrowRight, Play, Star, X } from "lucide-react";
import { RootState } from "@/redux/store";
import { getSocket } from "@/lib/socket";
import { SPICE_CATEGORIES, SpiceArt } from "@/components/SpiceArt";

/* ── Swap these for your own media ──────────────────────────────────────
   BG_VIDEO    plays silently behind the hero (keep it short, ~5–10 MB).
   STORY_VIDEO opens with sound when someone clicks "Watch our story".   */
const BG_VIDEO = "/videos/grocery.mp4";
const STORY_VIDEO = "/videos/grocery.mp4";

const AVATAR_COLORS = ["#C3301C", "#E3A11B", "#6F4425", "#4E8A3A"];

export type Reviewer = { name: string; image?: string };

/** A reviewer's profile photo; falls back to their initial if there is no photo or it fails to load. */
function ReviewerAvatar({ r, i, total }: { r: Reviewer; i: number; total: number }) {
  const [broken, setBroken] = useState(false);
  const showImg = r.image && !broken;
  return (
    <span
      title={r.name}
      className="relative w-10 h-10 md:w-11 md:h-11 rounded-full ring-2 ring-neutral-950 overflow-hidden flex items-center justify-center text-sm font-bold text-white"
      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], zIndex: total - i }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.image} alt={r.name} referrerPolicy="no-referrer" onError={() => setBroken(true)} className="w-full h-full object-cover" />
      ) : (
        r.name.trim().charAt(0).toUpperCase()
      )}
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

/** Rounds a real customer count down to a friendly figure, e.g. 1,284 → "1,200+". */
function formatCount(n: number) {
  const step = n >= 10000 ? 1000 : n >= 1000 ? 100 : 10;
  return `${(Math.floor(n / step) * step).toLocaleString("en-IN")}+`;
}

const Herosection = ({
  customerCount = 0,
  reviewers = [],
  rating = null,
}: {
  customerCount?: number;
  reviewers?: Reviewer[];
  rating?: { avg: number; count: number } | null;
}) => {
  const { userData } = useSelector((state: RootState) => state.user);
  const [storyOpen, setStoryOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userData?._id) return;
    const socket = getSocket();
    socket.emit("identity", userData._id);
    return () => { socket.off("connect"); };
  }, [userData]);

  useEffect(() => {
    if (!storyOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStoryOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [storyOpen]);

  const scrollStrip = () => {
    const el = stripRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <>
      <section className="relative isolate min-h-[100svh] bg-neutral-950 text-white overflow-hidden flex flex-col">
        {/* background video */}
        <video
          autoPlay loop muted playsInline preload="metadata"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
          aria-hidden
        >
          <source src={BG_VIDEO} type="video/mp4" />
        </video>
        {/* darkening for legibility: strong on the left, open on the right */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div className="absolute inset-x-0 top-0 h-40 -z-10 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 -z-10 bg-gradient-to-t from-black/90 to-transparent" />

        {/* copy */}
        <div className="flex-1 flex items-center w-[95%] max-w-[1600px] mx-auto px-2 pt-24 md:pt-28 pb-24 md:pb-32">
          <div className="max-w-xl">
            <motion.p {...fade(0.1)} className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.32em] text-[#E8A48C]">
              Premium <span className="mx-1.5 opacity-60">•</span> Authentic <span className="mx-1.5 opacity-60">•</span> Pure
            </motion.p>

            <motion.h1 {...fade(0.2)} className="font-serif text-[44px] leading-[1.05] sm:text-6xl xl:text-[76px] mt-4 md:mt-5">
              Explore the <br />
              World of <em className="text-red-500 italic">Masala</em>
            </motion.h1>

            <motion.p {...fade(0.32)} className="mt-5 md:mt-6 text-[15px] md:text-lg leading-relaxed text-white/80 max-w-md">
              Handpicked whole spices, ground fresh in small batches — bringing authentic flavour, rich aroma and
              pure goodness to your kitchen.
            </motion.p>

            <motion.div {...fade(0.44)} className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-8">
              <Link
                href="/#shop"
                className="group inline-flex items-center gap-2.5 pl-7 pr-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-900/40 transition"
              >
                Shop Collection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button onClick={() => setStoryOpen(true)} className="group inline-flex items-center gap-3 text-sm font-medium cursor-pointer">
                <span className="relative w-12 h-12 rounded-full border-2 border-white/80 flex items-center justify-center group-hover:bg-white group-hover:text-neutral-950 transition">
                  <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping [animation-duration:2.4s]" />
                  <Play size={18} className="ml-0.5 fill-current" />
                </span>
                Watch Our Story
              </button>
            </motion.div>

            {/* social proof — real reviewers' photos */}
            <motion.div {...fade(0.56)} className="flex items-center gap-4 mt-9 md:mt-10">
              {reviewers.length > 0 && (
                <div className="flex -space-x-3" aria-label="Recent reviewers">
                  {reviewers.map((r, i) => (
                    <ReviewerAvatar key={r.name + i} r={r} i={i} total={reviewers.length} />
                  ))}
                </div>
              )}
              <div className="leading-tight">
                <p className="font-semibold text-base md:text-lg">
                  {customerCount >= 10 ? `${formatCount(customerCount)} home chefs` : "Loved by home chefs"}
                </p>
                <p className="flex items-center gap-1.5 text-xs md:text-sm text-white/65 mt-0.5">
                  {rating ? (
                    <>
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-white font-semibold">{rating.avg}</span>
                      from {rating.count} {rating.count === 1 ? "review" : "reviews"}
                    </>
                  ) : (
                    "Join our masala family"
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </section>

        {/* category strip */}
      <motion.div {...fade(0.7)} className="relative z-10 w-[95%] max-w-[1500px] mx-auto px-2 -mt-14 md:-mt-[70px]">
        <div className="relative flex items-center rounded-2xl md:rounded-3xl bg-[#F6EEE3] text-neutral-900 shadow-2xl shadow-black/25 pr-3 md:pr-5">
          <div ref={stripRef} className="flex-1 flex overflow-x-auto snap-x scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {SPICE_CATEGORIES.map((c, i) => (
              <Link
                key={c.name}
                href={c.href}
                className={`group snap-start shrink-0 w-[34%] sm:w-[25%] lg:w-auto lg:flex-1 flex flex-col items-center gap-1.5 md:gap-2 px-2 py-4 md:py-5 ${
                  i > 0 ? "border-l border-neutral-900/10 lg:border-l-0" : ""
                } relative`}
              >
                {i > 0 && <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-14 w-px bg-neutral-900/10" />}
                <span className="w-20 h-12 md:w-28 md:h-16 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_6px_6px_rgba(0,0,0,0.18)]">
                  {c.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={c.image} alt="" className="w-full h-full object-contain" />
                    : <SpiceArt kind={c.kind} colors={c.colors} id={`hero-${c.name}`} />}
                </span>
                <span className="text-[11px] md:text-sm font-semibold text-center leading-tight group-hover:text-red-600 transition">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
          <button
            onClick={scrollStrip}
            aria-label="More categories"
            className="shrink-0 ml-2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md transition cursor-pointer lg:hidden"
          >
            <ArrowRight size={18} />
          </button>
          <Link
            href="/#shop"
            aria-label="Shop all categories"
            className="hidden lg:flex shrink-0 ml-2 w-11 h-11 rounded-full bg-red-600 hover:bg-red-700 text-white items-center justify-center shadow-md transition"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>

      {/* story video modal */}
      <AnimatePresence>
        {storyOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setStoryOpen(false)}
            role="dialog" aria-modal="true" aria-label="Our story"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video src={STORY_VIDEO} autoPlay controls playsInline className="w-full h-full object-contain" />
              <button
                onClick={() => setStoryOpen(false)}
                aria-label="Close video"
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 text-neutral-950 flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Herosection;
