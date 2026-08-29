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
import { Confetti, PageBlobs } from '../components/ui'

const GROUP_COLORS = ['#2563eb', '#0d9488', '#d97706', '#dc2626']
const GROUP_SHADOWS = ['#1d4ed8', '#0f766e', '#b45309', '#b91c1c']

const itemGroup = (text) => groupSortItems.find((i) => i.text === text)?.group

function DraggableItem({ text, isPlaced, isDragging }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `unassigned-${text}`,
    data: { text, sourceGroup: -1 },
    disabled: isPlaced,
  })

  const idx = groupSortItems.findIndex((i) => i.text === text)

  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`rounded-xl px-4 py-2 min-h-[44px] flex items-center font-extrabold text-white select-none transition-all touch-none ${
        isPlaced
          ? 'opacity-30'
          : isDragging
            ? 'opacity-0'
            : 'cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-card'
      }`}
      style={{
        backgroundColor: GROUP_COLORS[idx % GROUP_COLORS.length],
        boxShadow: `0 4px 0 ${GROUP_SHADOWS[idx % GROUP_SHADOWS.length]}`,
      }}
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

  return (
    <span
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative flex min-h-[44px] select-none items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors touch-none ${
        isLocked
          ? 'bg-white text-accent ring-2 ring-accent'
          : isHighlightedWrong
            ? 'bg-danger/10 text-danger ring-2 ring-danger'
            : 'bg-white text-ink ring-2 ring-slate-200 animate-pop-in'
      } ${
        isLocked || isChecked
          ? 'cursor-default'
          : 'cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-card'
      } ${isDragging ? 'opacity-0' : ''}`}
    >
      {text}
      {isLocked && <span className="text-accent">✓</span>}
      {isHighlightedWrong && <span className="text-danger">✕</span>}
      {!isLocked && !isChecked && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(text, groupIndex)
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="ml-1 flex min-h-[44px] min-w-[44px] -mr-2 items-center justify-center text-primary/60 hover:text-danger"
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
  onRemove,
}) {
  const { setNodeRef } = useDroppable({
    id: `group-${groupIndex}`,
    data: { groupIndex },
  })

  const isEmpty = assignedItems.length === 0
  const isGroupCorrect =
    !isEmpty && assignedItems.every((t) => lockedItems.includes(t))

  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl bg-white p-6 shadow-card transition-all duration-200 ${
        !isChecked && hasIncorrect ? 'scale-[1.02]' : ''
      }`}
      style={{
        borderWidth: 4,
        borderStyle: 'solid',
        borderColor: !isChecked && hasIncorrect
          ? '#dc2626'
          : isChecked && isGroupCorrect
            ? '#0d9488'
            : isChecked && !isEmpty
              ? '#dc2626'
              : isOver
                ? '#2563eb'
                : isEmpty
                  ? '#cbd5e1'
                  : '#cfd9e6',
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className="h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: GROUP_COLORS[groupIndex] }}
        >
          {isGroupCorrect ? '✓' : ''}
        </span>
        <h3 className="text-lg font-extrabold text-ink">{groupName}</h3>
        <span className="ml-auto text-xs font-bold text-muted">
          <span className="tabular-nums">{assignedItems.length}</span> รายการ
        </span>
      </div>

      <div className="flex min-h-[56px] flex-wrap gap-2 rounded-xl bg-slate-50 p-2 border border-slate-200">
        {isEmpty ? (
          <span
            className={`self-center px-1 text-sm text-muted transition-colors ${
              isOver ? 'text-primary' : ''
            }`}
          >
            ⇩ ลากคำศัพท์มาวางที่นี่ หรือคลิก + ด้านล่าง
          </span>
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
  )
}

function IncorrectToast({ visible, count, onDismiss }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-24 left-1/2 z-30 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-xl bg-danger px-4 py-3 text-white shadow-lg">
        <span className="text-2xl font-bold">✕</span>
        <div className="flex-1 text-sm">
          <p className="font-bold">ยังมี {count} ข้อที่จัดผิด</p>
          <p className="opacity-90">ดูกลุ่มที่ติดสีแดงแล้วลองจัดใหม่ แล้วกดตรวจอีกครั้ง</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center font-medium text-white/80 hover:text-white"
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
  const [showConfetti, setShowConfetti] = useState(false)

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

  const assignItem = (text, groupIndex) => {
    if (isAssigned(text) || isChecked || timeUp || !hasStarted || isLockedText(text)) return
    setAssigned((prev) =>
      prev.map((group, gi) =>
        gi === groupIndex ? [...group, text] : group,
      ),
    )
  }

  const removeItem = (text, groupIndex) => {
    if (isChecked || timeUp || !hasStarted || isLockedText(text)) return
    setAssigned((prev) =>
      prev.map((group, gi) =>
        gi === groupIndex ? group.filter((t) => t !== text) : group,
      ),
    )
  }

  const wrongItemsCount = () =>
    groupSortItems.filter(
      (i) => isAssigned(i.text) && !lockedItems.includes(i.text) && !isCorrectlyPlaced(i.text),
    ).length

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
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
      return
    }

    const wrong = wrongItemsCount()
    setHasIncorrect(wrong > 0)
    setShowIncorrectToast(wrong > 0)
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
    setShowConfetti(false)
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

  const startGame = () => {
    setHasStarted(true)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <PageBlobs variant="groupsort">
        {showConfetti && <Confetti />}
        <div
          className="mx-auto max-w-4xl px-4 py-8"
          style={hasStarted ? undefined : { height: '100vh', overflow: 'hidden' }}
        >
          {/* Header */}
          <div className="mb-6 flex animate-fade-up items-center justify-between">
            <Link to="/" className="text-lg font-bold hover:underline">
              ← จัดกลุ่มคำศัพท์
            </Link>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-xl border-2 bg-white px-4 py-1.5 font-extrabold tabular-nums ${
                  timeLeft <= 60
                    ? 'border-danger text-danger'
                    : 'border-[#cfd9e6] text-ink'
                }`}
              >
                ⏱ {timeLeft}s
              </span>
              <span className="rounded-xl border-2 border-[#cfd9e6] bg-white px-4 py-1.5 font-extrabold text-primary">
                ถูกต้อง <span className="tabular-nums">{lockedCount}</span> / {totalItems}
              </span>
            </div>
          </div>

          <div className="mb-8 animate-fade-up text-center" style={{ animationDelay: '0.05s' }}>
            <h1 className="mb-2 text-3xl font-extrabold sm:text-4xl">
              🧩 จัดกลุ่มคำศัพท์
            </h1>
            <p className="text-muted">
              ลากคำศัพท์ไปวางในกลุ่มที่ถูกต้อง (หรือคลิก + เพื่อเพิ่ม) ข้อที่ถูกจะล็อกไว้
              ⏱ มีเวลาให้ทำ 5 นาที
            </p>
          </div>

          {/* Available items */}
          <div
            className="mb-8 animate-fade-up rounded-3xl bg-white p-6 shadow-card border-2 border-[#cfd9e6]"
            style={{ animationDelay: '0.1s' }}
          >
            <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-primary">
              🎒 คำศัพท์ที่ต้องจัดวาง
            </h2>
            {allCorrect ? (
              <p className="font-extrabold text-accent">✅ จัดวางครบและถูกต้องทั้งหมด!</p>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                onRemove={removeItem}
                onAssign={assignItem}
              />
            ))}
          </div>

          {/* Unlocked hint */}
          {!isChecked && lockedCount > 0 && placedCount > lockedCount && (
            <p className="mt-4 text-center text-sm text-muted">
              เหลือ {placedCount - lockedCount} ข้อที่ยังต้องตรวจ
            </p>
          )}

          {/* Actions */}
          {!isChecked && !timeUp && (
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={checkAnswer}
                disabled={placedCount === 0}
                className={`rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition-all duration-200 active:translate-y-0 active:scale-[0.98] ${
                  placedCount > 0
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
          )}
        </div>

        {/* Incorrect toast */}
        <IncorrectToast
          visible={showIncorrectToast}
          count={wrongItemsCount()}
          onDismiss={() => setShowIncorrectToast(false)}
        />

        {/* Success popup */}
        {isChecked && allCorrect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm animate-pop rounded-3xl border-2 border-[#cfd9e6] bg-white p-8 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl font-bold text-white">
                🎉
              </div>
              <h2 className="mb-2 text-2xl font-extrabold text-ink">
                จัดกลุ่มถูกต้องทั้งหมด!
              </h2>
              <p className="text-muted">
                คุณรู้จักคำศัพท์ชุดนี้ดีมาก
              </p>
              <div className="mx-auto my-4 max-w-xs rounded-2xl bg-accent-light p-4 text-accent">
                <p className="text-xs font-extrabold uppercase tracking-wide">
                  คะแนนของคุณ
                </p>
                <p className="mt-1 text-3xl font-bold">
                  {lockedCount} <span className="text-lg font-normal text-muted">/ {totalItems}</span>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-2xl bg-primary px-6 py-4 text-lg font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
                >
                  🔄 เล่นอีกครั้ง
                </button>
                <Link
                  to="/"
                  className="rounded-2xl bg-white px-6 py-4 text-lg font-extrabold text-primary ring-1 ring-slate-200 transition-all duration-200 hover:ring-primary active:scale-[0.98]"
                >
                  ← กลับหน้าแรก
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Time up popup */}
        {timeUp && !allCorrect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm animate-pop rounded-3xl border-2 border-[#cfd9e6] bg-white p-8 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger text-3xl font-bold text-white animate-shake">
                ⏱
              </div>
              <h2 className="mb-2 text-2xl font-extrabold text-ink">
                หมดเวลา!
              </h2>
              <p className="text-muted">
                เวลาในการจัดกลุ่มคำศัพท์หมดแล้ว
              </p>
              <div className="mx-auto my-4 max-w-xs rounded-2xl bg-danger-light p-4 text-danger">
                <p className="text-xs font-extrabold uppercase tracking-wide">
                  คะแนนของคุณ
                </p>
                <p className="mt-1 text-3xl font-bold">
                  {lockedCount} <span className="text-lg font-normal text-muted">/ {totalItems}</span>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-2xl bg-primary px-6 py-4 text-lg font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
                >
                  🔄 เล่นอีกครั้ง
                </button>
                <Link
                  to="/"
                  className="rounded-2xl bg-white px-6 py-4 text-lg font-extrabold text-primary ring-1 ring-slate-200 transition-all duration-200 hover:ring-primary active:scale-[0.98]"
                >
                  ← กลับหน้าแรก
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Start popup */}
        {!hasStarted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm animate-pop rounded-3xl border-2 border-[#cfd9e6] bg-white p-8 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white">
                🧩
              </div>
              <h2 className="mb-2 text-2xl font-extrabold text-ink">
                จัดกลุ่มคำศัพท์
              </h2>
              <p className="mb-2 text-muted">
                ลากคำศัพท์ไปวางลงในกลุ่มให้ถูกต้อง มีทั้งหมด {totalItems} คำ
              </p>
              <p className="mb-6 font-extrabold text-primary">⏱ มีเวลาให้ทำ 5 นาที</p>
              <button
                type="button"
                onClick={startGame}
                className="w-full rounded-2xl bg-primary px-8 py-4 text-lg font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 active:scale-[0.98]"
              >
                ▶ เริ่มเล่น
              </button>
            </div>
          </div>
        )}

        <DragOverlay dropAnimation={null}>
          {activeText ? (
            <div className="pointer-events-none rounded-xl border-2 border-white bg-primary px-4 py-2 font-extrabold text-white shadow-lift">
              {activeText}
            </div>
          ) : null}
        </DragOverlay>
      </PageBlobs>
    </DndContext>
  )
}

export default GroupSortPage
