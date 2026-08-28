import { Link, useNavigate } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'
import { GameButton, GameCard } from '../components/ui'

const GAME_LINKS = ['/quiz', '/flashcard', '/groupsort']

const CAROUSEL_IMAGES = [
  '/รูปตัวอย่าง/1.jpg',
  '/รูปตัวอย่าง/2.jpg',
  '/รูปตัวอย่าง/3.jpg',
  '/รูปตัวอย่าง/4.jpg',
  '/รูปตัวอย่าง/5.jpg',
  '/รูปตัวอย่าง/6.jpg',
]

const FEATURES = [
  {
    icon: '🎯',
    title: 'เกมตอบคำถาม',
    desc: 'ทดสอบความรู้ พร้อมคะแนนสะสม',
    mode: 'quiz',
    to: '/quiz',
    accent: '#2563eb',
    soft: '#dbeafe',
    progress: 'bg-[#2563eb]',
  },
  {
    icon: '🃏',
    title: 'Flash Card',
    desc: 'จริง/เท็จ พลิกดูเฉลย',
    mode: 'flashcard',
    to: '/flashcard',
    accent: '#0d9488',
    soft: '#ccfbf1',
    progress: 'bg-[#0d9488]',
  },
  {
    icon: '🧩',
    title: 'จัดกลุ่มคำศัพท์',
    desc: 'ลากคำศัพท์ไปให้ถูกหมวด',
    mode: 'groupsort',
    to: '/groupsort',
    accent: '#d97706',
    soft: '#fef3c7',
    progress: 'bg-[#d97706]',
  },
]

function KnowledgePage() {
  const navigate = useNavigate()

  const startRandomGame = () => {
    const random = GAME_LINKS[Math.floor(Math.random() * GAME_LINKS.length)]
    navigate(random)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative soft shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#2563eb]/[0.07] blur-2xl" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#0d9488]/[0.08] blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[#8b5cf6]/[0.06] blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Top bar */}
        <div className="mb-8 animate-fade-up text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm sm:text-base font-extrabold shadow-card ring-1 ring-slate-100">
            <span className="text-lg">💊</span>
            <span className="bg-gradient-to-r from-[#2563eb] to-[#0d9488] bg-clip-text text-transparent">
              Prep ก่อนเสี่ยง · PEP หลังเสี่ยง
            </span>
          </span>
        </div>

        {/* Hero carousel */}
        <div
          className="mb-8 animate-fade-up overflow-hidden rounded-3xl shadow-card ring-1 ring-slate-100"
          style={{ animationDelay: '0.1s' }}
        >
          <ImageCarousel images={CAROUSEL_IMAGES} />
        </div>

        {/* Start button */}
        <div
          className="mb-10 animate-fade-up text-center"
          style={{ animationDelay: '0.2s' }}
        >
          <GameButton
            color="#0d9488"
            className="w-full px-12 py-5 text-2xl sm:w-auto"
            onClick={startRandomGame}
          >
            <span className="animate-bounce-slow inline-block">🚀</span>
            เริ่มทำแบบทดสอบ
          </GameButton>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Link
              key={f.to}
              to={f.to}
              className="group block animate-fade-up"
              style={{ animationDelay: `${0.3 + i * 0.12}s` }}
            >
              <div
                className="h-full rounded-2xl bg-white p-6 text-center shadow-card transition-all duration-300 ring-1 ring-slate-100 group-hover:-translate-y-1.5 group-hover:shadow-lift group-hover:ring-slate-200"
              >
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ backgroundColor: f.soft }}
                >
                  <span className="animate-bounce-slow" style={{ animationDelay: `${i * 0.3}s` }}>
                    {f.icon}
                  </span>
                </div>
                <h3 className="mb-1 text-xl font-extrabold" style={{ color: f.accent }}>
                  {f.title}
                </h3>
                <p className="text-sm text-muted">{f.desc}</p>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full w-0 rounded-full transition-all duration-500 ${f.progress} group-hover:w-full`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KnowledgePage
