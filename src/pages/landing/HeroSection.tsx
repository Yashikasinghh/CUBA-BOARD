import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Zap, Award, Flame, Star, Trophy, Brain } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

const rotatingWords = ['Knowledge', 'Quizzes', 'Flashcards', 'Success'];
const wordColors = ['text-electric-light', 'text-violet-light', 'text-neon-green-light', 'text-gold-light'];

export const HeroSection: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-electric/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet/8 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-electric/5 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Badge variant="electric" glow className="text-sm px-4 py-1.5">
              <Zap size={14} className="mr-1.5" />
              Powered by AI — Now in Beta
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-text-primary leading-[1.1] tracking-tight mb-6"
          >
            Turn Your Notes Into
            <br />
            <span className="relative inline-block h-[1.2em] min-w-[280px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 40, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -40, rotateX: 40 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className={`absolute left-0 right-0 ${wordColors[wordIndex]}`}
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload study material and instantly generate personalized quizzes, flashcards,
            revision plans, and progress insights — powered by AI.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button size="xl" leftIcon={<Zap size={20} />}>
                Start Learning Free
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="xl"
              leftIcon={<Play size={20} />}
              onClick={() => {}}
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <DashboardPreview />
        </motion.div>

        {/* Trusted By */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-text-muted text-sm mb-4">Trusted by 10,000+ students already learning smarter</p>
          <div className="flex items-center justify-center">
            <div className="flex -space-x-2">
              {['PS', 'RV', 'AP', 'VS', 'NK'].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-bg-primary flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: [
                      'linear-gradient(135deg, #3b82f6, #60a5fa)',
                      'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                      'linear-gradient(135deg, #22c55e, #4ade80)',
                      'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      'linear-gradient(135deg, #f43f5e, #fb7185)',
                    ][i],
                    color: '#fff',
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex items-center ml-3 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-gold fill-gold" />
              ))}
              <span className="text-text-secondary text-sm ml-1.5">4.9/5</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Mini Dashboard Preview ─── */
const DashboardPreview: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      animate={{
        rotateX: mousePos.y * -8,
        rotateY: mousePos.x * 8,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="glass-card-strong p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/30"
      >
        {/* Stat Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Zap, label: 'XP', value: '2,450', color: 'text-electric-light', bg: 'bg-electric/15' },
            { icon: Award, label: 'Level', value: 'Scholar', color: 'text-violet-light', bg: 'bg-violet/15' },
            { icon: Flame, label: 'Streak', value: '12 days', color: 'text-gold-light', bg: 'bg-gold/15' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.15 }}
              className="glass-card p-3 sm:p-4 text-center"
            >
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="text-text-muted text-xs">{stat.label}</p>
              <p className={`font-bold text-sm sm:text-base font-mono ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Quiz Card Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="glass-card p-4 mb-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-electric/15">
                <Brain size={16} className="text-electric-light" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Organic Chemistry — Quiz #7</p>
                <p className="text-xs text-text-muted">12 questions • 15 min</p>
              </div>
            </div>
            <Badge variant="green" glow>Active</Badge>
          </div>
          <div className="w-full bg-bg-primary rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              transition={{ duration: 1.5, delay: 1.6, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-electric to-electric-light"
            />
          </div>
          <p className="text-xs text-text-muted mt-1.5">8 of 12 answered</p>
        </motion.div>

        {/* Achievement Badges Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-xs text-text-muted mr-1">Recent Badges:</span>
          {[
            { icon: '🔥', label: 'Week Warrior', bg: 'bg-gold/15 border-gold/30' },
            { icon: '🧠', label: 'Quiz Master', bg: 'bg-electric/15 border-electric/30' },
            { icon: '⚡', label: 'Speed Demon', bg: 'bg-violet/15 border-violet/30' },
          ].map((badge, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.9 + i * 0.1, type: 'spring' }}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${badge.bg}`}
            >
              <span>{badge.icon}</span>
              <span className="text-text-secondary">{badge.label}</span>
            </motion.span>
          ))}
          <Trophy size={14} className="text-gold ml-1" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
