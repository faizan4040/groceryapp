"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useInView } from "motion/react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Home Chef",
    location: "New York, US",
    image: "/categories/vegetables.jpg",
    text: "Amazing quality products and super fast delivery. The fruits and vegetables are always fresh. I've tried many grocery apps but FreshCart is on another level entirely!",
    rating: 5,
    orders: 48,
    emoji: "",
  },
  {
    name: "Michael Lee",
    role: "Fitness Trainer",
    location: "Los Angeles, US",
    image: "/categories/fruits.jpg",
    text: "Everything is organic and the service is excellent. As a fitness trainer I'm very particular about what I eat — FreshCart never disappoints. The website is super easy to use.",
    rating: 5,
    orders: 112,
    emoji: "",
  },
  {
    name: "Emily Davis",
    role: "Working Mom",
    location: "Chicago, US",
    image: "/categories/dairy.jpg",
    text: "Best grocery experience online. Delivery was within 28 minutes and the packaging was perfect. Saves me so much time every week. Definitely ordering again and again!",
    rating: 5,
    orders: 73,
    emoji: "",
  },
  {
    name: "Raj Patel",
    role: "Food Blogger",
    location: "Austin, US",
    image: "/categories/bakery.jpg",
    text: "The freshness is unmatched. I've written about FreshCart twice on my blog. The range of organic produce they carry is better than any premium supermarket near me.",
    rating: 5,
    orders: 91,
    emoji: "",
  },
  {
    name: "Lena Schmidt",
    role: "Nutritionist",
    location: "Seattle, US",
    image: "/categories/organic.jpg",
    text: "I recommend FreshCart to all my clients. Transparent sourcing, impeccably fresh produce, and the 30-minute delivery is genuinely reliable. A game-changer for healthy living.",
    rating: 5,
    orders: 67,
    emoji: "",
  },
];

/* ── Stat counters at top ── */
const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "98%",  label: "Satisfaction Rate" },
];

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((s) => (
      <Star
        key={s}
        size={14}
        className={s <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
      />
    ))}
  </div>
);

const Customer = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const go = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };
  const prev = () => go((active - 1 + testimonials.length) % testimonials.length);
  const next = () => go((active + 1) % testimonials.length);

  /* auto-advance */
  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [active]);

  const variants = {
    enter: (d: number) => ({ x: d * 60, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:  (d: number) => ({ x: d * -60, opacity: 0, scale: 0.96 }),
  };

  return (
    <section ref={sectionRef} className="w-[94%] mx-auto mt-24">
      <div className="relative overflow-hidden bg-linear-to-br from-gray-950 via-gray-900 to-emerald-950 rounded-3xl py-16 px-6 md:px-14">

        {/* ── Background mesh ── */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-400/8 rounded-full blur-3xl" />
          {/* grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative flex justify-center gap-8 md:gap-16 mb-14"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-black text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="relative text-center mb-12"
        >
          <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-4">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Loved by thousands <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-green-400">
              of happy families
            </span>
          </h2>
        </motion.div>

        {/* ── Main card ── */}
        <div className="relative max-w-3xl mx-auto">

          {/* Big quote mark */}
          <div className="absolute -top-4 -left-2 md:-left-6 text-emerald-500/20 select-none pointer-events-none">
            <Quote size={80} className="fill-current" />
          </div>

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

                {/* Avatar column */}
                <div className="shrink-0 flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-400/30">
                    <Image
                      src={testimonials[active].image}
                      alt={testimonials[active].name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="md:text-center">
                    <p className="font-bold text-white text-sm md:text-base leading-tight">
                      {testimonials[active].name}
                    </p>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">
                      {testimonials[active].role}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {testimonials[active].location}
                    </p>
                  </div>
                </div>

                {/* Text column */}
                <div className="flex-1">
                  <StarRow rating={testimonials[active].rating} />
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-3 italic">
                    "{testimonials[active].text}"
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
                    <span className="text-base">{testimonials[active].emoji}</span>
                    <span className="text-xs text-emerald-300 font-semibold">
                      {testimonials[active].orders} orders completed
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Controls ── */}
          <div className="flex items-center justify-between mt-6">

            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === active ? 24 : 8,
                    height: 8,
                    background: i === active ? "#34d399" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/40 flex items-center justify-center text-gray-300 hover:text-white transition"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/40 flex items-center justify-center text-gray-300 hover:text-white transition"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="relative flex justify-center gap-3 mt-8">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={t.name}
              className={`relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 ring-2 ${
                i === active
                  ? "ring-emerald-400 scale-110 opacity-100"
                  : "ring-transparent opacity-40 hover:opacity-70"
              }`}
            >
              <Image src={t.image} alt={t.name} fill sizes="40px" className="object-cover" />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Customer;