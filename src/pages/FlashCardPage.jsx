import { useState } from 'react'
import { Link } from 'react-router-dom'
import flashcards from '../data/flashcards'
import { AnimatedNumber, Confetti, PageBlobs } from '../components/ui'

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
  const [userAnswers, setUserAnswers] = useState({}) // { [index]: { choice: 'yes'|'no', isCorrect: boolean } }
  const [showConfetti, setShowConfetti] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const total = flashcards.length
  const card = flashcards[currentIndex]
  const color = CARD_COLORS[currentIndex % CARD_COLORS.length]
  const shadow = CARD_SHADOWS[currentIndex % CARD_SHADOWS.length]

  const currentAnswer = userAnswers[currentIndex]
  const hasAnswered = currentAnswer !== undefined
  const score = Object.values(userAnswers).filter((a) => a.isCorrect).length
  const isLastCard = currentIndex === total - 1

  const checkAnswer = (choice) => {
    if (hasAnswered) return
    const isCorrect = choice === card.answer
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: { choice, isCorrect },
    }))

    if (isCorrect) {
      setTimeout(() => {
        setIsFlipped(true)
      }, 500)
    }
  }

  const flipBack = () => {
    setIsFlipped(false)
  }

  const finishQuiz = () => {
    setIsFinished(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000)
  }

  const nextCard = () => {
    if (isLastCard) {
      finishQuiz()
      return
    }
    setCurrentIndex((i) => Math.min(total - 1, i + 1))
    flipBack()
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => Math.max(0, i - 1))
      flipBack()
    }
  }

  const restartQuiz = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setUserAnswers({})
    setIsFinished(false)
    setShowConfetti(false)
  }

  const buttonStyle = (choice) => {
    const isYesChoice = choice === 'yes'

    if (!hasAnswered) {
      return isYesChoice
        ? 'bg-accent text-white shadow-[0_5px_0_#0f766e] hover:-translate-y-0.5'
        : 'bg-danger text-white shadow-[0_5px_0_#b91c1c] hover:-translate-y-0.5'
    }

    const pickedThis = currentAnswer.choice === choice
    if (pickedThis && currentAnswer.isCorrect) {
      return 'bg-accent text-white shadow-[0_5px_0_#0f766e] ring-4 ring-green-300/50 animate-pop'
    }
    if (pickedThis && !currentAnswer.isCorrect) {
      return 'bg-danger text-white shadow-[0_5px_0_#b91c1c] opacity-80 animate-shake'
    }
    if (choice === card.answer) {
      return 'bg-white text-accent border-2 border-accent shadow-[0_5px_0_#0f766e]'
    }
    return 'bg-slate-200 text-slate-400 opacity-60 shadow-none'
  }

  if (isFinished) {
    const percent = Math.round((score / total) * 100)
    let evalMeta = {
      title: 'ผู้เชี่ยวชาญ Flash Card 🏆',
      desc: 'ยอดเยี่ยมมาก! คุณจำและเข้าใจเรื่อง PrEP / PEP ได้อย่างแม่นยำครบถ้วน',
      bgColor: '#dbeafe',
      icon: '🏆',
    }

    if (score < 5) {
      evalMeta = {
        title: 'ลองทบทวนอีกครั้ง 🔄',
        desc: 'ยังมีหลายจุดที่น่าสนใจ ลองอ่านข้อมูลแล้วกลับมาเล่นใหม่นะ',
        bgColor: '#fee2e2',
        icon: '🔄',
      }
    } else if (score < 8) {
      evalMeta = {
        title: 'เก่งมาก ทำได้ดี! 💪',
        desc: 'เข้าใจหลักการสำคัญของ PrEP / PEP ได้เป็นอย่างดี',
        bgColor: '#fef3c7',
        icon: '💪',
      }
    } else if (score < 10) {
      evalMeta = {
        title: 'ยอดเยี่ยม เกือบเต็มแล้ว! 🎉',
        desc: 'ตอบถูกเกือบหมด มีความรู้ความเข้าใจเรื่องยาป้องกัน HIV เป็นอย่างดี',
        bgColor: '#ccfbf1',
        icon: '🎉',
      }
    }

    return (
      <PageBlobs variant="flashcard">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          {showConfetti && <Confetti />}
          <div className="w-full max-w-xl animate-fade-up text-center">
            <div className="relative rounded-3xl bg-white p-6 sm:p-8 shadow-card border-2 border-[#cfd9e6]">
              <div className="mb-2">
                <span className="inline-block rounded-full bg-teal-50 px-4 py-1 text-xs sm:text-sm font-extrabold text-accent border border-teal-200">
                  FLASHCARD COMPLETE
                </span>
              </div>

              <span
                className="mx-auto my-3 flex h-20 w-20 items-center justify-center rounded-full text-5xl animate-pop"
                style={{ backgroundColor: evalMeta.bgColor }}
              >
                {evalMeta.icon}
              </span>

              <h2 className="mb-1 text-2xl sm:text-3xl font-extrabold text-ink">
                {evalMeta.title}
              </h2>
              <p className="mb-4 text-sm sm:text-base text-muted">
                {evalMeta.desc}
              </p>

              {/* Score Display */}
              <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-6 py-3 border border-slate-200">
                <span className="text-sm font-bold text-muted">คะแนนของคุณ:</span>
                <span className="text-3xl font-black text-accent tabular-nums">
                  <AnimatedNumber value={score} />
                </span>
                <span className="text-lg font-bold text-slate-400">/ {total}</span>
                <span className="text-xs text-muted">({percent}%)</span>
              </div>

              {/* Summary Points */}
              <div className="mb-6 rounded-2xl bg-slate-50/80 p-5 text-left border-2 border-[#cfd9e6]">
                <p className="mb-3 text-center text-sm font-bold italic text-slate-700">
                  💡 สรุปหัวใจสำคัญของ PrEP และ PEP
                </p>
                <div className="space-y-2 text-xs sm:text-sm font-semibold text-slate-800">
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                    <span className="text-base">🛡️</span>
                    <span><strong>PrEP</strong> — กิน <strong>ก่อนเสี่ยง</strong> เพื่อป้องกันเชื้อ HIV</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                    <span className="text-base">🚨</span>
                    <span><strong>PEP</strong> — กิน <strong>หลังเสี่ยง ภายใน 72 ชม.</strong> ต่อเนื่อง 28 วัน</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                    <span className="text-base">🩺</span>
                    <span><strong>ถุงยางอนามัย</strong> — จำเป็นเสมอเพื่อป้องกันโรคติดต่อทางเพศสัมพันธ์อื่นๆ</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="flex-1 rounded-xl bg-accent px-6 py-3.5 text-base font-extrabold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
                >
                  🔄 เล่นอีกครั้ง
                </button>
                <Link
                  to="/"
                  className="flex-1 rounded-xl bg-white px-6 py-3.5 text-base font-extrabold text-primary border-2 border-[#cfd9e6] transition-all duration-200 hover:border-primary hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  ← กลับหน้าแรก
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageBlobs>
    )
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
              ⭐ ตอบถูก <span className="text-primary tabular-nums">{score}</span> / {total}
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
            className="relative mb-6 w-full animate-fade-up"
            style={{ perspective: '1500px', animationDelay: '0.1s' }}
          >
            <div
              className={`relative min-h-[320px] transition-transform ${hasAnswered ? 'cursor-pointer' : 'cursor-default'}`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
              }}
              onClick={() => {
                if (hasAnswered) {
                  setIsFlipped((f) => !f)
                }
              }}
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
                  {hasAnswered ? (
                    <span className="inline-block rounded-full bg-white/25 px-4 py-2 font-extrabold text-white">
                      {currentAnswer.isCorrect ? '✅ ตอบถูกแล้ว' : '❌ ยังไม่ถูกต้อง'} · แตะการ์ดเพื่อดูเฉลย
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
                <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white">
                  แตะการ์ดเพื่อพลิกกลับ
                </span>
              </div>
            </div>
          </div>

          {/* True/False buttons */}
          {!isFlipped && (
            <div key={currentIndex} className="grid animate-fade-up grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => checkAnswer('yes')}
                disabled={hasAnswered}
                className={`rounded-2xl px-4 py-5 text-2xl font-extrabold text-white transition-all duration-200 active:translate-y-0 active:scale-[0.98] ${buttonStyle('yes')}`}
              >
                ✅ จริง
              </button>
              <button
                type="button"
                onClick={() => checkAnswer('no')}
                disabled={hasAnswered}
                className={`rounded-2xl px-4 py-5 text-2xl font-extrabold text-white transition-all duration-200 active:translate-y-0 active:scale-[0.98] ${buttonStyle('no')}`}
              >
                ❌ เท็จ
              </button>
            </div>
          )}

          {/* Incorrect feedback prompt */}
          {hasAnswered && !currentAnswer.isCorrect && !isFlipped && (
            <div className="mt-3 animate-pop text-center">
              <p className="font-extrabold text-danger">❌ ยังไม่ถูกต้อง</p>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="mt-1 font-extrabold text-primary underline text-sm"
              >
                พลิกการ์ดดูเฉลย →
              </button>
            </div>
          )}

          {/* Navigation Bar when answered or flipped */}
          {(isFlipped || hasAnswered) && (
            <div className="mt-4 flex animate-fade-up items-center justify-between gap-3">
              {currentIndex > 0 ? (
                <button
                  type="button"
                  onClick={prevCard}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 font-extrabold text-slate-700 shadow-sm border-2 border-[#cfd9e6] transition-all hover:border-primary active:scale-95"
                >
                  ← ก่อนหน้า
                </button>
              ) : (
                <div />
              )}

              {isLastCard ? (
                <button
                  type="button"
                  onClick={finishQuiz}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-extrabold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:scale-95"
                >
                  🏁 สรุปคะแนน ({score}/{total})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextCard}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 font-extrabold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:scale-95"
                >
                  ข้อถัดไป →
                </button>
              )}
            </div>
          )}

          {/* Restart link */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={restartQuiz}
              className="text-xs font-extrabold text-slate-400 hover:text-primary underline transition-colors"
            >
              ↺ เริ่มทำใหม่ตั้งแต่ต้น
            </button>
          </div>
        </div>
      </div>
    </PageBlobs>
  )
}

export default FlashCardPage
