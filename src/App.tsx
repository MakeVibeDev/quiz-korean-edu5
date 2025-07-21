import { useState } from 'react'
import Quiz from './components/Quiz'
import './App.css'

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)

  const quizTypes = [
    { id: 1, title: 'A', emoji: '🎯' },
    { id: 2, title: 'B', emoji: '🎲' },
    { id: 3, title: 'C', emoji: '🎪' },
    { id: 4, title: 'D', emoji: '🎨' },
    { id: 5, title: 'E', emoji: '🎭' },
    { id: 6, title: 'F', emoji: '🎪' },
  ]

  if (selectedQuiz) {
    return <Quiz quizType={selectedQuiz} onExit={() => setSelectedQuiz(null)} />
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src="/school_logo.png" alt="승화초등학교" className="school-logo" />
        <h1>5학년 국어 퀴즈 📚</h1>
        <p>문제지를 선택해주세요!</p>
      </header>
      
      <main className="quiz-selection">
        <div className="quiz-grid">
          {quizTypes.map((quiz) => (
            <button
              key={quiz.id}
              className="quiz-button"
              onClick={() => setSelectedQuiz(quiz.title)}
            >
              <span className="quiz-emoji">{quiz.emoji}</span>
              <span className="quiz-title">{quiz.title}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App