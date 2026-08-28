import { useState } from 'react'
import { Link } from 'react-router-dom'
import flashcards from '../data/flashcards'
import { Confetti, PageBlobs } from '../components/ui'

const CARD_COLORS = ['#2563eb', '#0d9488', '#7c3aed', '#2563eb', '#0d9488']
const CARD_SHADOWS = ['#1d4ed8', '#0f766e', '#6d28d9', '#1d4ed8', '#0f766e']

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
  const [showConfetti, setShowConfetti] = useState(false)

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
      if (answeredList.length + 1 === total) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    }
    setTimeout(() => {
      if (correct) setIsFlipped(true)
    }, 500)
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
        ? 'bg-accent text-white shadow-[0_5px_0_#0f766e]'
        : 'bg-danger text-white shadow-[0_5px_0_#b91c1c]'
    }

    if (isYesChoice === correctIsYes && result === true) {
      return 'bg-accent text-white shadow-[0_5px_0_#0f766e] ring-4 ring-green-300/50 animate-pop'
    }
    if (choice === selected && result === false) {
      return 'bg-danger text-white shadow-[0_5px_0_#b91c1c] opacity-70 animate-shake'
    }
    if (selected !== null && result !== null && choice !== selected) {
      return 'bg-white text-accent border-2 border-accent opacity-100'
    }
    return 'bg-primary text-white shadow-[0_5px_0_#1d4ed8]'
  }

  return (
    <PageBlobs variant="flashcard">
      {showConfetti && <Confetti />}
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="mb-4 flex animate-fade-up items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-extrabold hover:opacity-80 transition-opacity"
            >
              ← Flash Card
            </Link>
            <span className="rounded-xl bg-white px-4 py-2 font-extrabold shadow-card border-2 border-[#cfd9e6]">
              ⭐ เฉลยแล้ว <span className="tabular-nums">{answeredList.length}</span> / {total}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-3 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-extrabold uppercase tracking-wide text-primary">
                เลเวลการ์ด
              </span>
              <span className="text-sm font-extrabold text-ink">
                การ์ด <span className="tabular-nums">{currentIndex + 1}</span> / {total}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-black/10 shadow-card">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((currentIndex + 1) / total) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>

          {/* 3D flip card */}
          <div
            className="relative mb-8 w-full animate-fade-up"
            style={{ perspective: '1500px', animationDelay: '0.1s' }}
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
                className="absolute inset-0 flex flex-col rounded-3xl p-8"
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: color,
                  boxShadow: `0 8px 0 ${shadow}`,
                  border: '4px solid #ffffff',
                }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">
                    🃏 ข้อความ · ตอบจริงหรือเท็จ
                  </span>
                  <span className="rounded-lg bg-white/20 px-3 py-1 font-extrabold text-white">
                    #{currentIndex + 1}
                  </span>
                </div>

                <div className="my-6 flex flex-1 items-center justify-center">
                  <p className="text-center text-2xl font-extrabold leading-snug text-white drop-shadow-sm sm:text-3xl">
                    {card.statement}
                  </p>
                </div>

                <div className="text-center">
                  {canGoNext ? (
                    <span className="inline-block rounded-full bg-white/25 px-4 py-2 font-extrabold text-white">
                      ✅ ตอบถูกแล้ว · แตะการ์ดเพื่อดูเฉลย
                    </span>
                  ) : (
                    <span className="inline-block text-sm font-bold text-white/90">
                      กด จริง หรือ เท็จ เพื่อตอบ
                    </span>
                  )}
                </div>
              </div>

              {/* Back: Answer */}
              <div
                className="absolute inset-0 flex flex-col rounded-3xl p-8 text-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: shade(color, -18),
                  boxShadow: `0 8px 0 ${shadow}`,
                  border: '4px solid #ffffff',
                }}
              >
                <span className="mb-5 text-xs font-extrabold uppercase tracking-wide text-white/80">
                  💡 คำเฉลย
                </span>
                <h2 className="mb-4 text-4xl font-extrabold text-white">
                  {card.answer === 'yes' ? 'จริง ✅' : 'เท็จ ❌'}
                </h2>
                <p className="flex-1 leading-relaxed text-white/95 overflow-y-auto">
                  {card.explanation}
                </p>
                {canGoNext && (
                  <span className="mt-5 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white">
                    แตะการ์ดเพื่อพลิกกลับ
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* True/False buttons */}
          {!isFlipped && (
            <div key={currentIndex} className="grid animate-fade-up grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => checkAnswer('yes')}
                disabled={result === true}
                className={`rounded-2xl px-4 py-5 text-2xl font-extrabold text-white transition-all duration-200 active:translate-y-0 active:scale-[0.98] ${buttonStyle('yes')}`}
              >
                ✅ จริง
              </button>
              <button
                type="button"
                onClick={() => checkAnswer('no')}
                disabled={result === true}
                className={`rounded-2xl px-4 py-5 text-2xl font-extrabold text-white transition-all duration-200 active:translate-y-0 active:scale-[0.98] ${buttonStyle('no')}`}
              >
                ❌ เท็จ
              </button>
            </div>
          )}

          {result === false && !isFlipped && (
            <div key={result} className="mt-4 animate-pop text-center">
              <p className="font-extrabold text-danger">❌ ยังไม่ถูกต้อง ลองอีกครั้ง</p>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="mt-2 font-extrabold text-primary underline"
              >
                พลิกการ์ดดูเฉลย →
              </button>
            </div>
          )}

          {/* Round prev/next arrow buttons */}
          {isFlipped && (
            <div className="mt-2 flex animate-fade-up items-center justify-center gap-6">
              <button
                type="button"
                onClick={prevCard}
                className="flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.95]"
                style={{ backgroundColor: '#2563eb', boxShadow: '0 5px 0 #1d4ed8' }}
                aria-label="ก่อนหน้า"
              >
                ←
              </button>
              <span className="rounded-full bg-white px-5 py-2 font-extrabold shadow-card border-2 border-[#cfd9e6]">
                {card.answer === 'yes' ? 'จริง' : 'เท็จ'} · ไปต่อ
              </span>
              <button
                type="button"
                onClick={nextCard}
                className="flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.95]"
                style={{ backgroundColor: '#0d9488', boxShadow: '0 5px 0 #0f766e' }}
                aria-label="ถัดไป"
              >
                →
              </button>
            </div>
          )}

          {!isFlipped && result === null && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(0)
                  flipBack()
                }}
                className="font-extrabold text-primary underline"
              >
                ↺ เริ่มใหม่
              </button>
            </div>
          )}
        </div>
      </div>
    </PageBlobs>
  )
}

export default FlashCardPage
