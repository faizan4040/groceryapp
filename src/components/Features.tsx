import React from "react";
import { Leaf, Sprout, FlaskConical, Heart, Package, Smile, type LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Leaf, label: "100% natural spices" },
  { icon: Sprout, label: "Farm sourced" },
  { icon: FlaskConical, label: "No preservatives" },
  { icon: Heart, label: "No artificial colour" },
  { icon: Package, label: "Hygienically packed" },
  { icon: Smile, label: "Seriously tasty" },
];

const Features = () => (
  <section className="w-[95%] max-w-[1600px] mx-auto px-2 mt-8 md:mt-12" aria-label="Why our masala">
    <ul className="grid grid-cols-3 lg:grid-cols-6 gap-y-8">
      {FEATURES.map(({ icon: Icon, label }, i) => (
        <li
          key={label}
          className={`flex flex-col items-center text-center px-3 ${
            i % 3 !== 0 ? "border-l border-brown-200" : ""
          } ${i !== 0 ? "lg:border-l lg:border-brown-200" : "lg:border-l-0"}`}
        >
          <span className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brown-900 text-brown-50 flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-brown-600">
            <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.75} />
          </span>
          <span className="mt-3 max-w-28 text-xs md:text-sm font-semibold leading-snug text-brown-900">
            {label}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

export default Features;
