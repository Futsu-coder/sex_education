import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { groupSortItems, groups } from '../data/groupSort'

const GROUP_COLOR_STYLES = [
  { dot: 'bg-blue-500', bar: 'bg-blue-500', soft: 'bg-blue-50 text-blue-700' },
  { dot: 'bg-green-500', bar: 'bg-green-500', soft: 'bg-green-50 text-green-700' },
  { dot: 'bg-amber-500', bar: 'bg-amber-500', soft: 'bg-amber-50 text-amber-700' },
  { dot: 'bg-purple-500', bar: 'bg-purple-500', soft: 'bg-purple-50 text-purple-700' },
]

const itemGroup = (text) => groupSortItems.find((i) => i.text === text)?.group

function DraggableItem({ text, isPlaced, isDragging }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `unassigned-${text}`,
    data: { text, sourceGroup: -1 },
    disabled: isPlaced,
  })

  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`rounded-lg px-4 py-3 min-h-[44px] flex items-center font-medium text-ink select-none transition-all touch-none ${
        isPlaced
          ? 'bg-slate-100 text-slate-300 border-2 border-slate-100'
          : isDragging
            ? 'opacity-0'
            : 'bg-white border-2 border-slate-200 cursor-grab active:cursor-grabbing hover:border-primary shadow-sm'
      }`}
    >
      {text}
    </span>
  )
}

