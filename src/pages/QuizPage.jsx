import { useState } from 'react'
import { Link } from 'react-router-dom'
import questions from '../data/questions'

const OPTION_COLORS = ['#e21b3c', '#1368ce', '#d89e00', '#26890c']

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [locked, setLocked] = useState(false)

  const totalQuestions = questions.length
  const question = questions[currentQuestion]

  const handleAnswerClick = (index) => {
    if (locked) return

    const isCorrect = question.answerOptions[index].isCorrect
    setSelectedAnswer(index)
    setLocked(true)

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1
      if (nextQuestion < totalQuestions) {
        setCurrentQuestion(nextQuestion)
      } else {
        setShowScore(true)
      }
      setSelectedAnswer(null)
      setLocked(false)
    }, 1000)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setLocked(false)
  }

  if (showScore) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          <div
            className="rounded-3xl bg-white p-8 relative"
            style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.2)' }}
          >
            <span className="text-6xl mb-4 block">
              {score === totalQuestions
                ? '🏆'
                : score >= totalQuestions / 2
                  ? '🎉'
                  : '💪'}
            </span>
            <h2 className="text-3xl font-extrabold mb-2">เสร็จแล้ว!</h2>
            <div className="inline-flex items-center gap-2 bg-[#d89e00] text-white text-2xl font-extrabold px-6 py-2 rounded-xl mb-4">
              ⭐ {score} / {totalQuestions}
            </div>
            <p className="text-lg mb-8">
              {score === totalQuestions
                ? 'ยอดเยี่ยม! คุณเก่งมาก 🏆'
                : score >= totalQuestions / 2
                  ? 'ไม่เลวเลย ลองอีกรอบได้!'
                  : 'ลองอ่านเนื้อหาแล้วกลับมาลองใหม่นะ'}
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={restartQuiz}
                className="w-full px-6 py-4 rounded-2xl text-white font-extrabold text-lg transition-all active:translate-y-1 active:shadow-none"
                style={{ backgroundColor: '#1368ce', boxShadow: '0 5px 0 #0d4a99' }}
              >
                🔄 เล่นอีกครั้ง
              </button>
              <Link
                to="/"
                className="w-full px-6 py-4 rounded-2xl text-[#1368ce] font-extrabold text-lg bg-white transition-all active:translate-y-1 active:shadow-none border-2 border-[#1368ce]"
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-white font-bold hover:underline">
            ← เกมตอบคำถาม
          </Link>
          <span className="text-white font-extrabold">
            คะแนน: {score}
          </span>
        </div>

        <div
          className="rounded-3xl bg-white p-6 sm:p-8 relative"
          style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.2)' }}
        >
          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-extrabold text-[#1368ce]">
              คำถามที่ {currentQuestion + 1} / {totalQuestions}
            </h2>
            <span className="bg-[#1368ce] text-white font-extrabold px-3 py-1 rounded-lg">
              +{score} ⭐
            </span>
          </div>
          <div className="h-5 bg-white rounded-full mb-7 overflow-hidden" style={{ boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.12)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                backgroundColor: questionColor(currentQuestion),
              }}
            />
          </div>

          {/* Question */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 leading-snug">
            {question.questionText}
          </h3>

          {/* Options : Kahoot 2x2 colored */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {question.answerOptions.map((option, index) => {
              const isCorrectOption = option.isCorrect
              const isSelected = index === selectedAnswer
              const showResult = locked
              const base = OPTION_COLORS[index]
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAnswerClick(index)}
                  disabled={locked}
                  className={`relative flex items-center gap-4 text-left px-5 py-4 sm:py-5 rounded-2xl text-white font-bold text-lg transition-all duration-100 ${
                    showResult
                      ? isCorrectOption
                        ? ''
                        : isSelected
                          ? 'opacity-40'
                          : 'opacity-40'
                      : ''
                  } active:translate-y-1 active:shadow-none`}
                  style={{
                    backgroundColor: base,
                    boxShadow: `0 6px 0 ${shade(base, -20)}`,
                  }}
                >
                  <span className="w-9 h-9 shrink-0 bg-white/25 rounded-lg flex items-center justify-center text-xl font-extrabold">
                    {['1', '2', '3', '4'][index]}
                  </span>
                  {option.answerText}
                  {showResult && isCorrectOption && (
                    <span className="ml-auto text-2xl">✅</span>
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <span className="ml-auto text-2xl">❌</span>
                  )}
                </button>
              )
            })}
          </div>
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
