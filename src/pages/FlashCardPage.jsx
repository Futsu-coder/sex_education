import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// 💡 ข้อมูลทางการแพทย์ที่ Research มาสำหรับโครงงานโดยเฉพาะ (อิงหลักวิชาการแต่อ่านเข้าใจง่าย)
const prepPepFlashcards = [
  {
    id: 1,
    statement: 'ยา PrEP คือยาฉุกเฉินที่ต้องกิน "หลัง" จากมีความเสี่ยง ภายใน 72 ชั่วโมง เพื่อป้องกัน HIV',
    answer: 'no',
    explanation: 'เข้าใจผิดแล้ว! ยา PrEP (Pre-Exposure Prophylaxis) ต้องกิน "ก่อน" มีความเสี่ยงครับ ส่วนยาที่ต้องรีบกินภายใน 72 ชั่วโมงหลังมีความเสี่ยงคือยา PEP (Post-Exposure Prophylaxis) จำง่ายๆ: Pre = ก่อน, Post = หลัง'
  },
  {
    id: 2,
    statement: 'หากกินยา PrEP ทุกวันอย่างสม่ำเสมอ จะสามารถป้องกันการติดเชื้อ HIV จากการมีเพศสัมพันธ์ได้เกือบ 100%',
    answer: 'yes',
    explanation: 'ถูกต้อง! การกิน PrEP อย่างสม่ำเสมอมีประสิทธิภาพป้องกัน HIV ได้สูงถึง 99% แต่ต้องจำไว้ว่า PrEP ป้องกันได้แค่ HIV เท่านั้น ไม่สามารถป้องกันโรคติดต่อทางเพศสัมพันธ์อื่นๆ ได้ ถุงยางอนามัยจึงยังจำเป็น'
  },
  {
    id: 3,
    statement: 'ถ้าเรากินยา PrEP หรือ PEP แล้ว เราจะไม่ติดโรคซิฟิลิส หนองใน หรือเริมอย่างแน่นอน',
    answer: 'no',
    explanation: 'เป็นความเชื่อที่ผิดและอันตรายครับ ยาทั้งสองชนิดออกแบบมาเพื่อต้านไวรัส HIV เท่านั้น ไม่มีฤทธิ์ป้องกันโรคติดต่อทางเพศสัมพันธ์ (STIs) อื่นๆ การใช้ถุงยางอนามัยควบคู่กันจึงเป็นวิธีที่ดีที่สุด (Double Protection)'
  },
  {
    id: 4,
    statement: 'ยา PEP เป็นยาฉุกเฉิน เมื่อเริ่มกินแล้ว หากผ่านไป 5 วันรู้สึกปกติดี ไม่มีไข้ สามารถหยุดยาได้เลย',
    answer: 'no',
    explanation: 'อันตรายมากหากหยุดยาเอง! ยา PEP ต้องกินติดต่อกัน "28 วัน" ให้ครบตามที่แพทย์สั่งอย่างเคร่งครัด หากหยุดกินกลางคัน ไวรัสอาจยังไม่ถูกกำจัดหมดและจะกลับมาแบ่งตัว แถมอาจทำให้เชื้อ "ดื้อยา" ได้ด้วย'
  },
  {
    id: 5,
    statement: 'คนที่มีเชื้อ HIV อยู่แล้ว ไม่สามารถใช้ยา PrEP หรือ PEP เพื่อรักษาให้หายขาดได้',
    answer: 'yes',
    explanation: 'ถูกต้องครับ ยา PrEP และ PEP ใช้สำหรับคนที่ "ยังไม่มีเชื้อ HIV" เพื่อป้องกันเท่านั้น ผู้ที่มีเชื้อแล้วต้องรับการรักษาด้วย "ยาต้านไวรัส (ART)" เป็นประจำ เพื่อกดปริมาณไวรัสในเลือดจนไม่สามารถถ่ายทอดสู่ผู้อื่นได้ (หลักการ U=U)'
  }
]

