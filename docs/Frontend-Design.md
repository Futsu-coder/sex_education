# Frontend Design Document: Knowledge & Quiz App

## 1. Design Concept & Theme
- **Style:** Clean, modern, minimalist, and educational.
- **Focus:** High readability on the Knowledge Page and engaging, immediate feedback on the Quiz Page.
- **Approach:** Mobile-first responsive design.

## 2. Color Palette (Recommended)
Using a soft and modern palette to reduce eye strain while keeping interactive elements prominent.
- **Primary Color:** `#3B82F6` (Blue) - Used for primary buttons, links, and main headers.
- **Success Color:** `#10B981` (Green) - Used for correct answers in the quiz.
- **Error/Danger Color:** `#EF4444` (Red) - Used for incorrect answers.
- **Background Color:** `#F8FAFC` (Light Slate) - Soft background for the entire app.
- **Card Background:** `#FFFFFF` (White) - For content containers and quiz cards to make them pop.
- **Text Primary:** `#1E293B` (Dark Slate) - For headings and main text.
- **Text Secondary:** `#64748B` (Muted Slate) - For sub-text or secondary information.

## 3. Typography
- **Font Family:** `Prompt` (for Thai support) or `Inter` (for clean English UI).
- **Scale:**
  - `h1`: 2.5rem (bold) - Main Page Titles
  - `h2`: 1.75rem (semibold) - Section Headers
  - `body`: 1rem (regular) - Content and Questions
  - `button`: 1rem (medium) - Clear and legible button text

## 4. Layout & Structure

### 4.1 Knowledge Page (`/`)
- **Container:** Centered max-width container (e.g., `max-w-3xl`) for optimal reading length.
- **Header:** Catchy title with a brief introductory subtitle.
- **Content:** Well-spaced paragraphs (`line-height: 1.6`) with bullet points or images if necessary.
- **CTA (Call to Action):** A large, centered "Start Quiz" button at the very bottom.
  - *Interaction:* Hover effect (slight scale up or shadow increase) to encourage clicking.

### 4.2 Quiz Page (`/quiz`)
- **Layout:** Centered card interface in the middle of the screen.
- **Header:** Progress indicator (e.g., "Question 1 / 5").
- **Question Area:** Large, easily readable question text.
- **Options Area:** 
  - Desktop/Tablet: 2x2 Grid.
  - Mobile: Stacked vertically (1 column).
- **Option Buttons States:**
  - *Default:* White background, subtle border, left-aligned text.
  - *Hover:* Light blue tint or border highlight.
  - *Correct Answer:* Green background, white text.
  - *Incorrect Answer:* Red background, white text.
- **Result Screen:** Shows final score prominently (e.g., a large circle with "4/5"). Includes "Restart" and "Read Again" buttons.

## 5. Animations & Transitions
- **Hover effects:** 150ms ease-in-out for buttons (color and subtle shadow).
- **Page transitions:** (Optional) Fade-in when switching between Knowledge and Quiz pages to avoid abrupt flashes.
- **Quiz feedback:** Slight delay (e.g., 1000ms) after choosing an answer before moving to the next question so the user can see if they were right or wrong.

## 6. Suggested CSS Framework
- **Tailwind CSS** is highly recommended. It perfectly matches this design spec and allows for rapid styling without writing custom CSS files for every component.
