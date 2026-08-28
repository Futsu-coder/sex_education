import { Link } from 'react-router-dom'

function KnowledgePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          เรียนรู้ React เบื้องต้น
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-blue-100">
          ทำความรู้จักกับ React ไลบรารีสำหรับสร้าง User Interface ยอดนิยม
          จากนั้นทดสอบความรู้ของคุณทันที
        </p>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <section className="bg-card rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-ink">
            React คืออะไร?
          </h2>
          <p className="text-ink leading-relaxed pb-6">
            React คือ JavaScript library สำหรับสร้าง User Interface
            พัฒนาโดย Meta (Facebook) นิยมใช้สร้าง Web Application
            ที่มีหน้าจอ interactive และต้องอัปเดตข้อมูลตลอดเวลา
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-ink">
            ทำไมต้อง React?
          </h2>
          <ul className="space-y-3 text-ink list-disc list-inside">
            <li>ใช้ Virtual DOM เพื่อเพิ่มความเร็วในการอัปเดตหน้าจอ</li>
            <li>Component-based ช่วยให้โค้ดเป็นระเบียบและนำกลับมาใช้ใหม่ได้</li>
            <li>มี system นิเวศน์ที่ใหญ่และ community ที่แข็งแกร่ง</li>
            <li>ใช้ React Hooks จัดการ state ได้ง่ายและสะอาด</li>
            <li>รองรับ TypeScript และเครื่องมือพัฒนาได้ดี</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-muted mb-6">
            พร้อมแล้วหรือยัง? เลือกรูปแบบทดสอบที่อยากลองทำ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quiz"
              className="inline-block bg-primary text-white text-lg font-medium px-8 py-4 rounded-xl shadow-md transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              แบบทดสอบ 4 ตัวเลือก
            </Link>
            {/* <Link
              to="/flashcard"
              className="inline-block bg-white text-primary border-2 border-primary text-lg font-medium px-8 py-4 rounded-xl transition-all duration-150 ease-in-out hover:bg-primary/5"
            >
              Flash Card
            </Link> */}
            <Link
              to="/groupsort"
              className="inline-block bg-white text-primary border-2 border-primary text-lg font-medium px-8 py-4 rounded-xl transition-all duration-150 ease-in-out hover:bg-primary/5"
            >
              จัดกลุ่มคำศัพท์
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default KnowledgePage