function FlashCardPage() {
  // States สำหรับ Quiz Logic
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  
  // State สำหรับเก็บผลการตอบ
  const [userChoice, setUserChoice] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  
  // Effects
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const total = prepPepFlashcards.length
  const card = prepPepFlashcards[currentIndex]

  // ฟังก์ชันจัดการตอนกดตอบ
  const handleAnswer = (choice) => {
    if (isAnswered) return // กันการกดย้ำ

    setUserChoice(choice)
    setIsAnswered(true)

    const isCorrect = choice === card.answer
    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    // หน่วงเวลาให้เห็น Animation ของปุ่มที่กดก่อนพลิกการ์ด (Human feel)
    setTimeout(() => {
      setIsFlipped(true)
    }, 800)
  }

  const handleNext = () => {
    if (currentIndex === total - 1) {
      setIsFinished(true)
    } else {
      setIsFlipped(false)
      // รอให้การ์ดพลิกกลับก่อนเปลี่ยนเนื้อหา ป้องกันตาเหล่
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setIsAnswered(false)
        setUserChoice(null)
      }, 300)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setIsFinished(false)
    setIsAnswered(false)
    setUserChoice(null)
    setIsFlipped(false)
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

  // ==========================================
  // RENDER: หน้าสรุปคะแนน (อลังการงานสร้าง)
  // ==========================================
  if (isFinished) {
    const percentage = Math.round((score / total) * 100)
    let feedback = ''
    let ringColor = ''
    
    if (percentage === 100) {
      feedback = 'ระดับแพทย์ผู้เชี่ยวชาญ! 🩺✨ ข้อมูลแน่นเป๊ะ ป้องกันตัวเองและให้คำปรึกษาคนอื่นได้เลย'
      ringColor = 'from-emerald-400 to-teal-500'
    } else if (percentage >= 60) {
      feedback = 'ยอดเยี่ยม! 🛡️ พื้นฐานดีมาก เข้าใจการใช้ยาต้านไวรัสได้ถูกต้องเป็นส่วนใหญ่'
      ringColor = 'from-indigo-400 to-purple-500'
    } else {
      feedback = 'ไม่เป็นไรนะ! 📚 เรื่องนี้ค่อนข้างซับซ้อน ถือว่าได้เรียนรู้ความรู้ใหม่ทางการแพทย์'
      ringColor = 'from-rose-400 to-orange-500'
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#030712] overflow-hidden relative">
        {/* Ambient Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className={`w-full max-w-md z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-10 text-center shadow-2xl relative overflow-hidden">
            
            {/* โลหะสะท้อนแสงพาดผ่านกรอบ */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-50"></div>

            <p className="text-indigo-400 font-bold tracking-widest uppercase mb-4 text-sm">Mission Complete</p>
            <h2 className="text-3xl font-extrabold text-white mb-10">สรุปผลการทดสอบ</h2>
            
            {/* Circular Progress (จำลองด้วย CSS ล้ำๆ) */}
            <div className="relative inline-flex items-center justify-center mb-10 group">
              <div className={`absolute inset-0 bg-gradient-to-r ${ringColor} rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700`}></div>
              <div className="relative w-48 h-48 rounded-full bg-[#0a0f1c] border border-white/10 flex flex-col items-center justify-center shadow-inner">
                {/* SVG Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" className="text-white/5" strokeWidth="4" />
                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" className={`text-transparent`} strokeWidth="4" strokeDasharray="301.59" strokeDashoffset={301.59 - (301.59 * percentage) / 100} style={{ stroke: 'url(#gradient)', transition: 'stroke-dashoffset 1.5s ease-in-out' }} />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={percentage === 100 ? '#34d399' : '#818cf8'} />
                      <stop offset="100%" stopColor={percentage === 100 ? '#14b8a6' : '#c084fc'} />
                    </linearGradient>
                  </defs>
                </svg>
                
                <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                  {score}
                </span>
                <div className="w-10 h-0.5 bg-white/10 my-2 rounded-full"></div>
                <span className="text-xl text-slate-400 font-medium">จาก {total}</span>
              </div>
            </div>

            <p className="text-lg text-slate-300 font-medium mb-10 leading-relaxed px-2">
              {feedback}
            </p>

            <div className="flex flex-col gap-4 relative z-10">
              <button
                onClick={handleRestart}
                className="w-full bg-white text-slate-900 font-bold text-lg py-4 rounded-2xl hover:bg-indigo-50 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                ↻ ทดสอบความรู้อีกครั้ง
              </button>
              <Link
                to="/"
                className="w-full bg-white/5 text-white font-medium text-lg py-4 rounded-2xl hover:bg-white/10 transition-all border border-white/10"
              >
                🏠 กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER: หน้าเล่น Quiz (Dark Neon Theme)
  // ==========================================
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
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
          </div>
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
            className={`relative w-full transition-transform duration-1000 [transform-style:preserve-3d] grid ${
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