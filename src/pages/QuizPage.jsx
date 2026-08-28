import { useState } from 'react'
import { Link } from 'react-router-dom'
import questions from '../data/questions'

const ANSWER_COLORS = {
  default: 'bg-white border-slate-200 hover:border-primary hover:bg-primary/5',
  correct: 'bg-success border-success text-white',
  incorrect: 'bg-danger border-danger text-white',
}

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
    if (selectedAnswer === null) return ANSWER_COLORS.default
    const option = question.answerOptions[index]
    if (option.isCorrect) return ANSWER_COLORS.correct
    if (index === selectedAnswer) return ANSWER_COLORS.incorrect
    return ANSWER_COLORS.default
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-sm p-8">
        {showScore ? (
          /* ----- Result View ----- */
          <div className="text-center py-8">
            <div className="w-40 h-40 rounded-full border-8 border-primary flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-ink">
                {score}/{totalQuestions}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-ink mb-3">
              คุณได้ {score} จาก {totalQuestions} คะแนน!
            </h2>
            <p className="text-muted mb-8">
              {score === totalQuestions
                ? 'ยอดเยี่ยม! คุณเก่งมาก 🎉'
                : score >= totalQuestions / 2
                  ? 'ไม่เลวเลย ลองทบทวนแล้วลองอีกครั้งได้'
                  : 'ลองอ่านเนื้อหาแล้วกลับมาลองใหม่นะ'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={restartQuiz}
                className="bg-primary text-white font-medium px-8 py-3 rounded-xl transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-md"
              >
                ทดสอบอีกครั้ง
              </button>
              <Link
                to="/"
                className="bg-white text-primary border-2 border-primary font-medium px-8 py-3 rounded-xl transition-all duration-150 ease-in-out hover:bg-primary/5"
              >
                กลับไปอ่านความรู้
              </Link>
            </div>
          </div>
        ) : (
          /* ----- Quiz View ----- */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-muted">
                คำถามที่ {currentQuestion + 1} / {totalQuestions}
              </h2>
              <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                คะแนน: {score}
              </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>

            <h3 className="text-xl font-semibold text-ink mb-6">
              {question.questionText}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.answerOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAnswerClick(index)}
                  className={`text-left font-medium px-6 py-4 rounded-xl border-2 transition-all duration-150 ease-in-out ${getOptionStyle(index)} ${
                    locked && selectedAnswer === index ? 'scale-[0.98]' : ''
                  }`}
                >
                  {option.answerText}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizPage
