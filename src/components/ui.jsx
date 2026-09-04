import { useEffect, useMemo, useRef, useState } from 'react'

export function Shape({
  type = 'circle',
  color = '#2563eb',
  className = '',
  opacity = 1,
  zIndex = 0,
}) {
  const base = `pointer-events-none absolute ${className}`
  const style = { opacity, zIndex }

  if (type === 'triangle') {
    return (
      <svg className={base} viewBox="0 0 100 100" aria-hidden="true" style={style}>
        <polygon points="50,10 90,90 10,90" fill={color} />
      </svg>
    )
  }

  if (type === 'star') {
    return (
      <svg className={base} viewBox="0 0 100 100" fill={color} aria-hidden="true" style={style}>
        <path d="M50 5 L61 38 L95 38 L67 59 L77 92 L50 72 L23 92 L33 59 L5 38 L39 38 Z" />
      </svg>
    )
  }

  if (type === 'diamond') {
    return (
      <svg className={base} viewBox="0 0 100 100" fill={color} aria-hidden="true" style={style}>
        <polygon points="50,5 95,50 50,95 5,50" />
      </svg>
    )
  }

  if (type === 'square') {
    return <div className={`${base} rounded-2xl`} style={{ ...style, background: color }} />
  }

  if (type === 'semicircle') {
    return (
      <svg className={base} viewBox="0 0 100 100" aria-hidden="true" style={style}>
        <path d="M5,95 A45,45 0 0 1 95,95 Z" fill={color} />
      </svg>
    )
  }

  if (type === 'zigzag') {
    return (
      <svg className={base} viewBox="0 0 100 100" fill={color} aria-hidden="true" style={style}>
        <polygon points="50,100 10,55 35,55 25,20 55,50 80,50 55,100" />
      </svg>
    )
  }

  return <div className={`${base} rounded-full`} style={{ ...style, background: color }} />
}

export function GameButton({
  children,
  className = '',
  color = '#2563eb',
  variant = 'solid',
  ...props
}) {
  const isSolid = variant === 'solid'
  return (
    <button
      type="button"
      {...props}
      className={`relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-extrabold text-lg tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98] ${
        isSolid
          ? 'text-white'
          : 'bg-white text-primary border-2 border-line hover:border-primary'
      } ${className}`}
      style={isSolid ? { backgroundColor: color } : undefined}
    >
      {children}
    </button>
  )
}

export function GameCard({ children, color = '#ffffff', className = '' }) {
  return (
    <div
      className={`rounded-2xl border-2 border-line ${className}`}
      style={{ backgroundColor: color, boxShadow: 'var(--shadow-card)' }}
    >
      {children}
    </div>
  )
}

export function AnimatedNumber({
  value,
  duration = 800,
  className = '',
  ...props
}) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const fromRef = useRef(value)

  useEffect(() => {
    const from = fromRef.current
    const change = value - from
    if (change === 0) {
      setDisplay(value)
      return
    }

    const update = (ts) => {
      if (startRef.current === null) startRef.current = ts
      const p = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + change * eased))
      if (p < 1) requestAnimationFrame(update)
      else fromRef.current = value
    }
    requestAnimationFrame(update)
    return () => {}
  }, [value, duration])

  return (
    <span className={className} {...props}>
      {display}
    </span>
  )
}

const CONFETTI_COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899']

export function Confetti({ count = 60 }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    setPieces(
      Array.from({ length: count }).map(() => {
        const size = 6 + Math.random() * 8
        return {
          left: `${Math.random() * 100}%`,
          width: size,
          height: size * (1 + Math.random()),
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          delay: `${Math.random() * 0.7}s`,
          duration: `${2 + Math.random() * 1.6}s`,
          rotate: `${Math.random() * 360}deg`,
        }
      }),
    )
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 animate-confetti"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `rotate(${p.rotate})`,
            transformOrigin: 'center',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  )
}

const PAGE_BLOB_VARIANTS = {
  home: [
    { color: '124, 58, 237', pos: '-left-24 top-10', size: 'h-72 w-72' },
    { color: '13, 148, 136', pos: '-right-24 top-1/3', size: 'h-80 w-80' },
    { color: '124, 58, 237', pos: 'bottom-0 left-1/3', size: 'h-64 w-64' },
  ],
  quiz: [
    { color: '37, 99, 235', pos: '-left-20 top-1/4', size: 'h-80 w-80' },
    { color: '37, 99, 235', pos: '-right-20 bottom-10', size: 'h-72 w-72' },
  ],
  flashcard: [
    { color: '13, 148, 136', pos: '-left-20 top-24', size: 'h-80 w-80' },
    { color: '13, 148, 136', pos: '-right-24 top-1/2', size: 'h-72 w-72' },
  ],
  groupsort: [
    { color: '217, 119, 6', pos: '-left-24 top-10', size: 'h-80 w-80' },
    { color: '37, 99, 235', pos: '-right-24 top-1/3', size: 'h-72 w-72' },
    { color: '217, 119, 6', pos: 'bottom-0 left-1/2', size: 'h-64 w-64' },
  ],
}

export function PageBlobs({ variant = 'home', children }) {
  const blobs = PAGE_BLOB_VARIANTS[variant] || PAGE_BLOB_VARIANTS.home
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {blobs.map((b, i) => (
          <div
            key={i}
            className={`absolute ${b.pos} ${b.size} rounded-full blur-3xl`}
            style={{ backgroundColor: `rgba(${b.color}, 0.10)` }}
          />
        ))}
      </div>
      <FloatingElements variant={variant} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

const FLOAT_SETS = {
  home: ['💊', '💊', '🔬', '⭐', '🧬', '❤️'],
  quiz: ['💊', '⭐', '💡'],
  flashcard: ['🃏', '💊', '💡'],
  groupsort: ['🧩', '💊', '⭐'],
}

const FLOAT_POS = [
  { left: '4%', top: '12%', size: 'text-6xl', opacity: 0.12, dur: 18, delay: 0 },
  { left: '88%', top: '16%', size: 'text-5xl', opacity: 0.16, dur: 22, delay: 2.4 },
  { left: '7%', top: '68%', size: 'text-5xl', opacity: 0.15, dur: 20, delay: 4.8 },
  { left: '84%', top: '72%', size: 'text-6xl', opacity: 0.12, dur: 24, delay: 1.2 },
  { left: '18%', top: '88%', size: 'text-4xl', opacity: 0.18, dur: 16, delay: 3.6 },
  { left: '78%', top: '40%', size: 'text-4xl', opacity: 0.16, dur: 20, delay: 6.0 },
]

export function FloatingElements({ variant = 'home' }) {
  const set = FLOAT_SETS[variant] || FLOAT_SETS.home
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      {set.map((emoji, i) => {
        const pos = FLOAT_POS[i % FLOAT_POS.length]
        return (
          <span
            key={i}
            className={`floating-element absolute ${pos.size} leading-none select-none animate-float-spin`}
            style={{
              left: pos.left,
              top: pos.top,
              opacity: pos.opacity,
              animationDuration: `${pos.dur}s`,
              animationDelay: `${pos.delay}s`,
            }}
          >
            {emoji}
          </span>
        )
      })}
    </div>
  )
}
