import { Link } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'
import { PageBlobs } from '../components/ui'
import { CAROUSEL_IMAGES } from '../data/images'


const FEATURES = [
  {
    icon: '⏱️',
    title: 'เกม 72 ชั่วโมงสุดท้าย',
    desc: 'สวมบทบาทตัดสินใจเรื่อง PrEP / PEP',
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
  return (
    <PageBlobs variant="home">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        {/* Top bar */}
        <div className="mb-8 animate-fade-up text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm sm:text-base font-extrabold shadow-card border-2 border-[#cfd9e6]">
            <span className="text-lg">💊</span>
            <span className="bg-gradient-to-r from-[#2563eb] to-[#0d9488] bg-clip-text text-transparent">
              Prep ก่อนเสี่ยง · PEP หลังเสี่ยง
            </span>
          </span>
        </div>

        {/* Hero carousel */}
        <div
          className="mb-8 animate-fade-up overflow-hidden rounded-3xl shadow-card border-2 border-[#cfd9e6]"
          style={{ animationDelay: '0.1s' }}
        >
          <ImageCarousel images={CAROUSEL_IMAGES} interval={3000} />
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
                className="h-full rounded-2xl bg-white p-6 text-center shadow-card transition-all duration-300 border-2 border-[#cfd9e6] group-hover:-translate-y-1.5 group-hover:shadow-lift group-hover:border-primary"
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
    </PageBlobs>
  )
}

export default KnowledgePage
