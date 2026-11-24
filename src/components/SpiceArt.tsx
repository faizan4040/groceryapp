import React from 'react'

/* Small drawn spice illustrations used where we don't have photos yet.
   To use a real photo instead, give the category an `image` in SPICE_CATEGORIES. */

export type SpiceKind = 'mound' | 'peppercorn' | 'seeds' | 'herbs'

export interface SpiceCategory {
  name: string
  href: string
  kind: SpiceKind
  colors: string[] // base colour first, then speck colours
  image?: string
}

export const SPICE_CATEGORIES: SpiceCategory[] = [
  { name: 'Ground Spices', href: '/#shop', kind: 'mound', colors: ['#C3301C', '#8E1B10', '#E2553A'], image: '/spices/ground-spices.png' },
  { name: 'Whole Spices', href: '/#shop', kind: 'peppercorn', colors: ['#3A2A22', '#5A4234'], image: '/spices/whole-spices.png' },
  { name: 'Blended Masala', href: '/#shop', kind: 'mound', colors: ['#B8561F', '#E3A229', '#7A2A12', '#D0442A'], image: '/spices/blended-masala.png' },
  { name: 'Haldi & Turmeric', href: '/#shop', kind: 'mound', colors: ['#E3A11B', '#C27F0B', '#F2C14E'], image: '/spices/haldi.png' },
  { name: 'Seeds', href: '/#shop', kind: 'seeds', colors: ['#D8BF8A', '#B89A62'], image: '/spices/seeds.png' },
  { name: 'Herbs', href: '/#shop', kind: 'herbs', colors: ['#4E8A3A', '#2F6B25'], image: '/spices/herbs.png' },
]

// tiny deterministic random so the art is the same on server and client
const rng = (seed: number) => () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

export function SpiceArt({ kind, colors, id }: { kind: SpiceKind; colors: string[]; id: string }) {
  const r = rng(id.length * 97 + colors[0].charCodeAt(1))
  const [base, ...specks] = colors
  const gid = `g-${id.replace(/\W/g, '')}`

  return (
    <svg viewBox="0 0 120 70" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id={gid} cx="45%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="45%" stopColor={base} stopOpacity="1" />
          <stop offset="100%" stopColor={base} />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="64" rx="50" ry="5" fill="#000" opacity="0.12" />

      {kind === 'mound' && (
        <>
          <path d="M8 63 C 22 40, 40 16, 60 15 C 80 16, 98 40, 112 63 Z" fill={`url(#${gid})`} />
          {Array.from({ length: 34 }, (_, i) => {
            const x = 18 + r() * 84
            const top = 63 - (1 - Math.abs(x - 60) / 50) * 44
            const y = top + 4 + r() * (63 - top - 6)
            return <circle key={i} cx={x} cy={y} r={0.7 + r() * 1.2} fill={specks[i % specks.length] ?? base} opacity={0.9} />
          })}
        </>
      )}

      {kind === 'peppercorn' &&
        Array.from({ length: 30 }, (_, i) => {
          const row = Math.floor(i / 7)
          const inRow = i % 7
          const width = 7 - row
          if (inRow >= width) return null
          const cx = 60 - (width - 1) * 6.5 + inRow * 13 + (r() - 0.5) * 3
          const cy = 57 - row * 10 + (r() - 0.5) * 2
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={6.2} fill={i % 3 ? base : specks[0]} />
              <circle cx={cx - 2} cy={cy - 2} r={1.6} fill="#fff" opacity="0.25" />
            </g>
          )
        })}

      {kind === 'seeds' &&
        Array.from({ length: 46 }, (_, i) => {
          const x = 18 + r() * 84
          const top = 63 - (1 - Math.abs(x - 60) / 48) * 36
          const y = top + r() * (62 - top)
          return (
            <ellipse key={i} cx={x} cy={y} rx={4} ry={2.4} transform={`rotate(${r() * 180} ${x} ${y})`}
              fill={i % 4 ? base : specks[0]} stroke="#8a6d3b" strokeWidth="0.4" />
          )
        })}

      {kind === 'herbs' && (
        <g>
          {[
            { a: -40, s: 1 }, { a: 40, s: 1 }, { a: -10, s: 1.15 }, { a: 15, s: 1.05 }, { a: -70, s: 0.8 }, { a: 70, s: 0.8 },
          ].map(({ a, s }, i) => (
            <g key={i} transform={`translate(60 60) rotate(${a}) scale(${s})`}>
              <path d="M0 0 C -10 -12, -9 -32, 0 -44 C 9 -32, 10 -12, 0 0 Z" fill={i % 2 ? base : specks[0]} />
              <path d="M0 -2 L0 -40" stroke="#fff" strokeOpacity="0.35" strokeWidth="1" />
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}
