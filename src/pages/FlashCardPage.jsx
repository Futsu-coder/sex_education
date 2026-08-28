import { useState } from 'react'
import { Link } from 'react-router-dom'
import flashcards from '../data/flashcards'

function FlashCardPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [answeredList, setAnsweredList] = useState([])

  const total = flashcards.length
  const card = flashcards[currentIndex]

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
    if (selected === null) {
      return 'border-white text-white bg-white/20 hover:bg-white/30'
    }
    const isYesChoice = choice === 'yes'
    const correctIsYes = card.answer === 'yes'

    if (isYesChoice === correctIsYes && result === true) {
      return 'bg-white text-[#26890c]'
    }
    if (choice === selected && result === false) {
      return 'bg-white/10 text-white opacity-50'
    }
    if (result === false && choice !== selected) {
      return 'bg-white/10 text-white opacity-50'
    }
    return 'border-white text-white bg-white/20'
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-white font-bold hover:underline">
            ← Flash Card
          </Link>
          <span className="text-white font-extrabold">
            ⭐ {answeredList.length} / {total}
          </span>
        </div>

        {/* Progress */}
        <div className="h-5 bg-black/25 rounded-full mb-7 overflow-hidden">
          <div
            className="h-full transition-all duration-300 bg-[#d89e00]"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {/* Card area */}
        <div className="text-center mb-6">
          <span className="text-white font-extrabold text-xl">
            การ์ด {currentIndex + 1} / {total}
          </span>
        </div>

        {/* 3D flip card */}
        <div
          className="relative w-full min-h-[280px] [perspective:1500px] mb-8"
          onClick={() => canGoNext && setIsFlipped((f) => !f)}
        >
          <div
            className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* Front: Statement */}
            <div className="absolute inset-0 bg-white rounded-3xl p-8 flex flex-col [backface-visibility:hidden]" style={{ boxShadow: '0 8px 0 #26890c' }}>
              <span className="text-xs font-extrabold uppercase tracking-wide text-[#1368ce] mb-6">
                🃏 ข้อความ · ตอบจริงหรือเท็จ
              </span>
              <p className="text-2xl font-bold text-ink leading-relaxed">
                {card.statement}
              </p>
              <div className="mt-auto flex items-center gap-2">
                {canGoNext ? (
                  <span className="text-[#26890c] font-extrabold">✅ ตอบถูกแล้ว</span>
                ) : (
                  <span className="text-muted text-sm">กด จริง หรือ เท็จ เพื่อตอบ</span>
                )}
              </div>
            </div>

            {/* Back: Explanation */}
            <div className="absolute inset-0 bg-[#1368ce] text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]" style={{ boxShadow: '0 8px 0 #0d4a99' }}>
              <span className="text-xs font-extrabold uppercase tracking-wide text-white/80 mb-6">
                💡 คำเฉลย
              </span>
              <h2 className="text-3xl font-extrabold mb-3">
                {card.answer === 'yes' ? 'จริง ✅' : 'เท็จ ❌'}
              </h2>
              <p className="text-white/90 leading-relaxed">{card.explanation}</p>
              {canGoNext && (
                <span className="mt-6 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full">
                  คลิกการ์ดเพื่อไปต่อ
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Answer buttons */}
        {!isFlipped && (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => checkAnswer('yes')}
              disabled={result === true}
              className={`px-4 py-4 rounded-2xl text-white font-extrabold text-2xl transition-all active:translate-y-1 ${buttonStyle('yes')}`}
              style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}
            >
              จริง
            </button>
            <button
              type="button"
              onClick={() => checkAnswer('no')}
              disabled={result === true}
              className={`px-4 py-4 rounded-2xl text-white font-extrabold text-2xl transition-all active:translate-y-1 ${buttonStyle('no')}`}
              style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}
            >
              เท็จ
            </button>
          </div>
        )}

        {result === false && !isFlipped && (
          <div className="mt-4 text-center">
            <p className="text-white font-bold">❌ ยังไม่ถูกต้อง ลองอีกครั้ง</p>
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="mt-2 text-white font-bold underline"
            >
              พลิกการ์ดดูเฉลย →
            </button>
          </div>
        )}

        {/* Controls */}
        {isFlipped && (
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={prevCard}
              className="flex-1 bg-white text-ink font-bold px-4 py-3 rounded-2xl transition-all active:translate-y-1 active:shadow-none"
              style={{ boxShadow: '0 5px 0 rgba(0,0,0,0.2)' }}
            >
              ← ก่อน
            </button>
            <button
              type="button"
              onClick={nextCard}
              className="flex-1 bg-[#26890c] text-white font-bold px-4 py-3 rounded-2xl transition-all active:translate-y-1 active:shadow-none"
              style={{ boxShadow: '0 5px 0 #1b6008' }}
            >
              ถัดไป →
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
              className="text-white font-bold underline"
            >
              ↺ เริ่มใหม่
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlashCardPage
