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

  // ดีไซน์ปุ่มสุดล้ำ (Dynamic Styles)
  const getButtonStyle = (choice) => {
    if (!isAnswered) {
      return 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:-translate-y-1'
    }
    
    // เฉลยข้อที่ถูก (เรืองแสงสีเขียว)
    if (choice === card.answer) {
      return 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.3)] scale-105 z-10 ring-2 ring-emerald-400/50'
    }
    
    // ถ้าเราเลือกผิด (เรืองแสงสีแดงและสั่น)
    if (userChoice === choice && choice !== card.answer) {
      return 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-[shake_0.4s_ease-in-out]'
    }
    
    // ข้อที่ไม่ได้เลือกและผิด (จางลง)
    return 'bg-slate-900/50 border-white/5 text-slate-600 opacity-40 scale-95'
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#030712] selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* Background Particles/Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      
      {/* Grid Pattern บางๆ */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="w-full max-w-2xl z-10 flex flex-col h-full justify-center">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-slate-400 font-medium hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            ออก
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 flex items-center gap-3">
              <span className="text-slate-400 text-sm font-medium">
                ข้อ <span className="text-white font-bold text-base">{currentIndex + 1}</span> / {total}
              </span>
              <div className="w-px h-4 bg-white/20"></div>
              <span className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
                คะแนน: <span className="text-emerald-400 font-bold text-base">{score}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (Neon) */}
        <div className="h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden border border-white/5 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-700 ease-out relative"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        {/* 3D Flip Card */}
        <div className="relative w-full [perspective:2000px] mb-8 group z-20">
          <div
            className={`relative w-full transition-transform duration-1000 [transform-style:preserve-3d] grid ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* Front Card (คำถาม) */}
            <div className="col-start-1 row-start-1 w-full min-h-[350px] bg-[#0a0f1c]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 md:p-12 flex flex-col [backface-visibility:hidden] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 border border-indigo-500/20 w-max">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                โครงงาน: ข้อมูลทางการแพทย์
              </div>
              <h3 className="text-2xl md:text-3xl font-medium text-white leading-relaxed md:leading-normal">
                {card?.statement}
              </h3>
              
              <div className="mt-auto pt-8 flex items-center justify-between">
                {isAnswered ? (
                  <span className="text-indigo-400 font-medium text-sm flex items-center gap-2 animate-pulse">
                    กำลังประมวลผล...
                  </span>
                ) : (
                  <span className="text-slate-500 text-sm font-medium">
                    ระบุว่าข้อความนี้ "จริง" หรือ "เท็จ"
                  </span>
                )}
              </div>
            </div>

            {/* Back Card (เฉลย) */}
            <div className="col-start-1 row-start-1 w-full min-h-[350px] bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0a0f1c] rounded-3xl border border-white/10 p-8 md:p-12 flex flex-col [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">
              
              {/* Graphic ตกแต่งด้านหลัง */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  คำเฉลยทางการแพทย์
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${card?.answer === 'yes' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                  {card?.answer === 'yes' ? 'เป็นความจริง' : 'ไม่เป็นความจริง'}
                </span>
              </div>
              
              <div className="relative z-10 bg-white/[0.03] rounded-2xl p-6 border border-white/5 backdrop-blur-sm shadow-inner flex-1">
                <p className="text-lg md:text-xl text-indigo-100/90 leading-relaxed font-light">
                  {card?.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="relative z-10 w-full transition-all duration-500 h-[140px]">
          {/* สถานะยังไม่ได้พลิกการ์ด (ให้เลือกตอบ) */}
          <div className={`absolute inset-0 flex gap-4 transition-all duration-500 ${isFlipped ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <button
              onClick={() => handleAnswer('yes')}
              disabled={isAnswered}
              className={`flex-1 flex flex-col items-center justify-center gap-2 border-2 rounded-2xl transition-all duration-300 ${getButtonStyle('yes')}`}
            >
              <span className="text-2xl">✅</span>
              <span className="font-bold text-lg tracking-wide">จริง</span>
            </button>
            <button
              onClick={() => handleAnswer('no')}
              disabled={isAnswered}
              className={`flex-1 flex flex-col items-center justify-center gap-2 border-2 rounded-2xl transition-all duration-300 ${getButtonStyle('no')}`}
            >
              <span className="text-2xl">❌</span>
              <span className="font-bold text-lg tracking-wide">เท็จ</span>
            </button>
          </div>

          {/* สถานะพลิกการ์ดแล้ว (ปุ่มไปข้อถัดไป) */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${isFlipped ? 'opacity-100 scale-100 delay-300' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <button
              onClick={handleNext}
              className="w-full bg-white text-slate-900 font-bold text-lg py-5 rounded-2xl transition-all duration-300 hover:bg-indigo-50 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 group flex items-center justify-center gap-3"
            >
              {currentIndex === total - 1 ? 'ดูสรุปคะแนน' : 'อ่านเข้าใจแล้ว ไปข้อถัดไป'}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            
            {/* Feedback Message ตอนตอบ */}
            <p className={`mt-4 font-medium text-sm flex items-center gap-2 ${userChoice === card?.answer ? 'text-emerald-400' : 'text-rose-400'}`}>
              {userChoice === card?.answer ? (
                <>⭐ ยอดเยี่ยม! คุณตอบถูก (รับ +1 คะแนน)</>
              ) : (
                <>💡 ไม่เป็นไร! อ่านคำอธิบายด้านบนเพื่อเก็บความรู้ไว้ใช้ในโครงงานนะ</>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FlashCardPage