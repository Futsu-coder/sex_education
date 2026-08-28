import { useState } from 'react'
import { Link } from 'react-router-dom'
import questions from '../data/questions'

const ANSWER_COLORS = [
  'bg-primary border-primary',
  'bg-success border-success',
  'bg-danger border-danger',
  'bg-amber border-amber',
]

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

  const getOptionStyle = (index) => {
    if (selectedAnswer === null) return ANSWER_COLORS[index % ANSWER_COLORS.length]
    const option = question.answerOptions[index]
    if (option.isCorrect) return 'bg-success border-success'
    if (index === selectedAnswer) return 'bg-danger border-danger'
    return 'bg-slate-100 border-slate-200'
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-ink overflow-hidden">
      {showScore ? (
        /* ----- Result View ----- */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-44 h-44 rounded-full bg-primary flex items-center justify-center mb-8 shadow-xl">
            <span className="text-4xl font-bold text-white">
              {score}/{totalQuestions}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            คุณได้ {score} จาก {totalQuestions} คะแนน!
          </h2>
          <p className="text-muted mb-10 text-lg text-center">
            {score === totalQuestions
              ? 'ยอดเยี่ยม! คุณเก่งมาก 🎉'
              : score >= totalQuestions / 2
                ? 'ไม่เลวเลย ลองทบทวนแล้วลองอีกครั้งได้'
                : 'ลองอ่านเนื้อหาแล้วกลับมาลองใหม่นะ'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <button
              type="button"
              onClick={restartQuiz}
              className="flex-1 bg-primary text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              ทดสอบอีกครั้ง
            </button>
            <Link
              to="/"
              className="flex-1 bg-white text-primary border-2 border-primary font-semibold text-center px-8 py-4 rounded-xl text-lg transition-all duration-150 ease-in-out hover:bg-primary/5"
            >
              กลับไปอ่านความรู้
            </Link>
          </div>
        </div>
      ) : (
        /* ----- Quiz View ----- */
        <>
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <Link
              to="/"
              className="text-primary font-medium hover:underline"
            >
              ← กลับหน้าแรก
            </Link>
            <span className="bg-primary/10 text-primary font-semibold px-4 py-1.5 rounded-full text-sm">
              คำถามที่ {currentQuestion + 1} / {totalQuestions} · คะแนน: {score}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mx-6 h-2 bg-slate-100 rounded-full overflow-hidden mb-10">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>

          {/* Question */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-16 pb-10">
            <h1 className="text-2xl md:text-4xl font-bold text-center leading-relaxed max-w-4xl">
              {question.questionText}
            </h1>
          </div>

          {/* Answer grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-6 md:px-16 pb-8 justify-items-stretch auto-rows-fr">
            {question.answerOptions.map((option, index) => {
              const hasAnswered = selectedAnswer !== null
              const dimmed = hasAnswered && getOptionStyle(index).includes('slate')
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAnswerClick(index)}
                  className={`text-left font-semibold px-6 py-6 md:px-10 md:py-8 rounded-2xl text-white border-2 transition-all duration-150 ease-in-out hover:brightness-110 active:scale-[0.98] ${getOptionStyle(index)} ${dimmed ? 'opacity-60' : ''}`}
                >
                  <span className="inline-block bg-white/25 text-white text-sm md:text-base font-bold w-8 h-8 leading-8 text-center rounded-lg mr-3">
                    {['A', 'B', 'C', 'D'][index]}
                  </span>
                  <span className="text-lg md:text-2xl">{option.answerText}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default QuizPage