import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Swords, Trophy, X, Check, Copy } from 'lucide-react';
import { CircularTimer } from '@/components/ui/CircularTimer';
import { mockQuizzes } from '@/lib/mockData';
import { useUserStore } from '@/stores/useUserStore';

type Phase = 'lobby' | 'playing' | 'result';

interface Opponent {
  name: string;
  avatar: string;
  level: number;
}

const mockOpponents: Opponent[] = [
  { name: 'Sneha Patel', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sneha', level: 4 },
  { name: 'Rahul Krishnan', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul', level: 5 },
  { name: 'Ananya Desai', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya', level: 4 },
  { name: 'Vikram Singh', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram', level: 4 },
];

const BattleRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, addXP } = useUserStore();

  const subject = searchParams.get('subject') || 'Physics';
  const questionsCount = parseInt(searchParams.get('questions') || '5');
  const timerVal = parseInt(searchParams.get('timer') || '15');

  // Randomly assign one of the mock opponents
  const opponent = useMemo(() => {
    const hash = roomId ? roomId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return mockOpponents[hash % mockOpponents.length];
  }, [roomId]);

  // Load questions for the chosen subject from the mock database
  const questions = useMemo(() => {
    const matching = mockQuizzes.filter(
      (q) => q.subject.toLowerCase() === subject.toLowerCase()
    );
    let pool = matching.flatMap((q) => q.questions);
    if (pool.length === 0) {
      pool = mockQuizzes[0].questions; // Fallback to Newton's laws
    }
    // Shuffle and slice to the specified count
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(questionsCount, shuffled.length));
  }, [subject, questionsCount]);

  const [phase, setPhase] = useState<Phase>('lobby');
  const [countdown, setCountdown] = useState(3);
  const [qIdx, setQIdx] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  // Custom notification trigger
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Lobby 3s countdown transition
  useEffect(() => {
    if (phase !== 'lobby') return;
    if (countdown <= 0) {
      setPhase('playing');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const currentQuestion = questions[qIdx];

  // Submit answer and simulate the opponent
  const handleAnswer = (optionIdx: number) => {
    if (picked !== null) return;
    setPicked(optionIdx);

    const isCorrect = optionIdx === currentQuestion.correctAnswer;
    if (isCorrect) {
      // Correct answer awards 100 base points + streak bonus
      const pointsEarned = 100 + streak * 10;
      setMyScore((s) => s + pointsEarned);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    // Simulate opponent response (answers randomly after a small delay)
    setTimeout(() => {
      const oppCorrect = Math.random() > 0.35;
      if (oppCorrect) {
        setOppScore((s) => s + 100 + Math.floor(Math.random() * 15));
      }
    }, 600 + Math.random() * 800);

    // Proceed to next question or results page after visual pause
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        setPhase('result');
        // Award XP to the user store
        const won = myScore > oppScore;
        const xpGained = won ? 120 : 50;
        addXP(xpGained);
      } else {
        setQIdx((i) => i + 1);
        setPicked(null);
      }
    }, 1600);
  };

  const handleTimeout = () => {
    if (picked === null) {
      handleAnswer(-1); // Count as incorrect/timed out
    }
  };

  const handleCopyCode = () => {
    if (roomId) {
      navigator.clipboard?.writeText(roomId);
      showNotification('Room code copied to clipboard!');
    }
  };

  if (phase === 'lobby') {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-primary text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 font-medium text-xs">
            {notification}
          </div>
        )}

        <div className="card text-center space-y-8 bg-surface border border-white/5 p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="flex items-center justify-between text-xs font-mono text-gray-500">
            <span>Room Code: <strong className="text-white font-bold">{roomId}</strong></span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 bg-surfaceHover hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 sm:gap-16 pt-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-surface">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{user.name}</p>
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">You (Lvl {user.level})</span>
              </div>
            </div>

            <div className="text-3xl font-extrabold italic text-gray-600">VS</div>

            <div className="flex flex-col items-center gap-3">
              <img src={opponent.avatar} alt={opponent.name} className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-surface bg-surfaceHover" />
              <div>
                <p className="font-bold text-white text-sm">{opponent.name}</p>
                <span className="text-[10px] font-mono text-violet-light font-bold uppercase tracking-wider">Opponent (Lvl {opponent.level})</span>
              </div>
            </div>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-violet-light"
            >
              {countdown > 0 ? countdown : 'GO! ⚔️'}
            </motion.div>
            <p className="text-xs text-gray-500 mt-4 tracking-wider uppercase font-mono">
              {questions.length} questions &bull; {timerVal}s limit per question
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const won = myScore > oppScore;
    const tie = myScore === oppScore;
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="card text-center space-y-8 bg-surface border border-white/5 p-10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Trophy className={`w-20 h-20 mx-auto ${won ? 'text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]' : tie ? 'text-gray-400' : 'text-gray-600'}`} />
          </motion.div>

          <div>
            <h1 className="text-4xl font-black text-white">
              {won ? 'Victory!' : tie ? "It's a Draw!" : 'Defeat'}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {won ? 'You outsmarted your opponent.' : tie ? 'An incredibly close battle.' : 'Better luck next time! Keep learning.'}
            </p>
          </div>

          <div className="flex justify-center items-center gap-16 py-4">
            <div className="text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Your Score</p>
              <p className="text-4xl font-extrabold text-primary">{myScore}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">{opponent.name.split(' ')[0]}</p>
              <p className="text-4xl font-extrabold text-gray-400">{oppScore}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 text-success rounded-full text-sm font-bold shadow-sm">
            <Crown className="w-4 h-4" />
            +{won ? 120 : 50} XP Gained
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={() => {
                setPhase('lobby');
                setCountdown(3);
                setQIdx(0);
                setMyScore(0);
                setOppScore(0);
                setPicked(null);
                setStreak(0);
              }}
              className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-bold transition-all text-sm"
            >
              Rematch
            </button>
            <Link
              to="/battle"
              className="px-6 py-3 bg-surfaceHover hover:bg-white/10 text-white rounded-xl font-bold transition-all text-sm border border-white/5"
            >
              Leave Room
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Live scoreboard */}
      <div className="grid grid-cols-3 items-center gap-4">
        {/* User Card */}
        <div className="card p-4 bg-surface border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">You</p>
            <p className="text-lg font-bold text-white tabular-nums">{myScore}</p>
          </div>
          {streak > 1 && (
            <span className="text-xs bg-orange-500/10 border border-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full font-mono flex items-center gap-0.5 shrink-0">
              🔥 {streak}
            </span>
          )}
        </div>

        {/* Center Timer */}
        <div className="flex flex-col items-center text-center">
          <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5">Question {qIdx + 1} / {questions.length}</p>
          <CircularTimer key={qIdx} seconds={timerVal} onElapsed={handleTimeout} size={76} />
        </div>

        {/* Opponent Card */}
        <div className="card p-4 bg-surface border border-white/5 flex items-center gap-3 justify-end text-right">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">{opponent.name}</p>
            <p className="text-lg font-bold text-white tabular-nums">{oppScore}</p>
          </div>
          <img src={opponent.avatar} alt={opponent.name} className="w-10 h-10 rounded-full object-cover shrink-0 bg-surfaceHover" />
        </div>
      </div>

      {/* Active Question Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qIdx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card bg-surface border border-white/5 p-8 rounded-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {subject} Category
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {currentQuestion.options.map((option, idx) => {
                const isPicked = picked === idx;
                const isCorrect = picked !== null && idx === currentQuestion.correctAnswer;
                const isWrong = isPicked && idx !== currentQuestion.correctAnswer;

                let borderStyle = 'border-white/5 hover:border-primary/50 bg-white/5 hover:bg-white/10';
                let checkIcon = null;

                if (picked !== null) {
                  if (isCorrect) {
                    borderStyle = 'border-success bg-success/10 text-success';
                    checkIcon = <Check className="w-4 h-4 text-success shrink-0" />;
                  } else if (isWrong) {
                    borderStyle = 'border-error bg-error/10 text-error';
                    checkIcon = <X className="w-4 h-4 text-error shrink-0" />;
                  } else if (idx === currentQuestion.correctAnswer) {
                    borderStyle = 'border-success bg-success/5 text-success/80';
                  } else {
                    borderStyle = 'border-white/5 bg-white/5 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={picked !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${borderStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surfaceHover border border-white/5 flex items-center justify-center font-mono font-bold text-xs text-white shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-semibold text-sm leading-relaxed">{option}</span>
                    </div>
                    {checkIcon}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BattleRoom;
