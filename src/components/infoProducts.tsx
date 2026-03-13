"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Truck, Zap, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

/* ── Countdown hook ── */
const useCountdown = (targetHours = 5) => {
  const [time, setTime] = useState({ h: targetHours, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: targetHours, m: 59, s: 59 }; // reset
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const Pad = (n: number) => String(n).padStart(2, "0");

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 min-w-12 text-center">
      <span className="text-white font-black text-xl tabular-nums leading-none">
        {Pad(value)}
      </span>
    </div>
    <span className="text-white/50 text-[9px] font-semibold mt-1 tracking-widest uppercase">
      {label}
    </span>
  </div>
);

const Sep = () => (
  <span className="text-white/40 font-black text-lg pb-4 select-none">:</span>
);

/* ═══════════════════════════════════════════════════════ */

const PromoSection = () => {
  const { h, m, s } = useCountdown(5);

  return (
    <section className="w-[94%] mx-auto py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

        {/* ══ CARD 1 — FLASH SALE ══ */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative overflow-hidden rounded-3xl min-h-70 md:min-h-75"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-green-500 to-teal-600" />

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="pointer-events-none absolute top-1/2 right-1/3 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl" />

          {/* Animated "SALE" watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
            <span className="text-[120px] md:text-[160px] font-black text-white/5 tracking-tighter leading-none whitespace-nowrap">
              SALE
            </span>
          </div>

          <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-7 md:p-10 gap-6">

            {/* Left text */}
            <div className="flex-1 text-center md:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 px-3 py-1 rounded-full mb-4">
                <Zap size={12} className="text-yellow-300 fill-yellow-300" />
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">
                  Flash Sale
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Up to{" "}
                <span className="text-yellow-300 drop-shadow-[0_2px_8px_rgba(253,224,71,0.6)]">
                  50% Off
                </span>
                <br />
                <span className="text-white/80 text-xl md:text-2xl font-bold">
                  Organic Dairy
                </span>
              </h2>

              <p className="text-white/70 text-sm mt-2 mb-5 max-w-xs">
                Limited-time offer on premium organic dairy. Don't miss out!
              </p>

              {/* Countdown */}
              <div className="flex items-end gap-2 justify-center md:justify-start mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-white/60 mb-4" />
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-4 mr-1">
                    Ends in
                  </span>
                </div>
                <TimeBox value={h} label="hrs" />
                <Sep />
                <TimeBox value={m} label="min" />
                <Sep />
                <TimeBox value={s} label="sec" />
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-2xl hover:bg-yellow-300 hover:text-green-900 transition-all duration-200 shadow-lg shadow-black/20 text-sm"
              >
                Claim Offer
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Right image */}
            <div className="relative shrink-0">
              <div className="relative w-36 h-36 md:w-44 md:h-44">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-110" />
                <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/promo/dairy.png"
                    alt="Dairy Sale"
                    fill
                    sizes="176px"
                    className="object-contain p-4"
                    priority
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Fallback emoji if image missing */}
                  <span className="text-6xl select-none">🥛</span>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-2.5 py-1 rounded-full shadow-lg shadow-yellow-400/40"
              >
                -50%
              </motion.div>
            </div>

          </div>
        </motion.div>

        {/* ══ CARD 2 — FREE DELIVERY ══ */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative overflow-hidden rounded-3xl min-h-70 md:min-h-75"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-orange-500 via-amber-500 to-rose-500" />

          {/* Decorative */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-52 h-52 bg-white/5 rounded-full" />

          {/* Animated road lines */}
          <div className="pointer-events-none absolute bottom-10 left-0 right-0 flex gap-4 justify-center overflow-hidden opacity-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ x: [-60, 60] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: "linear" }}
                className="w-10 h-1.5 bg-white rounded-full"
              />
            ))}
          </div>

          <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-7 md:p-10 gap-6">

            {/* Left text */}
            <div className="flex-1 text-center md:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/25 px-3 py-1 rounded-full mb-4">
                <Truck size={12} className="text-white" />
                <span className="text-white text-[10px] font-bold tracking-widest uppercase">
                  Limited Offer
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Free
                <br />
                <span className="text-white/85 text-xl md:text-2xl font-bold">
                  Delivery
                </span>{" "}
                <span className="text-yellow-200 drop-shadow-[0_2px_8px_rgba(253,244,100,0.5)]">
                  3× Orders
                </span>
              </h2>

              <p className="text-white/70 text-sm mt-2 mb-6 max-w-xs">
                Place your first 3 orders above $50 and get free delivery every time. Freshness guaranteed.
              </p>

              <motion.button
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-2xl hover:bg-yellow-200 hover:text-orange-700 transition-all duration-200 shadow-lg shadow-black/20 text-sm"
              >
                Order Now
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Right icon block */}
            <div className="relative shrink-0">
              <div className="relative w-36 h-36 md:w-44 md:h-44">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-110" />
                <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center">
                  <motion.div
                    animate={{ x: [-4, 4, -4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Truck size={56} className="text-white drop-shadow-lg md:w-16 md:h-16" />
                  </motion.div>
                </div>
              </div>

              {/* Free badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-3 -right-3 bg-white text-orange-600 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg"
              >
                FREE
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default PromoSection;