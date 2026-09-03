import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import questions from '../data/questions'
import { AnimatedNumber, Confetti, PageBlobs } from '../components/ui'

const OPTION_COLORS = ['#dc2626', '#2563eb', '#d97706', '#0d9488']

const SPEAKER_STYLES = {
  'นัท': {
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    avatar: '🧑‍🎓',
    name: 'นัท',
  },
  'มิน': {
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    avatar: '🧑',
    name: 'มิน',
  },
  'เจ': {
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    avatar: '🏃',
    name: 'เจ',
  },
  'อาจารย์': {
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    avatar: '👨‍🏫',
    name: 'อาจารย์',
  },
}

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const advanceTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current)
      }
    }
  }, [])

  const totalQuestions = questions.length
  const question = questions[currentQuestion]

  const handleAnswerClick = (index) => {
    if (locked) return

    const isCorrect = question.answerOptions[index].isCorrect
    setSelectedAnswer(index)
    setLocked(true)
    setFeedback(isCorrect ? 'correct' : 'wrong')

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }

    // Auto advance after 6.5 seconds so user has plenty of time to read explanation, or they can click next
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    advanceTimerRef.current = setTimeout(() => {
      advanceNextQuestion()
    }, 6500)
  }

  const advanceNextQuestion = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion)
      setSelectedAnswer(null)
      setLocked(false)
      setFeedback(null)
    } else {
      setShowScore(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }

  const restartQuiz = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = null
    }
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setLocked(false)
    setFeedback(null)
    setShowConfetti(false)
  }

  if (showScore) {
    let evaluation = {
      title: 'ผู้พิทักษ์ความรู้ HIV 🏆',
      desc: 'ยอดเยี่ยมมาก! คุณเข้าใจและตัดสินใจเรื่อง PrEP / PEP ได้อย่างแม่นยำ',
      bgColor: '#dbeafe',
      badgeColor: '#2563eb',
    }

    if (score < 5) {
      evaluation = {
        title: 'ลองเล่นอีกครั้ง 🔄',
        desc: 'ยังมีบางจุดที่ต้องทบทวน ลองกลับมาเล่นใหม่อีกรอบนะ',
        bgColor: '#fee2e2',
        badgeColor: '#dc2626',
      }
    } else if (score < 7) {
      evaluation = {
        title: 'ยังมีบางเรื่องที่ต้องทบทวน 💪',
        desc: 'เข้าใจพื้นฐานดีแล้ว ลองทบทวนจุดสำคัญเรื่องกรอบเวลาเพิ่มเติม',
        bgColor: '#fef3c7',
        badgeColor: '#d97706',
      }
    } else if (score < 9) {
      evaluation = {
        title: 'เข้าใจและตัดสินใจได้ดี 🎉',
        desc: 'ยอดเยี่ยม! มีความรู้ความเข้าใจเรื่องการป้องกันเป็นอย่างดี',
        bgColor: '#ccfbf1',
        badgeColor: '#0d9488',
      }
    }

    return (
      <PageBlobs variant="quiz">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          {showConfetti && <Confetti />}
          <div className="w-full max-w-xl animate-fade-up text-center">
            <div className="relative rounded-3xl bg-white p-6 sm:p-8 shadow-card border-2 border-[#cfd9e6]">
              {/* Mission Complete Header */}
              <div className="mb-2">
                <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs sm:text-sm font-extrabold text-primary border border-blue-200">
                  MISSION COMPLETE
                </span>
              </div>

              <span
                className="mx-auto my-3 flex h-20 w-20 items-center justify-center rounded-full text-5xl animate-pop"
                style={{ backgroundColor: evaluation.bgColor }}
              >
                {score >= 9 ? '🏆' : score >= 7 ? '🎉' : score >= 5 ? '💪' : '🔄'}
              </span>

              <h2 className="mb-1 text-2xl sm:text-3xl font-extrabold text-ink">
                {evaluation.title}
              </h2>
              <p className="mb-4 text-sm sm:text-base text-muted">
                {evaluation.desc}
              </p>

              {/* Score Display */}
              <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-6 py-3 border border-slate-200">
                <span className="text-sm font-bold text-muted">คะแนนของคุณ:</span>
                <span className="text-3xl font-black text-primary tabular-nums">
                  <AnimatedNumber value={score} />
                </span>
                <span className="text-lg font-bold text-slate-400">/ 10</span>
                <span className="text-xs text-muted">({score}/{totalQuestions} ข้อ)</span>
              </div>

              {/* Story Takeaway Box */}
              <div className="mb-6 rounded-2xl bg-slate-50/80 p-5 text-left border-2 border-[#cfd9e6]">
                <p className="mb-3 text-center text-sm font-bold italic text-slate-700">
                  “บางครั้งการตัดสินใจที่สำคัญที่สุด ไม่ใช่การรู้ทุกอย่าง แต่คือการรู้ว่า ‘ต้องทำอะไร’ และ ‘ต้องทำเมื่อไหร่’”
                </p>
                <div className="space-y-2 text-xs sm:text-sm font-semibold text-slate-800">
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                    <span className="text-base">💊</span>
                    <span><strong>PrEP</strong> — การป้องกัน <strong>ก่อนเกิดความเสี่ยง</strong></span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                    <span className="text-base">🚨</span>
                    <span><strong>PEP</strong> — การป้องกัน <strong>หลังเกิดความเสี่ยง</strong></span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                    <span className="text-base">⏱️</span>
                    <span><strong>PEP</strong> — ควรเริ่มให้ <strong>เร็วที่สุด และไม่เกิน 72 ชั่วโมง</strong></span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm border border-slate-200">
                    <span className="text-base">📅</span>
                    <span><strong>PEP</strong> — โดยทั่วไปใช้ยาต่อเนื่อง <strong>28 วัน</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="flex-1 rounded-xl bg-primary px-6 py-3.5 text-base font-extrabold text-white shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
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
    <PageBlobs variant="quiz">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Header navigation bar */}
          <div className="mb-4 flex animate-fade-up items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-primary transition-colors">
              <span>←</span>
              <span>เกมตอบคำถาม</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-extrabold text-slate-700 shadow-sm border border-[#cfd9e6]">
                คะแนน: <span className="text-primary tabular-nums">{score}</span> / 10
              </span>
            </div>
          </div>

          <div className="animate-fade-up rounded-3xl bg-white p-5 sm:p-7 shadow-card border-2 border-[#cfd9e6]">
            {/* Chapter Header & Progress */}
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs sm:text-sm font-extrabold text-primary border border-blue-200">
                <span>📖</span>
                <span>{question.chapter}</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-muted">
                {currentQuestion + 1} / {totalQuestions}
              </span>
            </div>

            <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-teal-500"
                style={{
                  width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>

            {/* Time alert banner if applicable */}
            {question.timeAlert && (
              <div className="mb-4 animate-pulse rounded-2xl bg-amber-50 p-3.5 text-center text-xs sm:text-sm font-extrabold text-amber-900 border-2 border-amber-300">
                {question.timeAlert}
              </div>
            )}

            {/* Story & Context Section */}
            <div className="mb-5 rounded-2xl bg-slate-50/90 p-4 border border-slate-200">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {question.story}
              </p>

              {/* Dialogues */}
              {question.dialogues && question.dialogues.length > 0 && (
                <div className="space-y-2.5">
                  {question.dialogues.map((d, idx) => {
                    const speakerMeta = SPEAKER_STYLES[d.speaker] || {
                      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
                      avatar: '💬',
                      name: d.speaker,
                    }
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-xl bg-white p-3 shadow-xs border border-slate-100"
                      >
                        <span className="text-xl shrink-0 mt-0.5">{speakerMeta.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1">
                            <span className={`inline-block px-2 py-0.5 text-[11px] font-extrabold rounded-md border ${speakerMeta.badgeBg}`}>
                              {speakerMeta.name}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug whitespace-pre-line">
                            “{d.text}”
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Question Prompt */}
            <div className="mb-5 text-center">
              <span className="inline-block text-xs font-extrabold text-muted uppercase tracking-wider mb-1">
                การตัดสินใจ / คำถาม
              </span>
              <h3
                key={currentQuestion}
                className="animate-fade-up text-lg sm:text-xl font-extrabold leading-snug text-ink"
              >
                {question.questionText}
              </h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.answerOptions.map((option, index) => {
                const isCorrectOption = option.isCorrect
                const isSelected = index === selectedAnswer
                const showResult = locked
                const isCorrectPick = showResult && isCorrectOption
                const isWrongPick = showResult && isSelected && !isCorrectOption
                const base = OPTION_COLORS[index]
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswerClick(index)}
                    disabled={locked}
                    className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm sm:text-base font-bold text-white transition-all duration-200 ${
                      isCorrectPick
                        ? 'animate-pop ring-4 ring-green-400/50'
                        : isWrongPick
                          ? 'animate-shake'
                          : showResult
                            ? 'opacity-40'
                            : 'hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]'
                    }`}
                    style={{
                      backgroundColor: base,
                      boxShadow: `0 4px 0 ${shade(base, -20)}`,
                    }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/25 text-sm font-extrabold">
                      {['1', '2', '3', '4'][index]}
                    </span>
                    <span className="flex-1 leading-snug">{option.answerText}</span>
                    {isCorrectPick && <span className="ml-auto text-xl">✅</span>}
                    {isWrongPick && <span className="ml-auto text-xl">❌</span>}
                  </button>
                )
              })}
            </div>

            {/* Feedback & Explanation Box */}
            {locked && (
              <div className="mt-5 animate-fade-up rounded-2xl p-4 bg-slate-50 border-2 border-[#cfd9e6]">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                      feedback === 'correct'
                        ? 'bg-accent-light text-accent'
                        : 'bg-danger-light text-danger'
                    }`}
                  >
                    {feedback === 'correct' ? '✅ ตอบถูกต้อง!' : '❌ ยังไม่ถูกต้อง'}
                  </span>
                  <button
                    type="button"
                    onClick={advanceNextQuestion}
                    className="text-xs font-extrabold text-primary hover:underline"
                  >
                    ไปบทถัดไป →
                  </button>
                </div>
                {question.explanation && (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    💡 <strong>คำอธิบาย:</strong> {question.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageBlobs>
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

export default QuizPage

