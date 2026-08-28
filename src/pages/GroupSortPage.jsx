import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const GROUP_COLORS = ['#1368ce', '#26890c', '#d89e00', '#e21b3c']
const GROUP_SHADOWS = ['#0d4a99', '#1b6008', '#a17400', '#a6132c']

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

  /* ----- Drag and drop handlers ----- */
  const handleDragStart = (e, text, sourceGroup) => {
    dragItemRef.current = { text, sourceGroup }
    setDragItem(text)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', text)
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

  return (
    <div className="min-h-screen relative px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-white font-extrabold hover:underline text-lg">
            ← จัดกลุ่มคำศัพท์
          </Link>
          <span className="bg-white text-[#1368ce] font-extrabold px-4 py-1.5 rounded-xl">
            🧩 จัดแล้ว {placedCount} / {totalItems}
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            🧩 จัดกลุ่มคำศัพท์
          </h1>
          <p className="text-white/90">
            ลากคำศัพท์ไปวางในกลุ่มที่ถูกต้อง (หรือคลิก + เพื่อเพิ่ม)
          </p>
        </div>

        {/* Available items */}
        <div className="bg-white rounded-3xl p-6 mb-8" style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.2)' }}>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#1368ce] mb-4">
            🎒 คำศัพท์ที่ต้องจัดวาง
          </h2>
          {placedCount === totalItems ? (
            <p className="text-[#26890c] font-extrabold">✅ จัดครบแล้ว! กดตรวจคำตอบได้เลย</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {groupSortItems.map((item, idx) => (
                <span
                  key={item.text}
                  draggable={!isAssigned(item.text) && !isChecked}
                  onDragStart={(e) => handleDragStart(e, item.text, -1)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={handleDragEnd}
                  className={`rounded-xl px-4 py-2 font-extrabold text-white select-none transition-all ${
                    isAssigned(item.text)
                      ? 'opacity-30'
                      : dragItem === item.text
                        ? 'opacity-50 scale-95'
                        : 'active:scale-95 cursor-grab active:cursor-grabbing'
                  }`}
                  style={{
                    backgroundColor: GROUP_COLORS[idx % GROUP_COLORS.length],
                    boxShadow: `0 4px 0 ${GROUP_SHADOWS[idx % GROUP_SHADOWS.length]}`,
                  }}
                >
                  {dragItem === item.text ? '⋯' : item.text}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((groupName, gi) => (
            <div
              key={groupName}
              onDragOver={(e) => handleDragOver(e, gi)}
              onDrop={(e) => handleDrop(e, gi)}
              className={`bg-white rounded-3xl p-6 transition-transform ${
                isChecked
                  ? ''
                  : dragOverGroup === gi
                    ? 'scale-[1.02]'
                    : ''
              }`}
              style={{
                boxShadow: `0 8px 0 ${GROUP_SHADOWS[gi]}`,
                border: isChecked ? `4px solid ${groupIsCorrect(gi) ? '#26890c' : '#e21b3c'}` : '4px solid transparent',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: GROUP_COLORS[gi] }}
                />
                <h3 className="font-extrabold text-ink text-lg">{groupName}</h3>
                <span className="text-xs font-bold text-muted ml-auto">
                  {assigned[gi].length} รายการ
                </span>
              </div>

              {/* Drop zone content */}
              <div className="flex flex-wrap gap-2 min-h-[40px] rounded-xl bg-slate-100 p-2">
                {assigned[gi].length === 0 ? (
                  <span className="text-sm text-muted self-center px-1">
                    วางที่นี่ หรือคลิก + ด้านล่าง
                  </span>
                ) : (
                  assigned[gi].map((text) => (
                    <span
                      key={text}
                      draggable={!isChecked}
                      onDragStart={(e) => handleDragStart(e, text, gi)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={handleDragEnd}
                      className={`group relative text-white rounded-lg px-3 py-1.5 text-sm font-bold cursor-grab active:cursor-grabbing select-none ${
                        isChecked ? 'cursor-default' : ''
                      }`}
                      style={{ backgroundColor: GROUP_COLORS[gi] }}
                    >
                      {dragItem === text && !isChecked ? '⋯' : text}
                      {!isChecked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(text, gi)
                          }}
                          className="ml-1 text-white/70 hover:text-white"
                          aria-label={`ลบ ${text}`}
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))
                )}
              </div>

              {/* Options to add */}
              <div className="mt-4 space-y-2">
                {groupSortItems
                  .filter((i) => i.group === groupName)
                  .map((item) => (
                    <button
                      key={item.text}
                      type="button"
                      onClick={() => assignItem(item.text, gi)}
                      disabled={isAssigned(item.text) || isChecked}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all ${
                        isAssigned(item.text) || isChecked
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-white text-ink hover:text-white'
                      }`}
                      style={{
                        boxShadow: '0 3px 0 rgba(0,0,0,0.15)',
                        ...(isAssigned(item.text) || isChecked
                          ? {}
                          : { border: `2px solid ${GROUP_COLORS[gi]}`, color: GROUP_COLORS[gi] }),
                      }}
                      onMouseEnter={(e) => {
                        if (isAssigned(item.text) || isChecked) return
                        e.currentTarget.style.backgroundColor = GROUP_COLORS[gi]
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={(e) => {
                        if (isAssigned(item.text) || isChecked) return
                        e.currentTarget.style.backgroundColor = '#fff'
                        e.currentTarget.style.color = GROUP_COLORS[gi]
                      }}
                    >
                      + {item.text}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <button
            type="button"
            onClick={checkAnswer}
            disabled={placedCount !== totalItems || isChecked}
            className={`px-8 py-4 rounded-2xl text-white font-extrabold text-lg transition-all active:translate-y-1 active:shadow-none ${
              placedCount === totalItems && !isChecked
                ? 'bg-[#26890c]'
                : 'bg-slate-400 cursor-not-allowed'
            }`}
            style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}
          >
            ✅ ตรวจคำตอบ
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-8 py-4 rounded-2xl bg-white text-[#1368ce] font-extrabold text-lg transition-all active:translate-y-1 active:shadow-none"
            style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.2)' }}
          >
            ↺ เริ่มใหม่
          </button>
        </div>
      </div>
    )
  }

      {/* Incorrect grouping overlay */}
      {showIncorrectOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center" style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.3)' }}>
            <div className="w-16 h-16 rounded-full bg-[#e21b3c] text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              ✕
            </div>
            <h2 className="text-2xl font-extrabold text-ink mb-2">
              ยังไม่ถูกต้อง!
            </h2>
            <p className="text-muted mb-6">
              ดูกลุ่มที่ติดสีแดง แล้วลองจัดใหม่
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsChecked(false)
                  setShowIncorrectOverlay(false)
                  setDragOverGroup(null)
                }}
                className="bg-[#1368ce] text-white font-extrabold px-6 py-3 rounded-2xl transition-all active:translate-y-1 active:shadow-none"
                style={{ boxShadow: '0 5px 0 #0d4a99' }}
              >
                แก้ไขการจัดกลุ่ม
              </button>
              <button
                type="button"
                onClick={reset}
                className="bg-white text-ink border-2 border-slate-200 font-extrabold px-6 py-3 rounded-2xl transition-all"
              >
                เริ่มใหม่ทั้งหมด
              </button>
            </div>
          </div>
        </div>

      {/* Success feedback (non-blocking) */}
      {isChecked && allCorrect && (
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl p-6 inline-block" style={{ boxShadow: '0 6px 0 #26890c' }}>
            <p className="text-2xl font-extrabold text-[#26890c]">
              🎉 จัดกลุ่มถูกต้องทั้งหมด!
            </p>
            <p className="mt-2 font-bold text-muted">คุณทำได้เยี่ยมมาก</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashCardPage