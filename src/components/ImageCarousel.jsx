import { useCallback, useEffect, useState } from 'react'

function ImageCarousel({ images, interval = 4000 }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = images.length

  const goTo = (index) => {
    setCurrent((index + total) % total)
  }

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  const prev = () => {
    setCurrent((c) => (c - 1 + total) % total)
  }

  useEffect(() => {
    if (paused || total <= 1) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [paused, interval, next, total])

  const arrowClass =
    'absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-ink flex items-center justify-center transition-all active:translate-y-[calc(-50%+2px)] active:shadow-none'
  const arrowShadow = { boxShadow: '0 4px 0 rgba(0,0,0,0.25)' }

  return (
    <div
      className="relative w-full bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`สไลด์ ${i + 1}`}
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Left arrow */}
        <button
          type="button"
          onClick={prev}
          aria-label="รูปก่อนหน้า"
          className={`${arrowClass} left-2`}
          style={arrowShadow}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={next}
          aria-label="รูปถัดไป"
          className={`${arrowClass} right-2`}
          style={arrowShadow}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-black/30">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`ไปรูปที่ ${i + 1}`}
              className={`h-3 rounded-full transition-all duration-300 ${
                i === current ? 'w-7 bg-[#d89e00]' : 'w-3 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ImageCarousel
