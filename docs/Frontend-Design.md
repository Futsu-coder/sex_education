# Frontend Design Document: Knowledge & Quiz App

## 1. Design Concept & Theme
- **Style:** Clean, modern, minimalist, and **professional/trustworthy** (เหมาะกับเนื้อหาเชิงสุขภาพ).
- **Focus:** High readability on the Knowledge Page and engaging, immediate feedback on all interactive pages (Quiz / FlashCard / GroupSort).
- **Approach:** Mobile-first responsive design (Tailwind breakpoints `sm:`, `md:`).
- **Direction:** เปลี่ยนจากธีมเดิม (สีม่วงสด Kahoot-style) มาเป็นธีมสะอาดโทนฟ้า/ขาว พร้อม animation เต็มรูปแบบ (`fade-up`, `pop`, `shake`, `confetti`, `bounce`).

## 2. Theme Configuration & Color Palette
ธีมตั้งค่าผ่าน **Tailwind CSS v4 `@theme`** ในไฟล์ `src/index.css` (ไม่มี `tailwind.config.js`)

| Token | ค่า | ใช้ |
|---|---|---|
| `primary` | `#2563eb` (blue-600) | ปุ่มหลัก, ลิงก์, header |
| `primary-dark` | `#1d4ed8` | เงา/สถานะกด |
| `primary-light` | `#dbeafe` | พื้นหลัง badge/soft accent |
| `accent` | `#0d9488` (teal-600) | ความสำเร็จ/ถูกต้อง |
| `accent-light` | `#ccfbf1` | พื้นหลัง feedback ถูก |
| `danger` | `#dc2626` (red-600) | ผิดพลาด |
| `danger-light` | `#fee2e2` | พื้นหลัง feedback ผิด |
| `warning` | `#d97706` (amber-600) | เตือน |
| `warning-light` | `#fef3c7` | พื้นหลังเตือน |
| `card` | `#ffffff` | กล่องเนื้อหา |
| `surface` | `#f6f9fe` | พื้นหลังหลัก (ฟ้าอ่อน) |
| `ink` | `#1f2937` | ข้อความหลัก |
| `muted` | `#6b7280` | ข้อความรอง |
| `line` | `#cfd9e6` | สีขอบการ์ด (มองเห็นชัด) |
| `shadow-soft` | soft blue glow | เงาปุ่ม/ลอย |
| `shadow-card` | soft slate | เงาการ์ด |
| `shadow-lift` | strong blue glow | เงาตอน hover ลอย |

### 2.1 ระบบพื้นหลัง (Background System)
พื้นหลังเป็น **layered** หลายชั้นผ่าน `body` + pseudo-elements ใน `src/index.css`:

| Layer | วิธี | รายละเอียด |
|---|---|---|
| Base gradient | `body background-image` | radial blur (blue/teal) มุมบน + linear fade `surface → #fff` |
| **Blobs กระจายทั่วจอ** | `body::before` | 5 blobs สี blur (ม่วง/ฟ้า/teal) กระจายครบจอ + animation `bg-drift` (ขยับช้าๆ) |
| **Dot + Noise** | `body::after` | dot pattern ละเอียด + SVG fractalNoise (opacity ต่ำ) ~ texture มืออาชีพ |
| **Per-page accent blobs** | `PageBlobs` component | blob เบลอตาม variant (home/quiz/flashcard/groupsort) |
| **Floating emoji** | `FloatingElements` component | อิโมจิลอย/หมุนช้าๆ หลังเนื้อหา |
| **Cursor glow** | `CursorGlow` component (App.jsx) | glitter เบาๆ ติดตาม cursor (rAF + lerp) |

- `prefers-reduced-motion` → ปิด animation ทั้ง `body::before` และ `.floating-element`
- องค์ประกอบพื้นหลัง **opacity ต่ำ + pointer-events-none + z-index ต่ำกว่าเนื้อหา** เสมอ

### 2.2 กรอบการ์ดที่มองเห็นชัด (Visible Card Borders)
การ์ดสีขาวทุกใบใช้ขอบชัดเจน `border-2 border-[#cfd9e6]` (หรือ `border-line`) แทน `ring-1 ring-slate-100` ที่มองไม่ค่อยเห็น — ปกติขอบ slate อ่อน เปลี่ยนเป็น primary เมื่อ hover/ลาก-วาง, เขียว/แดงเมื่อตรวจคำตอบ.

