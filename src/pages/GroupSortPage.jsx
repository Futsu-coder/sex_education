import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { groupSortItems, groups } from '../data/groupSort'

const GROUP_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500']

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

  const slotStyle = (gi) => {
    if (!isChecked) return 'border-slate-200'
    return groupIsCorrect(gi) ? 'border-success' : 'border-danger'
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
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-primary font-medium hover:underline">
            ← กลับหน้าแรก
          </Link>
          <span className="text-muted">
            จัดเรียงแล้ว {placedCount} / {totalItems}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2">จัดกลุ่มคำศัพท์ React</h1>
        <p className="text-muted mb-8">
          ลากคำศัพท์ไปวางลงในกลุ่มที่ถูกต้อง (หรือคลิก + เพื่อเพิ่ม)
        </p>

        {/* Available items */}
        <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">
            คำศัพท์ที่ต้องจัดวาง
          </h2>
          {placedCount === totalItems ? (
            <p className="text-success font-medium">
              จัดวางครบแล้ว! กดตรวจคำตอบได้เลย
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {groupSortItems.map((item) => (
                <span
                  key={item.text}
                  draggable={!isAssigned(item.text) && !isChecked}
                  onDragStart={(e) => handleDragStart(e, item.text, -1)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={handleDragEnd}
                  className={`rounded-lg px-4 py-2 font-medium text-ink select-none transition-all ${
                    isAssigned(item.text)
                      ? 'bg-slate-100 text-slate-300 border-2 border-slate-100'
                      : dragItem === item.text
                        ? 'bg-primary/10 border-2 border-primary text-primary opacity-50'
                        : 'bg-white border-2 border-slate-200 cursor-grab active:cursor-grabbing hover:border-primary shadow-sm'
                  }`}
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
              className={`bg-card rounded-2xl shadow-sm p-6 border-2 transition-colors ${
                isChecked
                  ? slotStyle(gi)
                  : dragOverGroup === gi
                    ? 'border-primary border-dashed scale-[1.01]'
                    : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${GROUP_COLORS[gi]}`} />
                <h3 className="font-semibold text-ink">{groupName}</h3>
                <span className="text-xs text-muted ml-auto">
                  {assigned[gi].length} รายการ
                </span>
              </div>

              {/* Drop zone content */}
              <div className="flex flex-wrap gap-2 min-h-[40px] rounded-lg p-2 -m-2">
                {assigned[gi].length === 0 ? (
                  <span className="text-sm text-muted self-center">
                    วางคำศัพท์ที่นี่ หรือคลิก + ด้านล่าง
                  </span>
                ) : (
                  assigned[gi].map((text) => (
                    <span
                      key={text}
                      draggable={!isChecked}
                      onDragStart={(e) => handleDragStart(e, text, gi)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={handleDragEnd}
                      className={`group relative bg-primary/10 text-primary border border-primary rounded-lg px-3 py-1.5 text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-colors ${
                        isChecked ? 'cursor-default' : 'hover:bg-primary/20'
                      }`}
                    >
                      {dragItem === text && !isChecked ? '⋯' : text}
                      {!isChecked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(text, gi)
                          }}
                          className="ml-1 text-primary/60 hover:text-danger"
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
                      className={`w-full text-left px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-150 ${
                        isAssigned(item.text) || isChecked
                          ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 text-muted hover:border-primary hover:text-primary'
                      }`}
                    >
                      + {item.text}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            type="button"
            onClick={checkAnswer}
            disabled={placedCount !== totalItems || isChecked}
            className={`font-medium px-8 py-3 rounded-xl transition-all duration-150 ${
              placedCount === totalItems && !isChecked
                ? 'bg-primary text-white hover:scale-105 hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            ตรวจคำตอบ
          </button>
          <button
            type="button"
            onClick={reset}
            className="bg-white text-ink border-2 border-slate-200 font-medium px-8 py-3 rounded-xl transition-all duration-150 hover:border-primary"
          >
            เริ่มใหม่
          </button>
        </div>
      </div>

      {/* Incorrect grouping overlay */}
      {showIncorrectOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-danger text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              ✕
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">
              Incorrect grouping
            </h2>
            <p className="text-muted mb-6">
              การจัดกลุ่มยังไม่ถูกต้องทั้งหมด กรุณาดูกลุ่มที่ติดสีแดงแล้วลองจัดใหม่
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsChecked(false)
                  setShowIncorrectOverlay(false)
                  setDragOverGroup(null)
                }}
                className="bg-primary text-white font-medium px-6 py-3 rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-md"
              >
                แก้ไขการจัดกลุ่ม
              </button>
              <button
                type="button"
                onClick={reset}
                className="bg-white text-ink border-2 border-slate-200 font-medium px-6 py-3 rounded-xl transition-all duration-150 hover:border-primary"
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
          <div className="bg-success/10 text-success border-2 border-success rounded-xl p-6">
            <p className="text-2xl font-bold">จัดกลุ่มถูกต้องทั้งหมด! 🎉</p>
            <p className="mt-2">คุณรู้จัก React ดีมาก</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupSortPage
