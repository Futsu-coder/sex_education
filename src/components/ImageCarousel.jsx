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

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-[280px] sm:h-[360px] md:h-[420px]">
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
      </div>

      {/* Arrow buttons */}
      <button
        type="button"
        onClick={prev}
        aria-label="รูปก่อนหน้า"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-ink shadow flex items-center justify-center text-xl transition-colors"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="รูปถัดไป"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-ink shadow flex items-center justify-center text-xl transition-colors"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`ไปรูปที่ ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-primary' : 'w-2.5 bg-white/70 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
