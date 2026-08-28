import { Link } from 'react-router-dom'
import ImageCarousel from '../components/ImageCarousel'

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
    icon: '📝',
    title: 'แบบทดสอบ 4 ตัวเลือก',
    desc: 'ทดสอบความรู้ พร้อม feedback ทันที',
    to: '/quiz',
    primary: true,
  },
  {
    icon: '🃏',
    title: 'Flash Card',
    desc: 'ตอบ จริง/เท็จ แล้วพลิกดูเฉลย',
    to: '/flashcard',
    primary: false,
  },
  {
    icon: '🗂️',
    title: 'จัดกลุ่มคำศัพท์',
    desc: 'ลากคำศัพท์ไปวางในกลุ่มที่ถูก',
    to: '/groupsort',
    primary: false,
  },
]

function KnowledgePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-primary to-emerald-400 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white" />
          <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full bg-white" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            💊 คู่มือความรู้เรื่องสุขภาพ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Prep ก่อนเสี่ยง
            <br className="hidden md:block" /> Pep หลังเสี่ยง
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-teal-50">
            รู้ทัน ป้องกัน HIV ได้อย่างมั่นใจ
            — ด้วยแบบฝึกหัดที่ออกแบบมาให้เรียนรู้ได้จริง
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Image carousel */}
        <div className="rounded-2xl overflow-hidden shadow-sm mb-10">
          <ImageCarousel images={CAROUSEL_IMAGES} />
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {FEATURES.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className={`group rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                f.primary
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card border-2 border-slate-200 shadow-sm hover:border-primary'
              }`}
            >
              <span
                className={`text-3xl mb-3 block ${
                  f.primary ? '' : 'group-hover:scale-110 transition-transform'
                }`}
              >
                {f.icon}
              </span>
              <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
              <p
                className={`text-sm ${
                  f.primary ? 'text-teal-50' : 'text-muted'
                }`}
              >
                {f.desc}
              </p>
              <span
                className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${
                  f.primary ? 'text-white' : 'text-primary'
                }`}
              >
                เริ่มเลย
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default KnowledgePage
