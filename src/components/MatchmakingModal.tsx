// ═══════════════════════════════════════════════════════
// CUBA BOARD — Phase 12: Random Matchmaking Engine
// Queue search, skill rating matching (MMR), and auto room creation
// ═══════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Loader2, CheckCircle2, Shield, Zap, X } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';

interface MatchmakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject?: string;
}

const mockMatchOpponents = [
  { name: 'Vikram Singh', level: 4, mmr: 1420, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram' },
  { name: 'Ananya Desai', level: 5, mmr: 1510, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ananya' },
  { name: 'Rohan Gupta', level: 3, mmr: 1380, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Rohan' },
];

export const MatchmakingModal: React.FC<MatchmakingModalProps> = ({ isOpen, onClose, selectedSubject = 'Physics' }) => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [status, setStatus] = useState<'searching' | 'matched' | 'entering'>('searching');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [matchedOpponent, setMatchedOpponent] = useState<typeof mockMatchOpponents[0] | null>(null);

  const userMMR = Math.round(1200 + (user.level * 50) + (user.accuracy * 2));

  // Timer while searching
  useEffect(() => {
    if (!isOpen) {
      setStatus('searching');
      setElapsedSeconds(0);
      setMatchedOpponent(null);
      return;
    }

    const timerId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Simulate match found after 3-5 seconds
    const matchTimeout = setTimeout(() => {
      const opp = mockMatchOpponents[Math.floor(Math.random() * mockMatchOpponents.length)];
      setMatchedOpponent(opp);
      setStatus('matched');

      // Transition to battle room after 2 seconds
      setTimeout(() => {
        setStatus('entering');
        const roomCode = `MMR-${Math.floor(1000 + Math.random() * 9000)}`;
        navigate(`/battle/${roomCode}?subject=${selectedSubject}&questions=5&timer=15`);
        onClose();
      }, 2000);
    }, 3500);

    return () => {
      clearInterval(timerId);
      clearTimeout(matchTimeout);
    };
  }, [isOpen, selectedSubject, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-surface border border-white/10 rounded-3xl p-8 text-center shadow-2xl overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Close / Cancel Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white bg-surfaceHover rounded-full border border-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {status === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Radar pulse animation */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
                <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-spin" style={{ animationDuration: '6s' }} />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg z-10 border-2 border-white/20">
                  <Swords className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">Searching for Opponent...</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Matching skill rating in <strong className="text-primary">{selectedSubject}</strong>
                </p>
              </div>

              {/* User MMR & Elapsed Timer */}
              <div className="grid grid-cols-2 gap-3 bg-surfaceHover p-4 rounded-2xl border border-white/5">
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Your Rating (MMR)</p>
                  <p className="text-lg font-bold text-white font-mono flex items-center gap-1">
                    <Shield className="w-4 h-4 text-primary" />
                    {userMMR}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">Search Time</p>
                  <p className="text-lg font-bold text-gray-300 font-mono">00:{elapsedSeconds.toString().padStart(2, '0')}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-surfaceHover hover:bg-white/10 text-gray-300 font-bold rounded-xl text-sm transition-colors border border-white/5"
              >
                Cancel Queue
              </button>
            </motion.div>
          )}

          {(status === 'matched' || status === 'entering') && matchedOpponent && (
            <motion.div
              key="matched"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success border border-success/30 shadow-lg">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-success font-bold">Match Found!</span>
                <h2 className="text-2xl font-black text-white mt-1">Preparing Battle Arena</h2>
              </div>

              {/* Face-off display */}
              <div className="flex items-center justify-around bg-surfaceHover p-6 rounded-2xl border border-white/5">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-2 text-lg">
                    {user.name[0]}
                  </div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{userMMR} MMR</p>
                </div>

                <span className="text-xl font-black italic text-gray-600">VS</span>

                <div className="text-center">
                  <img src={matchedOpponent.avatar} alt={matchedOpponent.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-2 bg-surface" />
                  <p className="text-xs font-bold text-white">{matchedOpponent.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{matchedOpponent.mmr} MMR</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Connecting players to synchronized server room...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
