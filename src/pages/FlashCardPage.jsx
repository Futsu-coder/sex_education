import { useState } from 'react'
import { Link } from 'react-router-dom'
import flashcards from '../data/flashcards'

const CARD_COLORS = ['#7e30e1', '#7e30e1', '#7e30e1', '#7e30e1', '#7e30e1']
const CARD_SHADOWS = ['#511d94', '#511d94', '#511d94', '#511d94', '#511d94']

function shade(hex, amt) {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amt))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (num & 0xff) + amt))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function FlashCardPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [answeredList, setAnsweredList] = useState([])

  const total = flashcards.length
  const card = flashcards[currentIndex]
  const color = CARD_COLORS[currentIndex % CARD_COLORS.length]
  const shadow = CARD_SHADOWS[currentIndex % CARD_SHADOWS.length]

  const checkAnswer = (choice) => {
    if (result !== null) return
    setSelected(choice)
    const correct = choice === card.answer
    setResult(correct)
    if (correct) {
      setAnsweredList((prev) => [...new Set([...prev, currentIndex])])
    }
    setTimeout(() => {
      if (correct) setIsFlipped(true)
    }, 400)
  }

  const flipBack = () => {
    setIsFlipped(false)
    setSelected(null)
    setResult(null)
  }

  const nextCard = () => {
    setCurrentIndex((i) => (i + 1) % total)
    flipBack()
  }

  const prevCard = () => {
    setCurrentIndex((i) => (i - 1 + total) % total)
    flipBack()
  }

  const canGoNext = answeredList.includes(currentIndex)

  const buttonStyle = (choice) => {
    const isYesChoice = choice === 'yes'
    const correctIsYes = card.answer === 'yes'

    if (selected === null) {
      return isYesChoice
        ? 'bg-[#26890c] text-white shadow-[0_6px_0_#1b6008]'
        : 'bg-[#e21b3c] text-white shadow-[0_6px_0_#a6132c]'
    }

    if (isYesChoice === correctIsYes && result === true) {
      return 'bg-[#26890c] text-white shadow-[0_6px_0_#1b6008] ring-4 ring-[#26890c]/30'
    }
    if (choice === selected && result === false) {
      return 'bg-[#e21b3c] text-white shadow-[0_6px_0_#a6132c] opacity-70'
    }
    if (selected !== null && result !== null && choice !== selected) {
      return 'bg-white text-[#26890c] border-2 border-[#26890c] opacity-100'
    }
    return 'bg-[#1368ce] text-white shadow-[0_6px_0_#0d4a99]'
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f4f5fb]">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-extrabold text-[#1368ce] hover:opacity-80 transition-opacity"
            >
              ← Flash Card
            </Link>
            <span className="bg-white rounded-xl px-4 py-2 font-extrabold text-[#1368ce] shadow-[0_4px_0_rgba(0,0,0,0.12)]">
              ⭐ เฉลยแล้ว {answeredList.length} / {total}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-extrabold text-[#7e30e1] uppercase tracking-wide">
                เลเวลการ์ด
              </span>
              <span className="text-sm font-extrabold text-[#1c1c1c]">
                การ์ด {currentIndex + 1} / {total}
              </span>
            </div>
            <div className="h-5 bg-white rounded-full shadow-[0_3px_0_rgba(0,0,0,0.12)] overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / total) * 100}%`, backgroundColor: color, boxShadow: `0 0 0 2px ${shadow}` }}
              />
            </div>
          </div>

          {/* 3D flip card */}
          <div
            className="relative w-full mb-8"
            style={{ perspective: '1500px' }}
          >
            <div
              className="relative min-h-[320px] cursor-pointer transition-transform"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
              }}
              onClick={() => canGoNext && setIsFlipped((f) => !f)}
            >
              {/* Front: Question */}
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col"
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: color,
                  boxShadow: `0 8px 0 ${shadow}`,
                  border: '4px solid #ffffff',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-white/20 text-white text-xs font-extrabold uppercase tracking-wide px-4 py-1.5 rounded-full">
                    🃏 ข้อความ · ตอบจริงหรือเท็จ
                  </span>
                  <span className="bg-white/20 text-white font-extrabold px-3 py-1 rounded-lg">
                    #{currentIndex + 1}
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center my-6">
                  <p className="text-white text-2xl sm:text-3xl font-extrabold leading-snug text-center drop-shadow-sm">
                    {card.statement}
                  </p>
                </div>

                <div className="text-center">
                  {canGoNext ? (
                    <span className="inline-block bg-white/25 text-white font-extrabold px-4 py-2 rounded-full">
                      ✅ ตอบถูกแล้ว · แตะการ์ดเพื่อดูเฉลย
                    </span>
                  ) : (
                    <span className="inline-block text-white/90 text-sm font-bold">
                      กด จริง หรือ เท็จ เพื่อตอบ
                    </span>
                  )}
                </div>
              </div>

              {/* Back: Answer */}
              <div
                className="absolute inset-0 rounded-3xl p-8 flex flex-col text-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: shade(color, -18),
                  boxShadow: `0 8px 0 ${shadow}`,
                  border: '4px solid #ffffff',
                }}
              >
                <span className="text-xs font-extrabold uppercase tracking-wide text-white/80 mb-5">
                  💡 คำเฉลย
                </span>
                <h2 className="text-4xl font-extrabold mb-4 text-white">
                  {card.answer === 'yes' ? 'จริง ✅' : 'เท็จ ❌'}
                </h2>
                <p className="flex-1 text-white/95 leading-relaxed overflow-y-auto">
                  {card.explanation}
                </p>
                {canGoNext && (
                  <span className="mt-5 inline-block bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full">
                    แตะการ์ดเพื่อพลิกกลับ
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* True/False buttons */}
          {!isFlipped && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => checkAnswer('yes')}
                disabled={result === true}
                className={`px-4 py-5 rounded-2xl text-white font-extrabold text-2xl transition-all active:translate-y-1 active:shadow-none ${buttonStyle('yes')}`}
              >
                ✅ จริง
              </button>
              <button
                type="button"
                onClick={() => checkAnswer('no')}
                disabled={result === true}
                className={`px-4 py-5 rounded-2xl text-white font-extrabold text-2xl transition-all active:translate-y-1 active:shadow-none ${buttonStyle('no')}`}
              >
                ❌ เท็จ
              </button>
            </div>
          )}

          {result === false && !isFlipped && (
            <div className="mt-4 text-center">
              <p className="font-extrabold text-[#e21b3c]">❌ ยังไม่ถูกต้อง ลองอีกครั้ง</p>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="mt-2 font-extrabold text-[#1368ce] underline"
              >
                พลิกการ์ดดูเฉลย →
              </button>
            </div>
          )}

          {/* Round prev/next arrow buttons */}
          {isFlipped && (
            <div className="flex items-center justify-center gap-6 mt-2">
              <button
                type="button"
                onClick={prevCard}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all active:translate-y-1 active:shadow-none"
                style={{ backgroundColor: '#1368ce', boxShadow: '0 6px 0 #0d4a99' }}
                aria-label="ก่อนหน้า"
              >
                ←
              </button>
              <span className="bg-white rounded-full px-5 py-2 font-extrabold text-[#1368ce] shadow-[0_4px_0_rgba(0,0,0,0.12)]">
                {card.answer === 'yes' ? 'จริง' : 'เท็จ'} · ไปต่อ
              </span>
              <button
                type="button"
                onClick={nextCard}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all active:translate-y-1 active:shadow-none"
                style={{ backgroundColor: '#26890c', boxShadow: '0 6px 0 #1b6008' }}
                aria-label="ถัดไป"
              >
                →
              </button>
            </div>
          )}

          {!isFlipped && result === null && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(0)
                  flipBack()
                }}
                className="font-extrabold text-[#1368ce] underline"
              >
                ↺ เริ่มใหม่
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FlashCardPage
