import { useState } from 'react'
import { Link } from 'react-router-dom'
import questions from '../data/questions'
import { AnimatedNumber, Confetti } from '../components/ui'

const OPTION_COLORS = ['#dc2626', '#2563eb', '#d97706', '#0d9488']

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

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

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1
      if (nextQuestion < totalQuestions) {
        setCurrentQuestion(nextQuestion)
      } else {
        setShowScore(true)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
      setSelectedAnswer(null)
      setLocked(false)
      setFeedback(null)
    }, 1100)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setLocked(false)
    setFeedback(null)
    setShowConfetti(false)
  }

  if (showScore) {
    const isPerfect = score === totalQuestions
    const isPass = score >= totalQuestions / 2
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
        {showConfetti && <Confetti />}
        <div className="w-full max-w-md animate-fade-up text-center">
          <div
            className="relative rounded-3xl bg-white p-8 shadow-card ring-1 ring-slate-100"
          >
            <span
              className="mx-auto mb-4 block w-20 h-20 rounded-full flex items-center justify-center text-5xl animate-pop"
              style={{
                backgroundColor: isPerfect
                  ? '#dbeafe'
                  : isPass
                    ? '#ccfbf1'
                    : '#fee2e2',
              }}
            >
              {isPerfect ? '🏆' : isPass ? '🎉' : '💪'}
            </span>
            <h2 className="mb-2 text-3xl font-extrabold">เสร็จแล้ว!</h2>
            <div
              className="mx-auto mb-4 inline-flex items-center gap-2 rounded-xl px-6 py-2 text-2xl font-extrabold text-white"
              style={{ backgroundColor: isPass ? '#0d9488' : '#d97706' }}
            >
              <AnimatedNumber value={score} className="tabular-nums" /> / {totalQuestions}
            </div>
            <p className="mb-8 text-lg text-muted">
              {isPerfect
                ? 'ยอดเยี่ยม! คุณเก่งมาก 🏆'
                : isPass
                  ? 'ไม่เลวเลย ลองอีกรอบได้!'
                  : 'ลองอ่านเนื้อหาแล้วกลับมาลองใหม่นะ'}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={restartQuiz}
                className="w-full rounded-xl bg-primary px-6 py-4 text-lg font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
              >
                🔄 เล่นอีกครั้ง
              </button>
              <Link
                to="/"
                className="w-full rounded-xl bg-white px-6 py-4 text-lg font-extrabold text-primary ring-1 ring-slate-200 transition-all duration-200 hover:ring-primary active:scale-[0.98]"
              >
                ← กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header bar */}
        <div className="mb-4 flex animate-fade-up items-center justify-between">
          <Link to="/" className="font-bold hover:underline">
            ← เกมตอบคำถาม
          </Link>
          <span className="font-extrabold">
            คะแนน: <span className="tabular-nums">{score}</span>
          </span>
        </div>

        <div className="animate-fade-up rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-100 sm:p-8">
          {/* Progress */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-primary">
              คำถามที่ {currentQuestion + 1} / {totalQuestions}
            </h2>
            <span
              className="rounded-lg bg-primary px-3 py-1 font-extrabold text-white"
            >
              +{score} ⭐
            </span>
          </div>
          <div className="mb-7 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                backgroundColor: questionColor(currentQuestion),
              }}
            />
          </div>

          {/* Question */}
          <h3
            key={currentQuestion}
            className="mb-8 animate-fade-up text-center text-2xl font-extrabold leading-snug sm:text-3xl"
          >
            {question.questionText}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                  className={`relative flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-lg font-bold text-white transition-all duration-200 sm:py-5 ${
                    isCorrectPick
                      ? 'animate-pop ring-4 ring-green-400/40'
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
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/25 text-xl font-extrabold">
                    {['1', '2', '3', '4'][index]}
                  </span>
                  {option.answerText}
                  {isCorrectPick && <span className="ml-auto text-2xl">✅</span>}
                  {isWrongPick && <span className="ml-auto text-2xl">❌</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feedback bar */}
        <div key={feedback} className="mt-5 flex justify-center">
          {locked && (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-extrabold animate-pop ${
                feedback === 'correct'
                  ? 'bg-accent-light text-accent'
                  : feedback === 'wrong'
                    ? 'bg-danger-light text-danger'
                    : ''
              }`}
            >
              {feedback === 'correct' ? '✅ ถูกต้อง!' : feedback === 'wrong' ? '❌ ยังไม่ถูก' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function questionColor(i) {
  return OPTION_COLORS[i % OPTION_COLORS.length]
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
