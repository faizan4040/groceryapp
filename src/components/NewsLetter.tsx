"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

type State = "idle" | "loading" | "success";

const NewsLetter = () => {
  const [email, setEmail]   = useState("");
  const [state, setState]   = useState<State>("idle");
  const [error, setError]   = useState("");

  const validate = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!validate(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setState("loading");

    try {
    
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Something went wrong.");
      }

      setState("success");
      toast.success("🎉 You're subscribed! Check your inbox.");
      setEmail("");
    } catch (err: any) {
      setState("idle");
      const msg = err?.message || "Failed to subscribe. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <section className="w-[94%] mx-auto mt-24">
      <div className="relative overflow-hidden bg-linear-to-br from-green-50 via-green-100 to-emerald-100 rounded-3xl py-16 px-6 md:px-16 text-center shadow-sm border border-green-200/60">

     
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-green-200 rounded-full opacity-30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-200 rounded-full opacity-30 blur-2xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full opacity-20 blur-3xl" />

      
        {[
          { top: "12%",  left: "8%",  delay: 0 },
          { top: "20%",  right: "10%", delay: 0.4 },
          { bottom: "18%", left: "14%", delay: 0.8 },
          { bottom: "22%", right: "8%", delay: 1.2 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            style={{ position: "absolute", ...pos } as React.CSSProperties}
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: pos.delay, ease: "easeInOut" }}
          >
            <Sparkles size={18} className="text-green-400" />
          </motion.div>
        ))}

     
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-300 rounded-full blur-md opacity-50 scale-110" />
            <div className="relative bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <Mail size={28} className="text-green-600" />
            </div>
          </div>
        </motion.div>

       
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-block bg-green-500/10 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
            Newsletter
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 leading-tight">
            Join & get{" "}
            <span className="text-green-600 relative">
              $20 off
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 6 Q50 0 100 6" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>{" "}
            your first order!
          </h2>

          <p className="text-gray-500 mt-4 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Subscribe for exclusive grocery deals, fresh arrivals, and members-only discounts straight to your inbox.
          </p>
        </motion.div>

       
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-lg mx-auto"
        >
          <AnimatePresence mode="wait">

            {state === "success" ? (
              
              <motion.div
                key="success"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <p className="text-gray-800 font-bold text-lg">You're in! 🎉</p>
                <p className="text-gray-500 text-sm">
                  Check your inbox — your $20 coupon is on its way.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="mt-2 text-green-600 text-sm font-medium hover:underline"
                >
                  Subscribe another email
                </button>
              </motion.div>
            ) : (
             
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                noValidate
              >
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <div className="relative flex-1">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="Enter your email address"
                      disabled={state === "loading"}
                      className={`w-full pl-10 pr-4 py-3.5 rounded-full border bg-white text-sm focus:outline-none focus:ring-2 transition ${
                        error
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-200 focus:ring-green-400"
                      } disabled:opacity-60`}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={state === "loading"}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white px-7 py-3.5 rounded-full font-semibold shadow-md shadow-green-200 transition text-sm whitespace-nowrap"
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </div>

                
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-red-500 text-xs mt-2.5 text-left pl-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            )}

          </AnimatePresence>
        </motion.div>

       
        {state !== "success" && (
          <p className="text-xs text-gray-400 mt-5">
            No spam, ever. Unsubscribe at any time. Read our{" "}
            <a href="/privacy" className="underline hover:text-green-600 transition">
              privacy policy
            </a>
            .
          </p>
        )}

      </div>
    </section>
  );
};

export default NewsLetter;