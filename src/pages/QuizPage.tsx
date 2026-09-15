import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight, AlertCircle, Volume2, Download } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { mockQuizzes } from '@/lib/mockData';
import { generateId } from '@/lib/utils';
import { speakText, exportQuizToMarkdown, downloadFile } from '@/services/voiceQuizService';
import type { QuizAttempt, Quiz } from '@/types';

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { addXP, addAttempt, incrementStreak } = useUserStore();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  // Load Quiz
  useEffect(() => {
    const foundQuiz = mockQuizzes.find((q) => q.id === id);
    if (foundQuiz) {
      setQuiz(foundQuiz);
      setAnswers(new Array(foundQuiz.questions.length).fill(null));
      setTimeLeft(foundQuiz.timeLimit || 600);
    } else {
      navigate('/dashboard');
    }
  }, [id, navigate]);

  // Countdown timer
  useEffect(() => {
    if (!quiz || isComplete) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      // Time is up — Auto-submit quiz
      handleQuizComplete();
    }
  }, [timeLeft, quiz]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!quiz) return;
      if (e.key === '1') handleSelect(0);
      if (e.key === '2') handleSelect(1);
      if (e.key === '3') handleSelect(2);
      if (e.key === '4') handleSelect(3);
      
      if (e.key === 'Enter') {
        if (!isAnswered && selectedOption !== null) {
          handleCheck();
        } else if (isAnswered) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, isAnswered, quiz, currentIdx, answers]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const question = quiz.questions[currentIdx];
  const progress = ((currentIdx) / quiz.questions.length) * 100;
  const isComplete = currentIdx >= quiz.questions.length;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    
    // Save answer locally
    const newAnswers = [...answers];
    newAnswers[currentIdx] = selectedOption;
    setAnswers(newAnswers);
    
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    // Calculate final score
    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      const ans = answers[idx] !== undefined ? answers[idx] : null;
      if (ans === q.correctAnswer) {
        correct++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correct / totalQuestions) * 100);
    const timeTaken = quiz.timeLimit - timeLeft;

    // Calculate XP
    let xpEarned = correct * 10;
    if (score === 100) {
      xpEarned += 50; // Perfect score bonus
    }

    const attempt: QuizAttempt = {
      id: generateId('attempt'),
      quizId: quiz.id,
      quizTitle: quiz.title,
      answers: [...answers],
      score,
      totalQuestions,
      correctAnswers: correct,
      timeTaken,
      xpEarned,
      completedAt: new Date().toISOString(),
      isPassed: score >= 70,
    };

    // Save attempt to user stats and award XP
    addAttempt(attempt);
    addXP(xpEarned);
    
    // Increment streak on active days
    incrementStreak();

    // Cache the last attempt in sessionStorage so results page can display it
    sessionStorage.setItem('last_attempt', JSON.stringify(attempt));

    // Redirect to results page
    navigate(`/results/${attempt.id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Quiz Header */}
      <header className="h-20 flex items-center px-6 gap-6 max-w-5xl mx-auto w-full border-b border-white/5">
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition-colors" title="Exit Quiz">
          <X className="w-6 h-6" />
        </button>
        
        {/* Progress Bar */}
        <div className="flex-1 h-3 bg-surfaceHover rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Voice Assistant & Study Guide Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => speakText(`Question ${currentIdx + 1}: ${question.text}`)}
            className="p-2 bg-surfaceHover hover:bg-white/10 text-primary rounded-lg border border-white/5 transition-colors"
            title="Read Question Aloud (Voice Assistant)"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const md = exportQuizToMarkdown(quiz.title, quiz.questions);
              downloadFile(`${quiz.title.replace(/\s+/g, '_')}_Study_Guide.md`, md);
            }}
            className="p-2 bg-surfaceHover hover:bg-white/10 text-gray-300 hover:text-white rounded-lg border border-white/5 transition-colors"
            title="Export Printable Study Guide"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400 font-medium font-mono text-sm bg-surfaceHover px-3 py-1.5 rounded-lg border border-white/5">
          <Clock className={`w-4 h-4 ${timeLeft < 15 ? 'text-error animate-pulse' : 'text-primary'}`} />
          <span className={timeLeft < 15 ? 'text-error font-bold' : 'text-white'}>
            {Math.floor(timeLeft / 60)}:{((timeLeft % 60).toString().padStart(2, '0'))}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-6 py-12">
        <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
          Question {currentIdx + 1} of {quiz.questions.length}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 leading-tight">{question.text}</h2>
        
        <div className="space-y-4">
          {question.options.map((option, idx) => {
            let stateClasses = "bg-surface border-white/10 hover:border-primary hover:bg-white/5 text-gray-300";
            
            if (isAnswered) {
              if (idx === question.correctAnswer) {
                stateClasses = "bg-success/20 border-success text-success font-semibold";
              } else if (idx === selectedOption) {
                stateClasses = "bg-error/20 border-error text-error font-semibold";
              } else {
                stateClasses = "bg-surface border-white/5 opacity-40 text-gray-500";
              }
            } else if (selectedOption === idx) {
              stateClasses = "bg-primary/20 border-primary text-white font-semibold ring-2 ring-primary/30";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex justify-between items-center group relative overflow-hidden ${stateClasses}`}
              >
                <div className="flex items-center gap-4 z-10">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    selectedOption === idx ? 'bg-primary text-white' : 'bg-surfaceHover text-gray-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-base sm:text-lg">{option}</span>
                </div>
                {isAnswered && idx === question.correctAnswer && <CheckCircle2 className="w-6 h-6 text-success shrink-0 z-10" />}
                {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="w-6 h-6 text-error shrink-0 z-10" />}
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Action Bar (Duolingo Style) */}
      <div className={`border-t-2 p-6 transition-all duration-300 ${
        isAnswered 
          ? selectedOption === question.correctAnswer 
            ? 'border-success bg-success/5' 
            : 'border-error bg-error/5'
          : 'border-white/5 bg-surface'
      }`}>
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div className="flex-1">
            {isAnswered && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedOption === question.correctAnswer ? 'bg-success text-black' : 'bg-error text-white'}`}>
                    {selectedOption === question.correctAnswer ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${selectedOption === question.correctAnswer ? 'text-success' : 'text-error'}`}>
                      {selectedOption === question.correctAnswer ? 'Excellent!' : 'Correct Solution:'}
                    </h3>
                    {selectedOption !== question.correctAnswer && (
                      <p className="text-white text-sm font-semibold">{question.options[question.correctAnswer]}</p>
                    )}
                  </div>
                </div>
                {/* AI Explanation block */}
                <p className="text-xs text-gray-300 mt-2 bg-black/20 p-3 rounded-lg border border-white/5 leading-relaxed">
                  <span className="font-bold text-primary mr-1">Explanation:</span>
                  {question.explanation}
                </p>
              </div>
            )}
            
            {!isAnswered && selectedOption === null && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span>Select an option to check. Use keys 1-4 or click.</span>
              </div>
            )}
          </div>
          
          <button
            onClick={isAnswered ? handleNext : handleCheck}
            disabled={!isAnswered && selectedOption === null}
            className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base transition-all select-none ${
              !isAnswered && selectedOption === null
                ? 'bg-surfaceHover text-gray-500 cursor-not-allowed border border-white/5'
                : isAnswered
                  ? selectedOption === question.correctAnswer
                    ? 'bg-success text-black hover:bg-success/80 shadow-[0_4px_0_rgba(21,128,61,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(21,128,61,1)] active:translate-y-[4px] active:shadow-none'
                    : 'bg-error text-white hover:bg-error/80 shadow-[0_4px_0_rgba(185,28,28,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(185,28,28,1)] active:translate-y-[4px] active:shadow-none'
                  : 'bg-primary text-white hover:bg-primaryHover shadow-[0_4px_0_rgba(67,56,202,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(67,56,202,1)] active:translate-y-[4px] active:shadow-none'
            }`}
          >
            {isAnswered ? (currentIdx < quiz.questions.length - 1 ? 'CONTINUE' : 'FINISH QUIZ') : 'CHECK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
