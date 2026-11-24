import React from "react";
import Image from "next/image";
import Link from "next/link";

/** Full-width brand banner. The artwork already carries its own headline and button,
 *  so the whole banner is one link to the shop. */
export default function PromoBanner() {
  return (
    <section className="w-[95%] max-w-[1600px] mx-auto px-2 mt-8 md:mt-12">
      <Link
        href="/#shop"
        aria-label="Pure spices, real taste — shop now"
        className="group block relative overflow-hidden rounded-[20px] md:rounded-[32px] shadow-xl shadow-black/10"
      >
        <Image
          src="/banners/pure-spices-real-taste.png"
          alt="LazzatBits Masala — Pure spices. Real taste. Kashmiri chilli, turmeric, garam masala and coriander powder."
          width={2172}
          height={724}
          sizes="(max-width: 1700px) 95vw, 1600px"
          className="w-full h-auto group-hover:scale-[1.015] transition-transform duration-700"
        />
      </Link>
    </section>
  );
}
