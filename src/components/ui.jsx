export function Shape({
  type = 'circle',
  color = '#ffffff',
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
    return <div className={`${base} rounded-lg`} style={{ ...style, background: color }} />
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
  color = '#1368ce',
  ...props
}) {
  return (
    <button
      type="button"
      {...props}
      className={`relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-extrabold text-lg uppercase tracking-wide transition-all duration-100 active:translate-y-1 active:shadow-none ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `0 6px 0 ${shade(color, -18)}`,
      }}
    >
      {children}
    </button>
  )
}

export function GameCard({ children, color = '#ffffff', className = '' }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ backgroundColor: color, boxShadow: '0 6px 0 rgba(0,0,0,0.18)' }}
    >
      {children}
    </div>
  )
}

function shade(hex, amt) {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  const r = clamp(((num >> 16) & 0xff) + amt)
  const g = clamp(((num >> 8) & 0xff) + amt)
  const b = clamp((num & 0xff) + amt)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function clamp(v) {
  return Math.max(0, Math.min(255, v))
}
