import Link from 'next/link'

export const BRAND = { first: 'Lazzat', second: 'Bits' }

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label={`${BRAND.first}${BRAND.second} home`}>
      {/* chilli mark */}
      <svg viewBox="0 0 32 32" className="w-7 h-7 md:w-8 md:h-8 text-red-600 group-hover:rotate-[-8deg] transition-transform" aria-hidden>
        <path fill="currentColor" d="M22.5 6.5c-1.8-.4-3.2.5-3.9 1.6-.3-.7-.9-1.6-2-2.1l-.8 1.4c.8.4 1.3 1.1 1.4 1.8-5 1.2-7.6 6-9.3 10.3-1 2.5-2.4 5-4.6 6.6 4.3.9 9.6-.5 13.6-4.4 3.5-3.4 6.4-8.4 5.6-15.2z" />
        <path fill="#4E8A3A" d="M22.5 6.5c.4-1.7 1.6-3 3.4-3.5l.4 1.5c-1.2.4-2 1.2-2.3 2.4z" />
      </svg>
      <span className="font-serif text-[22px] md:text-[26px] leading-none text-white tracking-tight">
        {BRAND.first}<span className="text-red-500">{BRAND.second}</span>
      </span>
    </Link>
  )
}
