import { useCallback, useEffect, useRef, useState } from 'react'

function ImageCarousel({ images, interval = 4000 }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)

  const total = images.length

  const goTo = (index) => {
    setCurrent((index + total) % total)
  }

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (paused || isModalOpen || total <= 1) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [paused, isModalOpen, interval, next, total])

  // Handle keyboard arrows in fullscreen modal
  useEffect(() => {
    if (!isModalOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Escape') setIsModalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, next, prev])

  // Touch swipe handling
  const handleTouchStart = (e) => {
    setPaused(true)
    touchStartXRef.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    setPaused(false)
    if (!touchStartXRef.current || !touchEndXRef.current) return
    const distance = touchStartXRef.current - touchEndXRef.current
    const minSwipeDistance = 40
    if (distance > minSwipeDistance) {
      next()
    } else if (distance < -minSwipeDistance) {
      prev()
    }
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  const arrowClass =
    'absolute top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/90 text-ink flex items-center justify-center shadow-card border border-[#cfd9e6] transition-all hover:scale-110 active:scale-95 z-10'

  return (
    <>
      <div
        className="relative w-full bg-slate-900 select-none group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides container with 16:9 aspect ratio */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {images.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 cursor-pointer ${
                i === current ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={src}
                alt={`อินโฟกราฟิกหน้า ${i + 1}`}
                draggable={false}
                className="w-full h-full object-contain"
              />
            </div>
          ))}

          {/* Top Info Bar */}
          <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <span className="rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs sm:text-sm font-extrabold text-white border border-white/20">
              {current + 1} / {total}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
              className="pointer-events-auto rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs sm:text-sm font-extrabold text-white border border-white/20 transition-all hover:bg-black/80 hover:scale-105 active:scale-95 flex items-center gap-1.5"
              aria-label="ขยายภาพเต็มจอ"
            >
              <span>🔍</span>
              <span className="hidden xs:inline sm:inline">แตะเพื่อขยาย</span>
            </button>
          </div>

          {/* Left arrow */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="รูปก่อนหน้า"
            className={`${arrowClass} left-2 sm:left-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="รูปถัดไป"
            className={`${arrowClass} right-2 sm:right-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(i)
                }}
                aria-label={`ไปรูปที่ ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-[#0d9488]' : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-2 sm:p-6 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Header */}
          <div
            className="w-full max-w-5xl flex items-center justify-between py-2 px-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-extrabold backdrop-blur-md">
              รูปที่ {current + 1} จาก {total}
            </span>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold text-lg hover:bg-white/30 transition-all active:scale-95"
              aria-label="ปิด"
            >
              ✕
            </button>
          </div>

          {/* Modal Image Container */}
          <div
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[current]}
              alt={`อินโฟกราฟิกหน้า ${current + 1}`}
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Modal Navigation Arrows */}
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white text-2xl font-bold backdrop-blur-md hover:bg-black/80 transition-all active:scale-95"
              aria-label="ก่อนหน้า"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white text-2xl font-bold backdrop-blur-md hover:bg-black/80 transition-all active:scale-95"
              aria-label="ถัดไป"
            >
              ›
            </button>
          </div>

          {/* Modal Footer hint */}
          <div
            className="py-2 text-center text-xs text-white/70"
            onClick={(e) => e.stopPropagation()}
          >
            ปัดซ้าย-ขวา หรือกดลูกศรเพื่อเลื่อนดูรูปถัดไป · แตะพื้นหลังหรือปุ่ม ✕ เพื่อปิด
          </div>
        </div>
      )}
    </>
  )
}

export default ImageCarousel
