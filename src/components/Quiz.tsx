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
  const [showHint, setShowHint] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [showScoreScreen, setShowScoreScreen] = useState(false)

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
    setShowHint(false) // 다음 문제로 넘어갈 때 힌트 숨기기
    setSelectedAnswer(null) // 선택한 답안 초기화
    setShowAnswer(false) // 정답 표시 초기화
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // 문제가 끝나면 다시 섞어서 처음부터
      const shuffled = [...questions].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
      setCurrentQuestionIndex(0)
    }
  }

  const handleAnswerSelect = (index: number) => {
    if (!showAnswer) {
      setSelectedAnswer(index)
    }
  }

  const handleCheckAnswer = () => {
    setShowAnswer(true)
    
    // 이미 답을 확인한 문제는 점수를 다시 주지 않음
    const currentQuestion = questions[currentQuestionIndex]
    if (!answeredQuestions.has(currentQuestion.id) && currentQuestion.type === 'multiple-choice') {
      if (selectedAnswer === currentQuestion.answer) {
        setScore(score + 1)
      }
      setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion.id]))
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

  const handleExit = () => {
    setShowScoreScreen(true)
  }

  if (isTimeUp || showScoreScreen) {
    return (
      <div className="quiz-container">
        <div className="score-screen">
          <h2>🎉 퀴즈가 끝났습니다!</h2>
          <div className="final-score">
            <span className="score-label">최종 점수</span>
            <span className="score-value">{score}점</span>
            <span className="score-total">/ {questions.filter(q => q.type === 'multiple-choice').length}점</span>
          </div>
          <p className="score-message">
            {score >= questions.filter(q => q.type === 'multiple-choice').length * 0.8 
              ? '🌟 훌륭해요! 정말 잘했어요!' 
              : score >= questions.filter(q => q.type === 'multiple-choice').length * 0.6 
              ? '👍 좋아요! 조금만 더 노력하면 더 잘할 수 있어요!' 
              : '💪 괜찮아요! 다시 한번 도전해보세요!'}
          </p>
          <button className="home-button" onClick={onExit}>
            나가기
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
        <div className="header-right">
          <div className="score-display">
            점수: {score}점
          </div>
          <div className="question-counter">
            문제 {currentQuestionIndex + 1} / {questions.length}
          </div>
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
                <div 
                  key={index} 
                  className={`option ${selectedAnswer === index ? 'selected' : ''} ${
                    showAnswer ? (index === currentQuestion.answer ? 'correct' : selectedAnswer === index ? 'incorrect' : '') : ''
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className="option-number">{index + 1}.</span>
                  <span className="option-text">{option}</span>
                  {showAnswer && index === currentQuestion.answer && (
                    <span className="check-icon">✓</span>
                  )}
                  {showAnswer && selectedAnswer === index && index !== currentQuestion.answer && (
                    <span className="wrong-icon">✗</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentQuestion.hint && (
            <div className="hint-container">
              {!showHint ? (
                <button className="hint-button" onClick={() => setShowHint(true)}>
                  <span className="hint-icon">💡</span>
                  <span>힌트 보기</span>
                </button>
              ) : (
                <div className="hint">
                  <span className="hint-icon">💡</span>
                  <span className="hint-text">힌트: {currentQuestion.hint}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="quiz-footer">
        <button className="exit-button" onClick={handleExit}>
          종료
        </button>
        {selectedAnswer !== null && !showAnswer && currentQuestion.type === 'multiple-choice' && (
          <button className="check-button" onClick={handleCheckAnswer}>
            정답 확인
          </button>
        )}
        {currentQuestion.type === 'fill-blank' && !showAnswer && (
          <button className="check-button" onClick={handleCheckAnswer}>
            정답 확인
          </button>
        )}
        <button className="next-button" onClick={handleNext}>
          다음 문제 →
        </button>
      </div>
    </div>
  )
}

export default Quiz