import React, { useState, useEffect } from 'react'
import quizData from '../data/quizData.json'
import './Quiz.css'

interface QuizProps {
  quizType: string
  onExit: () => void
}

interface Question {
  id: number
  question: string
  type: string
  content?: string
  options?: string[]
  answer?: number | number[] | string
  hint?: string
}

const Quiz: React.FC<QuizProps> = ({ quizType, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5분 = 300초
  const [isTimeUp, setIsTimeUp] = useState(false)

  // 문제 섞기 및 초기화
  useEffect(() => {
    const originalQuestions = quizData.quizSets[quizType as keyof typeof quizData.quizSets] || []
    const shuffled = [...originalQuestions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
  }, [quizType])

  // 타이머
  useEffect(() => {
    if (timeLeft > 0 && !isTimeUp) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsTimeUp(true)
    }
  }, [timeLeft, isTimeUp])

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // 문제가 끝나면 다시 섞어서 처음부터
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
      setCurrentQuestionIndex(0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (questions.length === 0) {
    return <div className="quiz-loading">문제를 불러오는 중...</div>
  }

  if (isTimeUp) {
    return (
      <div className="quiz-container">
        <div className="time-up">
          <h2>⏰ 시간이 끝났습니다!</h2>
          <p>수고하셨습니다.</p>
          <button className="exit-button" onClick={onExit}>
            처음으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="timer">
          <span className="timer-icon">⏱️</span>
          <span className={`timer-text ${timeLeft <= 60 ? 'warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="question-counter">
          문제 {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-box">
          <h2 className="question-number">문제 {currentQuestionIndex + 1}</h2>
          <p className="question-text">{currentQuestion.question}</p>
          
          {currentQuestion.content && (
            <div className="question-content">
              <pre>{currentQuestion.content}</pre>
            </div>
          )}

          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="options">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="option">
                  <span className="option-number">{index + 1}.</span>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          )}

          {currentQuestion.hint && (
            <div className="hint">
              <span className="hint-icon">💡</span>
              <span className="hint-text">힌트: {currentQuestion.hint}</span>
            </div>
          )}
        </div>
      </div>

      <div className="quiz-footer">
        <button className="exit-button" onClick={onExit}>
          종료
        </button>
        <button className="next-button" onClick={handleNext}>
          다음 문제 →
        </button>
      </div>
    </div>
  )
}

export default Quiz