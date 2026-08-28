# Project Specification: React Knowledge & Quiz Mini-Site

## 1. Project Overview
A simple Single Page Application (SPA) built with React. The website consists of two main pages: a knowledge/information page and an interactive 4-choice quiz page. The goal is to educate the user on a specific topic and then test their knowledge immediately after.

## 2. Tech Stack
- **Core:** React (Functional Components, Hooks)
- **Build Tool:** Vite
- **Routing:** React Router v6 (`react-router-dom`)
- **Styling:** CSS / Tailwind CSS

## 3. Application Structure & Routing
- `/` (Home/Knowledge) -> `KnowledgePage` component
- `/quiz` (Quiz Game) -> `QuizPage` component

## 4. Page Requirements

### 4.1. Page 1: Knowledge Page (`KnowledgePage.jsx`)
- **Purpose:** Display educational content cleanly and attractively.
- **Features:**
  - Header with a clear title.
  - Content sections (Text, Images, Bullet points).
  - A prominent Call-to-Action (CTA) button: "Start Quiz" which navigates to the `/quiz` route.

### 4.2. Page 2: Quiz Page (`QuizPage.jsx`)
- **Purpose:** Interactive 4-choice quiz game.
- **Features:**
  - **State Management:**
    - `currentQuestion`: Tracks the index of the active question (integer).
    - `score`: Tracks the number of correct answers (integer).
    - `showScore`: Boolean to toggle between the active quiz view and the final result view.
  - **Quiz Flow:**
    - Display the current question text.
    - Display 4 clickable answer options (buttons).
    - On option click: validate answer, update score if correct, and move to the next question.
  - **Result View:**
    - Triggered when all questions are answered.
    - Display total score (e.g., "You scored 4 out of 5!").
    - Action buttons: "Restart Quiz" (resets states) or "Back to Knowledge Page" (routes to `/`).

## 5. Data Structure (Mock Data)
Questions should be stored in an array of objects to easily map into components:
```javascript
const questions = [
  {
    questionText: 'What is the capital of France?',
    answerOptions: [
      { answerText: 'New York', isCorrect: false },
      { answerText: 'London', isCorrect: false },
      { answerText: 'Paris', isCorrect: true },
      { answerText: 'Dublin', isCorrect: false },
    ],
  },
  // Add more questions here...
];
```

## 6. Future Enhancements (Phase 2)
- Add a countdown timer for the entire quiz or per question.
- Randomize the order of questions and answers.
- Add sound effects for correct and incorrect answers.
