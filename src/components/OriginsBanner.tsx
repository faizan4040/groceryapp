import React from "react";
import Image from "next/image";
import Link from "next/link";

/** Edge-to-edge "From farm to table" banner. Height is capped so it stays a strip on wide
 *  screens; the crop sits slightly above centre so the logo and the button both stay in view. */
export default function OriginsBanner() {
  return (
    <section className="mt-16 md:mt-24" aria-label="From farm to table — pure spices, real origins">
      <Link href="/aboutus" className="group block relative w-full h-[min(37.5vw,580px)] overflow-hidden bg-neutral-950">
        <Image
          src="/banners/farm-to-table-pure-origins.png"
          alt="LazzatBits Masala — From farm to table. Pure spices, real origins: 100% natural, farm sourced, lab tested, quality guaranteed."
          fill
          sizes="100vw"
          className="object-cover object-[50%_30%] group-hover:scale-[1.01] transition-transform duration-700"
        />
      </Link>
    </section>
  );
}