function GroupedItem({ text, groupIndex, isDragging, isLocked, isChecked, isCorrect, showIncorrect, onRemove }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `grouped-${text}`,
    data: { text, sourceGroup: groupIndex },
    disabled: isLocked || isChecked,
  })

  const isHighlightedWrong = !isCorrect && (isChecked || showIncorrect)

  const statusClass = isLocked
    ? 'bg-success/10 text-success border-success'
    : isHighlightedWrong
      ? 'bg-danger/10 text-danger border-danger'
      : 'bg-primary/10 text-primary border-primary'

  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative rounded-lg px-3 py-2 min-h-[44px] flex items-center gap-1 text-sm font-medium select-none transition-colors touch-none border ${statusClass} ${
        isLocked || isChecked
          ? 'cursor-default'
          : 'cursor-grab active:cursor-grabbing hover:bg-primary/20'
      } ${isDragging ? 'opacity-0' : ''}`}
    >
      {text}
      {isLocked && <span className="text-success">✓</span>}
      {isHighlightedWrong && (
        <span className="text-danger">✕</span>
      )}
      {!isLocked && !isChecked && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(text, groupIndex)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-primary/60 hover:text-danger -mr-2"
          aria-label={`ลบ ${text}`}
        >
          ✕
        </button>
      )}
    </span>
  )
}

function DroppableGroup({
  groupName,
  groupIndex,
  assignedItems,
  lockedItems,
  activeId,
  isOver,
  isChecked,
  hasIncorrect,
  color,
  onRemove,
}) {
  const { setNodeRef } = useDroppable({
    id: `group-${groupIndex}`,
    data: { groupIndex },
  })

  const isEmpty = assignedItems.length === 0
  const isGroupCorrect =
    !isEmpty && assignedItems.every((t) => lockedItems.includes(t))

  const borderClass = !isChecked && hasIncorrect
    ? 'border-danger'
    : isChecked
      ? isGroupCorrect
        ? 'border-success'
        : 'border-danger'
      : isOver
        ? 'border-primary bg-primary/5'
        : isEmpty
          ? 'border-slate-300 border-dashed'
          : 'border-slate-200'

  return (
    <div
      ref={setNodeRef}
      className={`bg-card rounded-2xl shadow-sm overflow-hidden border-2 transition-all ${borderClass} ${
        isOver ? 'scale-[1.01] shadow-md' : ''
      }`}
    >
      <div className={`h-1.5 w-full ${color.bar}`} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-3 h-3 rounded-full ${color.dot}`} />
          <h3 className="font-semibold text-ink">{groupName}</h3>
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ml-auto ${color.soft}`}>
            {assignedItems.length} รายการ
          </span>
        </div>

        {/* Drop zone content */}
        <div
          className={`flex flex-wrap gap-2 min-h-[56px] rounded-xl p-2 -m-2 transition-colors ${
            isOver ? 'ring-2 ring-primary/40 ring-inset' : ''
          }`}
        >
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center w-full text-center py-2 text-muted">
              <span className="text-2xl mb-1">⇩</span>
              <span className="text-sm">ลากคำศัพท์มาวางที่นี่</span>
            </div>
          ) : (
            assignedItems.map((text) => (
              <GroupedItem
                key={text}
                text={text}
                groupIndex={groupIndex}
                isDragging={activeId === `grouped-${text}`}
                isLocked={lockedItems.includes(text)}
                isChecked={isChecked}
                isCorrect={itemGroup(text) === groupName}
                showIncorrect={hasIncorrect}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function DragOverlayContent({ text }) {
  return (
    <div className="bg-primary text-white rounded-lg px-4 py-3 font-medium shadow-lg border-2 border-primary pointer-events-none">
      {text}
    </div>
  )
}

function IncorrectToast({ visible, count, onDismiss }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-danger text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-2xl font-bold">✕</span>
        <div className="flex-1 text-sm">
          <p className="font-bold">ยังมี {count} ข้อที่จัดผิด</p>
          <p className="opacity-90">ดูกลุ่มที่ติดสีแดงแล้วลองจัดใหม่ แล้วกดตรวจอีกครั้ง</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-white/80 hover:text-white font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="ปิด"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

function GroupSortPage() {
  const [assigned, setAssigned] = useState(() => groups.map(() => []))
  const [isChecked, setIsChecked] = useState(false)
  const [lockedItems, setLockedItems] = useState(() => [])
  const [showIncorrectToast, setShowIncorrectToast] = useState(false)
  const [hasIncorrect, setHasIncorrect] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [overGroupId, setOverGroupId] = useState(null)
  const [timeLeft, setTimeLeft] = useState(300)
  const [timeUp, setTimeUp] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    if (isChecked || timeUp || !hasStarted) return
    const timer = setTimeout(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setTimeUp(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, isChecked, timeUp, hasStarted])

  const totalItems = groupSortItems.length
  const placedCount = assigned.reduce((sum, g) => sum + g.length, 0)
  const lockedCount = lockedItems.length
  const allCorrect = lockedCount === totalItems

  const isLockedText = (text) => lockedItems.includes(text)
  const isAssigned = (text) =>
    assigned.some((group) => group.includes(text))

  const isCorrectlyPlaced = (text) => {
    const g = itemGroup(text)
    if (!g) return false
    const gi = groups.indexOf(g)
    return assigned[gi]?.includes(text) ?? false
  }

  const removeItem = (text, groupIndex) => {
    if (isChecked || timeUp || !hasStarted || isLockedText(text)) return
    setAssigned((prev) =>
      prev.map((group, gi) =>
        gi === groupIndex ? group.filter((t) => t !== text) : group,
      ),
    )
  }

  const checkAnswer = () => {
    if (isChecked || timeUp || !hasStarted) return

    const newlyLocked = groupSortItems
      .filter((i) => !isLockedText(i.text) && isCorrectlyPlaced(i.text))
      .map((i) => i.text)

    const nextLocked = [...new Set([...lockedItems, ...newlyLocked])]
    setLockedItems(nextLocked)

    const correctItems = groupSortItems.filter(
      (i) => nextLocked.includes(i.text) || isCorrectlyPlaced(i.text),
    ).length
    const allResolved = correctItems === totalItems && placedCount === totalItems

    if (allResolved) {
      setHasIncorrect(false)
      setShowIncorrectToast(false)
      setIsChecked(true)
      return
    }

    const wrongItems = groupSortItems.filter(
      (i) => isAssigned(i.text) && !nextLocked.includes(i.text) && !isCorrectlyPlaced(i.text),
    )
    setHasIncorrect(wrongItems.length > 0)
    setShowIncorrectToast(wrongItems.length > 0)
  }

  const reset = () => {
    setAssigned(groups.map(() => []))
    setIsChecked(false)
    setLockedItems([])
    setShowIncorrectToast(false)
    setHasIncorrect(false)
    setActiveId(null)
    setOverGroupId(null)
    setTimeUp(false)
    setTimeLeft(300)
    setHasStarted(true)
  }

  const activeText = activeId
    ? activeId.replace('unassigned-', '').replace('grouped-', '')
    : null

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event) => {
    const overId = event.over?.id
    if (overId && String(overId).startsWith('group-')) {
      setOverGroupId(Number(String(overId).replace('group-', '')))
    } else {
      setOverGroupId(null)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    setOverGroupId(null)

    if (!over || isChecked || timeUp || !hasStarted) return

    const text = active.data.current?.text
    const sourceGroup = active.data.current?.sourceGroup
    const targetGroupId = over.data.current?.groupIndex

    if (text == null || targetGroupId == null) return
    if (isLockedText(text)) return

    setAssigned((prev) =>
      prev.map((group, gi) => {
        if (gi === sourceGroup && sourceGroup !== -1) {
          return group.filter((t) => t !== text)
        }
        if (gi === targetGroupId) {
          if (group.includes(text)) return group
          return [...group, text]
        }
        return group
      }),
    )
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setOverGroupId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen relative px-4 py-8 pb-36">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="text-primary font-medium hover:underline">
              ← กลับหน้าแรก
            </Link>
            <div className="flex items-center gap-3">
              <span
                className={`font-mono text-lg font-bold tabular-nums rounded-lg px-3 py-1.5 border-2 ${
                  timeLeft <= 60
                    ? 'bg-danger/10 text-danger border-danger'
                    : 'bg-white text-ink border-slate-200'
                }`}
              >
                ⏱ {timeLeft}s
              </span>
              <span className="text-muted">
                ถูกต้อง {lockedCount} / {totalItems}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-ink mb-2">จัดกลุ่มคำศัพท์ React</h1>
          <p className="text-muted mb-8">
            ลากคำศัพท์ไปวางลงในกลุ่มที่ถูกต้อง แล้วกดตรวจคำตอบ (ข้อที่ถูกจะล็อกไว้)
          </p>

          {/* Available items */}
          <div className="bg-card rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">
              คำศัพท์ที่ต้องจัดวาง
            </h2>
            {allCorrect ? (
              <p className="text-success font-medium">
                จัดวางครบและถูกต้องทั้งหมด!
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {groupSortItems
                  .filter((i) => !isLockedText(i.text))
                  .map((item) => (
                    <DraggableItem
                      key={item.text}
                      text={item.text}
                      isPlaced={isAssigned(item.text)}
                      isDragging={activeId === `unassigned-${item.text}`}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((groupName, gi) => (
              <DroppableGroup
                key={groupName}
                groupName={groupName}
                groupIndex={gi}
                assignedItems={assigned[gi]}
                lockedItems={lockedItems}
                activeId={activeId}
                isOver={overGroupId === gi}
                isChecked={isChecked}
                hasIncorrect={hasIncorrect && !isChecked}
                color={GROUP_COLOR_STYLES[gi]}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Unlocked hint */}
          {!isChecked && lockedCount > 0 && placedCount > lockedCount && (
            <p className="text-center text-sm text-muted mt-4">
              เหลือ {placedCount - lockedCount} ข้อที่ยังต้องตรวจ
            </p>
          )}

          {/* Incorrect toast */}
          <IncorrectToast
            visible={showIncorrectToast}
            count={groupSortItems.filter(
              (i) => isAssigned(i.text) && !lockedItems.includes(i.text) && !isCorrectlyPlaced(i.text),
            ).length}
            onDismiss={() => setShowIncorrectToast(false)}
          />

          {/* Success popup */}
          {isChecked && allCorrect && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-success text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  🎉
                </div>
                <h2 className="text-xl font-bold text-ink mb-2">
                  จัดกลุ่มถูกต้องทั้งหมด!
                </h2>
                <p className="text-muted">
                  คุณรู้จัก React ดีมาก
                </p>
                <div className="mt-4 mb-6 bg-success/10 text-success border-2 border-success rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide font-semibold">คะแนนของคุณ</p>
                  <p className="text-3xl font-bold mt-1">
                    {lockedCount} <span className="text-lg text-muted font-normal">/ {totalItems}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="bg-primary text-white font-medium px-6 py-4 min-h-[48px] rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-md"
                  >
                    เริ่มใหม่
                  </button>
                  <Link
                    to="/"
                    className="bg-white text-ink border-2 border-slate-200 font-medium px-6 py-4 min-h-[48px] rounded-xl transition-all duration-150 hover:border-primary"
                  >
                    กลับหน้าหลัก
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Time up popup */}
          {timeUp && !allCorrect && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-danger text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  ⏱
                </div>
                <h2 className="text-xl font-bold text-ink mb-2">
                  หมดเวลา!
                </h2>
                <p className="text-muted">
                  เวลาในการจัดกลุ่มคำศัพท์หมดแล้ว
                </p>
                <div className="mt-4 mb-6 bg-danger/10 text-danger border-2 border-danger rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide font-semibold">คะแนนของคุณ</p>
                  <p className="text-3xl font-bold mt-1">
                    {lockedCount} <span className="text-lg text-muted font-normal">/ {totalItems}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="bg-primary text-white font-medium px-6 py-4 min-h-[48px] rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-md"
                  >
                    เริ่มใหม่
                  </button>
                  <Link
                    to="/"
                    className="bg-white text-ink border-2 border-slate-200 font-medium px-6 py-4 min-h-[48px] rounded-xl transition-all duration-150 hover:border-primary"
                  >
                    กลับหน้าหลัก
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky action bar */}
      {hasStarted && !isChecked && !timeUp && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-4xl mx-auto px-4 py-3 flex gap-3">
            <button
              type="button"
              onClick={checkAnswer}
              disabled={isChecked || timeUp || placedCount === 0}
              className={`flex-1 font-medium px-6 py-4 min-h-[48px] rounded-xl transition-all duration-150 ${
                !isChecked && !timeUp && placedCount > 0
                  ? 'bg-primary text-white hover:scale-[1.02] hover:shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isChecked ? 'ตรวจเสร็จแล้ว' : 'ตรวจคำตอบ'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="bg-white text-ink border-2 border-slate-200 font-medium px-6 py-4 min-h-[48px] rounded-xl transition-all duration-150 hover:border-primary"
            >
              เริ่มใหม่
            </button>
          </div>
        </div>
      )}

      {/* Start popup */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              🧩
            </div>
            <h2 className="text-xl font-bold text-ink mb-2">
              จัดกลุ่มคำศัพท์ React
            </h2>
            <p className="text-muted mb-2">
              ลากคำศัพท์ไปวางลงในกลุ่มให้ถูกต้อง มีทั้งหมด {totalItems} คำ
            </p>
            <p className="text-muted mb-6">
              ⏱ มีเวลาให้ทำ 5 นาที
            </p>
            <button
              type="button"
              onClick={() => setHasStarted(true)}
              className="bg-primary text-white font-medium px-8 py-4 min-h-[48px] rounded-xl transition-all duration-150 hover:scale-105 hover:shadow-md w-full"
            >
              เริ่มเล่น
            </button>
          </div>
        </div>
      )}

      <DragOverlay dropAnimation={null}>
        {activeText ? <DragOverlayContent text={activeText} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default GroupSortPage
