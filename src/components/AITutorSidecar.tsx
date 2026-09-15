// ═══════════════════════════════════════════════════════
// CUBA BOARD — Phase 14: AI Tutor Assistant Sidecar
// Floating AI tutor providing instant concept explanations & study hints
// ═══════════════════════════════════════════════════════

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, User, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AITutorSidecar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am your Cuba Board AI Tutor. Ask me any question about your study materials, weak topics, or exam preparation!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuestion = input;
    setInput('');

    // Simulate AI tutor answer
    setTimeout(() => {
      let responseText = `Great question regarding "${currentQuestion}"! Let's break this concept down step-by-step: First, identify the core principle, then connect it to your quiz notes. Practice recalling key definitions using your Flashcards deck!`;
      
      const qLower = currentQuestion.toLowerCase();
      if (qLower.includes('physics') || qLower.includes('force') || qLower.includes('motion')) {
        responseText = `In Physics, key concepts like Newton's Laws or Thermodynamics rely on fundamental equations. Remember: F = m*a and energy conservation principles!`;
      } else if (qLower.includes('exam') || qLower.includes('study') || qLower.includes('tips')) {
        responseText = `Top Study Tip: Combine active quiz recall with 15-minute spaced repetition flashcard sessions every day to boost long-term memory retention!`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 p-4 bg-gradient-to-tr from-primary to-purple-600 hover:from-primaryHover hover:to-purple-500 text-white rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105 flex items-center gap-2 font-bold text-sm"
        title="Open AI Tutor"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline">AI Tutor</span>
      </button>

      {/* Sidecar Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-full max-w-sm bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-surfaceHover border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Cuba Board AI Tutor
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                  </h3>
                  <p className="text-[10px] text-success font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                    Active Learning Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    m.sender === 'user' ? 'bg-primary text-white' : 'bg-violet/20 text-violet-light border border-violet/30'
                  }`}>
                    {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-surfaceHover text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    <p>{m.text}</p>
                    <span className="text-[9px] opacity-60 block mt-1 text-right">{m.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-surfaceHover border-t border-white/5 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ask AI Tutor a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-background text-white px-3.5 py-2.5 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 bg-primary hover:bg-primaryHover disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
