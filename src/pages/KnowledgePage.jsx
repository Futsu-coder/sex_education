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
    to: '/quiz',
    color: '#e21b3c',
  },
  {
    icon: '🃏',
    title: 'Flash Card',
    desc: 'จริง/เท็จ พลิกดูเฉลย',
    to: '/flashcard',
    color: '#d89e00',
  },
  {
    icon: '🧩',
    title: 'จัดกลุ่มคำศัพท์',
    desc: 'ลากคำศัพท์ไปให้ถูกหมวด',
    to: '/groupsort',
    color: '#26890c',
  },
]

function KnowledgePage() {
  const navigate = useNavigate()

  const startRandomGame = () => {
    const random = GAME_LINKS[Math.floor(Math.random() * GAME_LINKS.length)]
    navigate(random)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-center mb-8">
          <GameCard color="#ffffff" className="px-6 py-2">
            <span className="text-xl font-extrabold text-[#1368ce]">💊 Prep ก่อนเสี่ยง · PEP หลังเสี่ยง</span>
          </GameCard>
        </div>

        {/* Hero carousel */}
        <div className="rounded-3xl overflow-hidden mb-8 border-4 border-white">
          <ImageCarousel images={CAROUSEL_IMAGES} />
        </div>

        {/* Start button */}
        <div className="text-center mb-10">
          <GameButton
            color="#26890c"
            className="w-full sm:w-auto text-2xl px-12 py-5"
            onClick={startRandomGame}
          >
            🚀 เริ่มทำแบบทดสอบ
          </GameButton>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="block rounded-2xl transition-transform hover:-translate-y-1"
              style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.25)', backgroundColor: f.color }}
            >
              <div className="p-6 text-center text-white">
                <span className="text-5xl mb-3 block">{f.icon}</span>
                <h3 className="text-xl font-extrabold mb-1">{f.title}</h3>
                <p className="text-white/90 text-sm">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KnowledgePage
