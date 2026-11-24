import React from "react";

const ITEMS = [
  "Kashmiri Lal Mirch", "Haldi", "Garam Masala", "Dhaniya", "Jeera",
  "Kali Mirch", "Elaichi", "Laung", "Dalchini", "Kasuri Methi",
];

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-[#F2C14E]" aria-hidden>
      <path fill="currentColor" d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
    </svg>
  );
}

/** Thin scrolling band of spice names between the hero and the banner. */
export default function SpiceTicker() {
  const row = (
    <div className="flex items-center gap-6 md:gap-10 pr-6 md:pr-10 shrink-0">
      {ITEMS.map((t) => (
        <React.Fragment key={t}>
          <span className="font-serif italic text-lg md:text-2xl whitespace-nowrap">{t}</span>
          <Star />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="relative mt-10 md:mt-14 bg-red-600 text-white overflow-hidden py-2.5 md:py-3 border-y-2 border-neutral-950" aria-label="Our spices">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row}
        <div aria-hidden className="flex">{row}</div>
      </div>
    </div>
  );
}
