import { useParams, useNavigate } from 'react-router-dom';
import { Target, Zap, Clock, Home, RotateCcw, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { mockQuizzes } from '@/lib/mockData';
import { formatTime } from '@/lib/utils';
import { useState } from 'react';

const ResultsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { attempts } = useUserStore();

  // Find attempt in store history or fallback to session storage
  const sessionAttempt = sessionStorage.getItem('last_attempt');
  const attempt = attempts.find((a) => a.id === id) || 
                  (sessionAttempt ? JSON.parse(sessionAttempt) : null);

  const quiz = attempt ? mockQuizzes.find((q) => q.id === attempt.quizId) : null;
  const [expandedQuestion, setExpandedQuestion] = useState<Record<number, boolean>>({});

  const toggleExpand = (idx: number) => {
    setExpandedQuestion(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!attempt || !quiz) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-white text-center">
        <AlertCircle className="w-16 h-16 text-error mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2">Attempt Not Found</h1>
        <p className="text-gray-400 mb-6">We couldn't retrieve the details for this quiz attempt.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-medium transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8 md:p-12 overflow-y-auto">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-primary to-purple-500 rounded-3xl mb-6 shadow-[0_0_30px_rgba(99,102,241,0.4)] border-2 border-white/10 rotate-3 transition-transform hover:rotate-6 cursor-pointer">
            <span className="text-4xl">{attempt.score >= 70 ? '🎉' : '💪'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {attempt.score >= 90 ? 'Outstanding!' : attempt.score >= 70 ? 'Quiz Passed!' : 'Keep Practicing!'}
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            You completed <strong>{attempt.quizTitle || quiz.title}</strong>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center flex flex-col items-center justify-center p-4 sm:p-6 bg-surfaceHover border border-white/5 hover:border-success/30 transition-colors">
            <Target className="w-7 h-7 text-success mb-2" />
            <p className="text-xs text-gray-400 font-medium mb-1">Accuracy</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">{attempt.score}%</p>
          </div>
          
          <div className="card text-center flex flex-col items-center justify-center p-4 sm:p-6 bg-surfaceHover border border-white/5 hover:border-primary/30 transition-colors">
            <Zap className="w-7 h-7 text-primary mb-2" />
            <p className="text-xs text-gray-400 font-medium mb-1">XP Gained</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">+{attempt.xpEarned}</p>
          </div>
          
          <div className="card text-center flex flex-col items-center justify-center p-4 sm:p-6 bg-surfaceHover border border-white/5 hover:border-orange-500/30 transition-colors">
            <Clock className="w-7 h-7 text-orange-500 mb-2" />
            <p className="text-xs text-gray-400 font-medium mb-1">Time Spent</p>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">{formatTime(attempt.timeTaken || attempt.timeSpent || 0)}</p>
          </div>
        </div>

        {/* Detailed Questions Review */}
        <div className="card space-y-6 bg-surface">
          <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Question Review</h2>
          
          <div className="space-y-4">
            {quiz.questions.map((question, qIdx) => {
              const userAnswer = attempt.answers[qIdx] !== undefined ? attempt.answers[qIdx] : null;
              const isCorrect = userAnswer === question.correctAnswer;
              const isOpen = expandedQuestion[qIdx];

              return (
                <div 
                  key={question.id} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isCorrect ? 'border-success/15 bg-success/[0.02]' : 'border-error/15 bg-error/[0.02]'
                  }`}
                >
                  {/* Collapsible header */}
                  <div 
                    onClick={() => toggleExpand(qIdx)}
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-white/5 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        {qIdx + 1}
                      </div>
                      <p className="text-sm font-semibold text-gray-200 line-clamp-1 max-w-[500px]">{question.text}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCorrect ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* Collapsible body */}
                  {isOpen && (
                    <div className="p-5 border-t border-white/5 bg-surfaceHover space-y-4">
                      <p className="text-base font-bold text-white leading-relaxed">{question.text}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, oIdx) => {
                          let labelStyle = "bg-surface border-white/5 text-gray-400";
                          
                          if (oIdx === question.correctAnswer) {
                            labelStyle = "bg-success/20 border-success text-success font-semibold";
                          } else if (oIdx === userAnswer) {
                            labelStyle = "bg-error/20 border-error text-error font-semibold";
                          }

                          return (
                            <div 
                              key={oIdx}
                              className={`p-3.5 rounded-xl border flex items-center justify-between text-sm ${labelStyle}`}
                            >
                              <span>{option}</span>
                              {oIdx === question.correctAnswer && <CheckCircle2 className="w-5 h-5 text-success" />}
                              {oIdx === userAnswer && oIdx !== question.correctAnswer && <XCircle className="w-5 h-5 text-error" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-xs leading-relaxed text-gray-300">
                        <span className="font-bold text-primary mr-1">Explanation:</span>
                        {question.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-4 bg-surfaceHover hover:bg-white/10 text-white rounded-2xl font-bold transition-all flex justify-center items-center gap-2 border border-white/5"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </button>
          
          <button 
            onClick={() => navigate(`/quiz/${attempt.quizId}`)}
            className="flex-1 py-4 bg-primary hover:bg-primaryHover text-white rounded-2xl font-bold transition-all shadow-[0_4px_0_rgba(67,56,202,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(67,56,202,1)] active:translate-y-[4px] active:shadow-none flex justify-center items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
