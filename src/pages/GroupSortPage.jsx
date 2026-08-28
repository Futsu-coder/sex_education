import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { groupSortItems, groups } from '../data/groupSort'

const GROUP_COLORS = ['#1368ce', '#26890c', '#d89e00', '#e21b3c']
const GROUP_SHADOWS = ['#0d4a99', '#1b6008', '#a17400', '#a6132c']

function GroupSortPage() {
  const [assigned, setAssigned] = useState(() => groups.map(() => []))
  const [isChecked, setIsChecked] = useState(false)
  const [showIncorrectOverlay, setShowIncorrectOverlay] = useState(false)
  const [dragItem, setDragItem] = useState(null)
  const [dragOverGroup, setDragOverGroup] = useState(null)
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
    if (!groups.every((_, gi) => groupIsCorrect(gi))) {
      setShowIncorrectOverlay(true)
    }
  }

  const reset = () => {
    setAssigned(groups.map(() => []))
    setIsChecked(false)
    setShowIncorrectOverlay(false)
    setDragItem(null)
    setDragOverGroup(null)
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
      )}

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

export default GroupSortPage
