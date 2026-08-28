import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { groupSortItems, groups } from '../data/groupSort'
import { Confetti } from '../components/ui'

const GROUP_COLORS = ['#2563eb', '#0d9488', '#d97706', '#dc2626']
const GROUP_SHADOWS = ['#1d4ed8', '#0f766e', '#b45309', '#b91c1c']

function GroupSortPage() {
  const [assigned, setAssigned] = useState(() => groups.map(() => []))
  const [isChecked, setIsChecked] = useState(false)
  const [showIncorrectOverlay, setShowIncorrectOverlay] = useState(false)
  const [dragItem, setDragItem] = useState(null)
  const [dragOverGroup, setDragOverGroup] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const dragItemRef = useRef(null)

  const totalItems = groupSortItems.length
  const placedCount = assigned.reduce((sum, g) => sum + g.length, 0)

  const isAssigned = (text) =>
    assigned.some((group) => group.includes(text))

  const assignItem = (text, groupIndex) => {
    if (isAssigned(text) || isChecked) return
    setAssigned((prev) =>
      prev.map((group, gi) =>
        gi === groupIndex ? [...group, text] : group,
      ),
    )
  }

  const removeItem = (text, groupIndex) => {
    if (isChecked) return
    setAssigned((prev) =>
      prev.map((group, gi) =>
        gi === groupIndex ? group.filter((t) => t !== text) : group,
      ),
    )
  }

  const groupIsCorrect = (gi) => {
    const expected = groupSortItems
      .filter((i) => i.group === groups[gi])
      .map((i) => i.text)
      .sort()
    const actual = [...assigned[gi]].sort()
    return (
      actual.length === expected.length &&
      actual.every((t, idx) => t === expected[idx])
    )
  }

  const allCorrect = groups.every((_, gi) => groupIsCorrect(gi))

  const checkAnswer = () => {
    if (placedCount !== totalItems || isChecked) return
    setIsChecked(true)
    if (groups.every((_, gi) => groupIsCorrect(gi))) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } else {
      setShowIncorrectOverlay(true)
    }
  }

  const reset = () => {
    setAssigned(groups.map(() => []))
    setIsChecked(false)
    setShowIncorrectOverlay(false)
    setDragItem(null)
    setDragOverGroup(null)
    setShowConfetti(false)
  }

  /* ----- Drag and drop handlers ----- */
  const handleDragStart = (e, text, sourceGroup) => {
    dragItemRef.current = { text, sourceGroup }
    setDragItem(text)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', text)
  }

  const handleDragOver = (e, gi) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverGroup(gi)
  }

  const handleDrop = (e, gi) => {
    e.preventDefault()
    const dragged = dragItemRef.current
    if (!dragged || isChecked) return
    setDragOverGroup(gi)
    setDragItem(dragged.text)
    setAssigned((prev) =>
      prev.map((group, groupIndex) => {
        if (groupIndex === dragged.sourceGroup) {
          return group.filter((t) => t !== dragged.text)
        }
        if (groupIndex === gi) {
          return [...group, dragged.text]
        }
        return group
      }),
    )
    dragItemRef.current = null
    setDragItem(null)
    setDragOverGroup(null)
  }

  const handleDragEnd = () => {
    dragItemRef.current = null
    setDragItem(null)
    setDragOverGroup(null)
  }

  return (
    <div className="relative min-h-screen px-4 py-8">
      {showConfetti && <Confetti />}
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex animate-fade-up items-center justify-between">
          <Link to="/" className="text-lg font-bold hover:underline">
            ← จัดกลุ่มคำศัพท์
          </Link>
          <span className="rounded-xl bg-white px-4 py-1.5 font-extrabold text-primary ring-1 ring-slate-100">
            🧩 จัดแล้ว <span className="tabular-nums">{placedCount}</span> / {totalItems}
          </span>
        </div>

        <div className="mb-8 animate-fade-up text-center" style={{ animationDelay: '0.05s' }}>
          <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">
            🧩 จัดกลุ่มคำศัพท์
          </h1>
          <p className="text-muted">
            ลากคำศัพท์ไปวางในกลุ่มที่ถูกต้อง (หรือคลิก + เพื่อเพิ่ม)
          </p>
        </div>

        {/* Available items */}
        <div
          className="mb-8 animate-fade-up rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-100"
          style={{ animationDelay: '0.1s' }}
        >
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-primary">
            🎒 คำศัพท์ที่ต้องจัดวาง
          </h2>
          {placedCount === totalItems ? (
            <p className="font-extrabold text-accent">✅ จัดครบแล้ว! กดตรวจคำตอบได้เลย</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {groupSortItems.map((item, idx) => (
                <span
                  key={item.text}
                  draggable={!isAssigned(item.text) && !isChecked}
                  onDragStart={(e) => handleDragStart(e, item.text, -1)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={handleDragEnd}
                  className={`rounded-xl px-4 py-2 font-extrabold text-white select-none transition-all duration-200 ${
                    isAssigned(item.text)
                      ? 'opacity-30'
                      : dragItem === item.text
                        ? 'scale-95 opacity-50 -rotate-3 shadow-lift'
                        : 'cursor-grab active:scale-95 active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-card'
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {groups.map((groupName, gi) => (
            <div
              key={groupName}
              onDragOver={(e) => handleDragOver(e, gi)}
              onDrop={(e) => handleDrop(e, gi)}
              className={`rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-100 transition-all duration-200 ${
                isChecked
                  ? ''
                  : dragOverGroup === gi
                    ? 'scale-[1.02] ring-2 ring-primary'
                    : ''
              }`}
              style={{
                backgroundColor: '#fff',
                border: isChecked
                  ? `4px solid ${groupIsCorrect(gi) ? '#0d9488' : '#dc2626'}`
                  : '4px solid transparent',
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: GROUP_COLORS[gi] }}
                />
                <h3 className="text-lg font-extrabold text-ink">{groupName}</h3>
                <span className="ml-auto text-xs font-bold text-muted">
                  <span className="tabular-nums">{assigned[gi].length}</span> รายการ
                </span>
              </div>

              {/* Drop zone content */}
              <div className="flex min-h-[40px] flex-wrap gap-2 rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
                {assigned[gi].length === 0 ? (
                  <span className="self-center px-1 text-sm text-muted">
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
                      className={`group relative select-none rounded-lg px-3 py-1.5 text-sm font-bold text-white animate-pop-in ${
                        isChecked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
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
                      className={`w-full rounded-xl px-4 py-2.5 text-left font-bold transition-all duration-200 ${
                        isAssigned(item.text) || isChecked
                          ? 'cursor-not-allowed bg-slate-50 text-slate-300'
                          : 'bg-white text-ink hover:-translate-y-0.5 hover:text-white hover:shadow-card active:translate-y-0'
                      }`}
                      style={{
                        boxShadow: '0 3px 0 rgba(31,41,55,0.12)',
                        ...(isAssigned(item.text) || isChecked
                          ? {}
                          : {
                              border: `2px solid ${GROUP_COLORS[gi]}`,
                              color: GROUP_COLORS[gi],
                            }),
                      }}
                      onMouseEnter={(e) => {
                        if (isAssigned(item.text) || isChecked) return
                        e.currentTarget.style.backgroundColor = GROUP_COLORS[gi]
                        e.currentTarget.style.borderColor = GROUP_COLORS[gi]
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={(e) => {
                        if (isAssigned(item.text) || isChecked) return
                        e.currentTarget.style.backgroundColor = '#fff'
                        e.currentTarget.style.borderColor = GROUP_COLORS[gi]
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
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={checkAnswer}
            disabled={placedCount !== totalItems || isChecked}
            className={`rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition-all duration-200 active:translate-y-0 active:scale-[0.98] ${
              placedCount === totalItems && !isChecked
                ? 'bg-accent hover:-translate-y-0.5 hover:shadow-lift'
                : 'cursor-not-allowed bg-slate-300'
            }`}
          >
            ✅ ตรวจคำตอบ
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-white px-8 py-4 text-lg font-extrabold text-primary ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary active:translate-y-0 active:scale-[0.98]"
          >
            ↺ เริ่มใหม่
          </button>
        </div>
      </div>

      {/* Incorrect grouping overlay */}
      {showIncorrectOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm animate-pop rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-slate-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger text-3xl font-bold text-white animate-shake">
              ✕
            </div>
            <h2 className="mb-2 text-2xl font-extrabold text-ink">
              ยังไม่ถูกต้อง!
            </h2>
            <p className="mb-6 text-muted">
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
                className="rounded-2xl bg-primary px-6 py-3 font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
              >
                แก้ไขการจัดกลุ่ม
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-2xl bg-white px-6 py-3 font-extrabold text-ink ring-1 ring-slate-200 transition-all duration-200 hover:ring-slate-300 active:scale-[0.98]"
              >
                เริ่มใหม่ทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success feedback (non-blocking) */}
      {isChecked && allCorrect && (
        <div className="mt-8 animate-pop text-center">
          <div className="inline-block rounded-2xl bg-white p-6 shadow-card ring-1 ring-slate-100">
            <p className="text-2xl font-extrabold text-accent">
              🎉 จัดกลุ่มถูกต้องทั้งหมด!
            </p>
            <p className="mt-2 font-bold text-muted">คุณทำได้เยี่ยมมาก</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupSortPage
