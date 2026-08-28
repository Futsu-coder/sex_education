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
          : 'bg-white text-primary ring-1 ring-slate-200 hover:ring-primary'
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
      className={`rounded-2xl ${className}`}
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
  const pieces = useMemo(
    () =>
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
    [count],
  )

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