## 3. Typography
- **Font Family:** `Manrope` (UI สะอาด เป็นทางการ) + `Prompt` (สำหรับภาษาไทย) ตั้งไว้ใน `index.html` และ `--font-sans`
- **Scale:**
  - Heading: `font-extrabold`, ขนาดตามบริบท (`text-2xl`–`text-4xl`)
  - Body: `text-base`–`text-lg` regular
  - Button: `text-lg` extrabold, `tracking-wide`

## 4. Layout & Structure

### 4.1 Knowledge Page (`/`) — `KnowledgePage.jsx`
- **Container:** `max-w-4xl` centered, wrapped ใน `PageBlobs variant="home"`.
- **Top bar:** ข้อความหัวข้อใน pill สีขาว + gradient text (blue→teal), เป็นทางการ.
- **Hero carousel** (`ImageCarousel`): รูปเลื่อนพร้อมลูกศร white soft shadow + dots animation (teal เมื่อ active เป็น bar).
- **CTA:** ปุ่ม "เริ่มทำแบบทดสอบ" `accent` ใหญ่กลางหน้า พร้อม rocket `bounce-slow`.
- **Feature cards** (3 ใบ → Quiz / FlashCard / GroupSort):
  - แต่ละใบมี icon ในกล่อง soft color, title สี accent เฉพาะ, progress bar ที่ไหลเต็มเมื่อ hover, ขอบ `border-line` (เปลี่ยนเป็น primary เมื่อ hover).
  - **Animation:** เข้าหน้าแบบ **stagger fade-up** ทีละใบ, icon โบก (bounce), hover เงยขึ้น + shadow-lift + progress bar เต็ม.

### 4.2 Quiz Page (`/quiz`) — `QuizPage.jsx`
- **Layout:** Card กลางจอ `max-w-2xl`, wrapped ใน `PageBlobs variant="quiz"`.
- **Header:** ลิงก์กลับ + คะแนนตัวเลข.
- **Progress bar:** แบบบาง (`h-2.5`), สีเปลี่ยนตามคำถาม, width animated.
- **Options (2x2 grid / 1 col mobile):** สี 4 สีใหม่
  - Red `#dc2626` / Blue `#2563eb` / Amber `#d97706` / Teal `#0d9488`.
- **Option states:**
  - *Default:* สีพื้น + shadow เล็ก, hover เงยขึ้น + shadow-lift.
  - *Correct pick:* `animate-pop` + ring เขียว + ✅.
  - *Wrong pick:* `animate-shake` + ❌ + ตัวอื่น dim (opacity-40).
- **Feedback bar:** badge pop ใต้ตัวเลือก แสดง "ถูกต้อง!" (เขียว light) / "ยังไม่ถูก" (แดง light).
- **Result screen:** icon ขนาดใหญ่ pop ตามผล (🏆/🎉/💪), คะแนนแสดงผ่าน `AnimatedNumber` (นับขึ้น), ปุ่ม "เล่นอีกครั้ง" / "กลับหน้าแรก", ฉลองด้วย **Confetti**.

### 4.3 Flash Card Page (`/flashcard`) — `FlashCardPage.jsx`
- **Layout:** การ์ดพลิก 3D (`perspective`, `preserve-3d`, `backface-visibility`) กลางจอ `max-w-lg`, wrapped ใน `PageBlobs variant="flashcard"`.
- **Front:** ข้อความ statement บนการ์ดขาว / **Back:** คำเฉลยพื้น primary blue.
- **ปุ่ม จริง/เท็จ:**
  - *Default:* white + ring, hover# เงยขึ้น.
  - *ถูก:* `animate-pop` + bg-accent + ring เขียว.
  - *ผิด:* `animate-shake` + red light.
- **Animation:** ทั้งหน้าจะ `fade-up` ตอนเข้า, ปุ่มควบคุม (ก่อน/ถัดไป) fade-up ตอนสลับการ์ด, ตอบครบทุกใบ → **Confetti**.

