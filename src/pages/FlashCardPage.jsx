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
      return 'bg-white border-slate-200 text-ink hover:border-primary hover:bg-primary/5'
    }
    if (result === true && choice === card.answer) {
      return 'bg-success border-success text-white'
    }
    if (selected === choice && result === false) {
      return 'bg-danger border-danger text-white'
    }
    return 'bg-white border-slate-100 text-slate-300 cursor-not-allowed'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-primary font-medium hover:underline">
            ← กลับหน้าแรก
          </Link>
          <span className="text-muted">
            การ์ด {currentIndex + 1} / {total} · ตอบถูกแล้ว{' '}
            {answeredList.length}
          </span>
        </div>

        <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        {/* 3D Flip Card */}
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
            <div className="absolute inset-0 bg-card rounded-2xl shadow-sm border-2 border-slate-200 p-8 flex flex-col [backface-visibility:hidden]">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted mb-6">
                ข้อความ · ตอบว่า จริงหรือเท็จ
              </span>
              <p className="text-2xl text-ink leading-relaxed">{card.statement}</p>
              <div className="mt-auto flex items-center gap-2">
                {canGoNext ? (
                  <span className="text-success font-semibold">
                    ✓ ตอบถูกแล้ว
                  </span>
                ) : (
                  <span className="text-muted text-sm">
                    กดปุ่ม จริง หรือ เท็จ เพื่อตอบ
                  </span>
                )}
              </div>
            </div>

            {/* Back: Explanation */}
            <div className="absolute inset-0 bg-primary text-white rounded-2xl shadow-sm border-2 border-primary p-8 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-6">
                คำเฉลย
              </span>
              <h2 className="text-2xl font-bold mb-3">
                {card.answer === 'yes' ? 'จริง' : 'เท็จ'}
              </h2>
              <p className="text-blue-100 leading-relaxed">{card.explanation}</p>
              {canGoNext && (
                <span className="mt-6 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full">
                  คลิกการ์ดเพื่อกลับไปหน้าถัดไป
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Answer buttons - only when not flipped */}
        {!isFlipped && (
          <div className="bg-card rounded-2xl shadow-sm p-6">
            <p className="text-sm font-medium text-ink mb-4">
              ข้อความนี้ถูกต้องหรือไม่?
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => checkAnswer('yes')}
                disabled={result === true}
                className={`flex-1 bg-white border-2 font-semibold px-4 py-4 rounded-xl text-lg transition-all duration-150 ${buttonStyle('yes')} ${
                  result === true ? 'scale-[0.97]' : ''
                }`}
              >
                จริง
              </button>
              <button
                type="button"
                onClick={() => checkAnswer('no')}
                disabled={result === true}
                className={`flex-1 bg-white border-2 font-semibold px-4 py-4 rounded-xl text-lg transition-all duration-150 ${buttonStyle('no')} ${
                  result === true ? 'scale-[0.97]' : ''
                }`}
              >
                เท็จ
              </button>
            </div>

            {result === false && (
              <div className="bg-danger/10 border border-danger text-danger rounded-xl p-4 mt-4 text-center">
                <p className="font-semibold">ยังไม่ถูกต้อง</p>
                <p className="text-sm mt-1">ลองพิจารณาอีกครั้ง หรือพลิกการ์ดดูเฉลย</p>
              </div>
            )}
          </div>
        )}

        {/* Controls - show when flipped (correct) or after wrong attempt */}
        {isFlipped && (
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={prevCard}
              className="flex-1 bg-white text-ink border-2 border-slate-200 font-medium px-4 py-3 rounded-xl transition-all duration-150 hover:border-primary"
            >
              ← ก่อนหน้า
            </button>
            <button
              type="button"
              onClick={nextCard}
              className="flex-1 bg-primary text-white font-medium px-4 py-3 rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-md"
            >
              ถัดไป →
            </button>
          </div>
        )}

        {/* Reveal answer link after a wrong attempt */}
        {!isFlipped && result === false && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="text-primary font-medium hover:underline"
            >
              พลิกการ์ดดูเฉลย
            </button>
          </div>
        )}

        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            onClick={() => {
              setCurrentIndex(0)
              flipBack()
            }}
            className="text-primary font-medium hover:underline"
          >
            เริ่มใหม่
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlashCardPage
