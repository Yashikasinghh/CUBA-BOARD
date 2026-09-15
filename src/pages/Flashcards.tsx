import { useState } from 'react';
import { Bookmark, CheckCircle2, RotateCw, Filter, ChevronLeft, ArrowLeft, RefreshCw, Zap } from 'lucide-react';
import { useFlashcardStore } from '@/stores/useFlashcardStore';
import { useUserStore } from '@/stores/useUserStore';
import { SUBJECT_COLORS } from '@/lib/constants';

const Flashcards = () => {
  const { addXP } = useUserStore();
  const { 
    decks, 
    currentDeckId, 
    currentCardIndex, 
    isFlipped, 
    flipCard, 
    nextCard, 
    previousCard, 
    markCard, 
    toggleBookmark, 
    setCurrentDeck 
  } = useFlashcardStore();

  const [activeFilter, setActiveFilter] = useState('All');

  // Compute available subject filters from the decks
  const subjects = ['All', ...Array.from(new Set(decks.map(d => d.subject)))];

  // Filter Decks
  const filteredDecks = decks.filter(d => activeFilter === 'All' || d.subject === activeFilter);
  
  // Find current active deck
  const activeDeck = decks.find(d => d.id === currentDeckId);
  const currentCard = activeDeck && activeDeck.cards ? activeDeck.cards[currentCardIndex] : null;

  const handleMarkStatus = (status: 'learning' | 'mastered') => {
    if (!currentCard) return;
    
    // Award XP
    const xpReward = status === 'mastered' ? 10 : 5;
    addXP(xpReward);
    
    // Mark card inside store
    markCard(status);
    
    // Auto-advance
    nextCard();
  };

  if (!currentDeckId || !activeDeck || !currentCard) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Flashcards</h1>
          <p className="text-gray-400">Review your AI-generated cards using spaced repetition.</p>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center bg-surface p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-300 font-medium">Filter by Subject:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {subjects.map(sub => (
              <button
                key={sub}
                onClick={() => setActiveFilter(sub)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  activeFilter === sub 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-surfaceHover border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Decks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDecks.map(deck => {
            const colors = SUBJECT_COLORS[deck.subject] || { base: '#94a3b8', light: '#cbd5e1', bg: 'rgba(148, 163, 184, 0.12)' };
            const masteredCount = deck.cards.filter(c => c.status === 'mastered').length;
            const progressPercent = Math.round((masteredCount / deck.cards.length) * 100);

            return (
              <div 
                key={deck.id} 
                className="card flex flex-col justify-between card-hover border-t-4" 
                style={{ borderTopColor: colors.base }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span 
                      className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" 
                      style={{ color: colors.light, backgroundColor: colors.bg }}
                    >
                      {deck.subject}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold">
                      {deck.cards.length} cards
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{deck.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{deck.topic}</p>
                  </div>

                  {/* Mastery Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-500">Mastery</span>
                      <span className="text-primary">{progressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-surfaceHover rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                  <span className="text-[10px] text-gray-500">
                    {deck.lastReviewed ? `Studied ${new Date(deck.lastReviewed).toLocaleDateString()}` : 'Not studied yet'}
                  </span>
                  <button 
                    onClick={() => setCurrentDeck(deck.id)}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-primary/20"
                  >
                    Study Deck
                  </button>
                </div>
              </div>
            );
          })}
          {filteredDecks.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 card border-dashed">
              No flashcard decks found matching this subject filter.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cards Study Runner Layout
  const masteredCount = activeDeck.cards.filter(c => c.status === 'mastered').length;
  const masteryPercent = Math.round((masteredCount / activeDeck.cards.length) * 100);

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col justify-start">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <button 
          onClick={() => setCurrentDeck(null)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-surfaceHover px-4 py-2.5 rounded-xl border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Decks
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-white leading-none">{activeDeck.title}</h2>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{activeDeck.subject} &bull; {activeDeck.topic}</span>
        </div>

        <div className="flex items-center gap-3 bg-surfaceHover px-4 py-2 rounded-xl border border-white/5 text-sm">
          <span className="text-xs text-gray-500">Deck Mastery:</span>
          <span className="font-bold text-primary">{masteryPercent}%</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-sm font-semibold text-gray-400 mb-6 bg-surface px-4 py-1 rounded-full border border-white/5">
          Card {currentCardIndex + 1} of {activeDeck.cards.length}
        </div>

        {/* Flashcard with 3D Flip */}
        <div 
          className="w-full max-w-2xl aspect-[3/2] perspective-1000 mb-8 cursor-pointer select-none"
          onClick={flipCard}
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-x-180' : ''}`}>
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden">
              <div className="w-full h-full card bg-surface flex flex-col items-center justify-center p-12 text-center border-t-4 border-t-primary relative">
                <span className="absolute top-6 left-6 px-3 py-1 bg-surfaceHover rounded-full text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Question
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(currentCard.id);
                  }}
                  className={`absolute top-6 right-6 p-2 rounded-full border-2 transition-all ${
                    currentCard.bookmarked ? 'border-orange-500 bg-orange-500/10 text-orange-500' : 'border-white/5 text-gray-500 hover:text-white'
                  }`}
                  title="Bookmark Card"
                >
                  <Bookmark className={`w-4 h-4 ${currentCard.bookmarked ? 'fill-current' : ''}`} />
                </button>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight px-4">{currentCard.front}</h2>
                
                <div className="absolute bottom-6 flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider animate-pulse">
                  <RotateCw className="w-4 h-4" />
                  Click to reveal answer
                </div>
              </div>
            </div>
            
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-x-180">
              <div className="w-full h-full card bg-surfaceHover flex flex-col items-center justify-center p-12 text-center border-t-4 border-t-success relative">
                <span className="absolute top-6 left-6 px-3 py-1 bg-success/15 rounded-full text-xs font-bold text-success uppercase tracking-wider">
                  Answer
                </span>
                <h2 className="text-lg sm:text-xl font-medium text-gray-100 leading-relaxed px-4 whitespace-pre-line">{currentCard.back}</h2>
                <div className="absolute bottom-6 flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
                  <RotateCw className="w-4 h-4" />
                  Click to show question
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button 
            onClick={previousCard}
            className="p-4 rounded-xl bg-surface border border-white/10 hover:bg-white/5 text-white transition-colors"
            title="Previous Card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => handleMarkStatus('learning')}
            className="px-8 py-4 bg-surface border border-white/10 hover:bg-white/5 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            Still Learning (+5 XP)
          </button>
          
          <button 
            onClick={() => handleMarkStatus('mastered')}
            className="px-8 py-4 bg-success/10 border-2 border-success text-success hover:bg-success hover:text-black rounded-xl font-bold transition-all shadow-lg shadow-success/10 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Got It! (+10 XP)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
