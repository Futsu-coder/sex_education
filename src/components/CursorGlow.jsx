import { useEffect, useRef } from 'react'

function CursorGlow() {
  const glowRef = useRef(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) return

    let raf = null
    let tx = -400
    let ty = -400
    let x = -400
    let y = -400

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }

    const tick = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      if (glow) {
        glow.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[500px] w-[500px] md:block"
      style={{
        background:
          'radial-gradient(circle, rgba(37,99,235,0.10) 0%, rgba(13,148,136,0.06) 40%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  )
}

export default CursorGlow