### 4.4 Group Sort Page (`/groupsort`) — `GroupSortPage.jsx`
- **Layout:** `max-w-4xl`, ช่องคำศัพท์ที่ต้องจัด + ตารางกลุ่ม, wrapped ใน `PageBlobs variant="groupsort"`.
- **สี Dropdown:** Blue `#2563eb` / Teal `#0d9488` / Amber `#d97706` / Red `#dc2626`.
- **Drag & Drop:**
  - ขณะลาก item: เอียง `-rotate-3` + scale + shadow-lift ลอย.
  - Drop zone เจอ: `scale-[1.02]` + ring-2 primary highlight.
  - วางสำเร็จ: item `animate-pop-in`.
- **ตรวจคำตอบ:** ถูกทั้งหมด → green border + **Confetti** + กล่อง success pop; ผิด → แดง border + overlay `animate-shake` + ✕.

## 5. Animations & Transitions
กำหนด keyframes ใน `src/index.css` และสร้างเป็น Tailwind utilities ผ่าน `@theme --animate-*`:

| Utility | Effect |
|---|---|
| `animate-fade-up` | เข้าหน้า/เปลี่ยนองค์ประกอบ (slide + fade) |
| `animate-fade-in` | fade อย่างเดียว |
| `animate-pop` / `animate-pop-in` | ปรากฏแบบเด้ง (ถูกต้อง / เข้าตำแหน่ง / overlay) |
| `animate-shake` | สั่น (ตอบผิด) |
| `animate-bounce-slow` | ไอคอนโบก |
| `animate-float` | วัตถุลอยแบบเนียน |
| `animate-float-y` | ลอยขึ้น-ลงช้าๆ (blob) |
| `animate-float-spin` | ลอย + หมุน + scale ช้าๆ (emoji ตกแต่ง, 16–24s) |
| `bg-drift` | blob พื้นหลังขยับช้าๆ (keyframe ของ `body::before`) |
| `animate-confetti` | โปรยกระดาษฉลอง |

- **Hover/active transitions:** `duration-200`, `hover:-translate-y-0.5`, `hover:shadow-lift`, `active:scale-[0.98]`.
- **Feedback delay:** ตัวเลือก quiz หน่วง 1100ms, flashcard 500ms ก่อนพลิก เพื่อให้เห็นถูก/ผิด.
- **Confetti:** ปกติแสดง 60 ชิ้น เป็นเวลา 4 วินาที, ใช้ใน Quiz จบเกม, FlashCard ครบ, GroupSort ตรวจถูก.

## 6. Reusable Components (`src/components/`)

**`ui.jsx`:**
- **`GameButton`** — ปุ่ม solid/outline ขอบมน, hover เงยขึ้น, `variant="outline"` ใช้ `border-line`.
- **`GameCard`** — กล่องขาว soft shadow + `border-line` (ขอบชัด).
- **`Shape`** — SVG ตกแต่งพื้นหลัง.
- **`AnimatedNumber`** — ตัวเลขนับขึ้นด้วย easing (ใช้กับคะแนน).
- **`Confetti`** — component โปรยกระดาษแบบ fixed overlay, กำหนดสี/ขนาดสุ่ม.
- **`PageBlobs`** — wrapper หน้า (ทุกหน้าใช้): `relative min-h-screen overflow-hidden` + blob เบลอ per-variant + ฝัง `FloatingElements` + content (z-10). รับ prop `variant` = `home | quiz | flashcard | groupsort`.
- **`FloatingElements`** — ชุดอิโมจิ ตกแต่งลอย/หมุนช้าๆ หลังเนื้อหา (ใช้ใน `PageBlobs`), opacity ต่ำ, ซ่อนบนจอเล็ก (`hidden lg:block`).

**`CursorGlow.jsx`** (ใหม่) — glow เบาๆ ติดตาม cursor, ใช้ `requestAnimationFrame` + lerp; mount ใน `App.jsx` เพื่อให้ทุกหน้า; ปิดเมื่อ `prefers-reduced-motion` หรือจอมือถือ (`md:`).

## 7. Suggested CSS Framework
- **Tailwind CSS v4** ผ่าน `@tailwindcss/vite` (ใน `vite.config.js`) — config ผ่าน `@theme` ใน `src/index.css` ไม่ต้องใช้ PostCSS/config file.
