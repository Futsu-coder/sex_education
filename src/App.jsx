import { Routes, Route } from 'react-router-dom'
import KnowledgePage from './pages/KnowledgePage'
import QuizPage from './pages/QuizPage'
import FlashCardPage from './pages/FlashCardPage'
import GroupSortPage from './pages/GroupSortPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<KnowledgePage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/flashcard" element={<FlashCardPage />} />
      <Route path="/groupsort" element={<GroupSortPage />} />
    </Routes>
  )
}

export default App
