import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FlashcardDeck, FlashcardStatus } from '@/types';
import { mockFlashcardDecks } from '@/lib/mockData';
import { STORAGE_KEYS } from '@/lib/constants';

interface FlashcardState {
  decks: FlashcardDeck[];
  currentDeckId: string | null;
  currentCardIndex: number;
  isFlipped: boolean;
  flipCard: () => void;
  nextCard: () => void;
  previousCard: () => void;
  markCard: (status: FlashcardStatus) => void;
  toggleBookmark: (cardId: string) => void;
  setCurrentDeck: (deckId: string) => void;
  addDeck: (deck: FlashcardDeck) => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      decks: mockFlashcardDecks,
      currentDeckId: null,
      currentCardIndex: 0,
      isFlipped: false,

      flipCard: () => {
        set((state) => ({ isFlipped: !state.isFlipped }));
      },

      nextCard: () => {
        const { decks, currentDeckId, currentCardIndex } = get();
        const deck = decks.find((d) => d.id === currentDeckId);
        if (!deck) return;

        const nextIndex = (currentCardIndex + 1) % deck.cards.length;
        set({ currentCardIndex: nextIndex, isFlipped: false });
      },

      previousCard: () => {
        const { decks, currentDeckId, currentCardIndex } = get();
        const deck = decks.find((d) => d.id === currentDeckId);
        if (!deck) return;

        const prevIndex = currentCardIndex === 0 ? deck.cards.length - 1 : currentCardIndex - 1;
        set({ currentCardIndex: prevIndex, isFlipped: false });
      },

      markCard: (status: FlashcardStatus) => {
        set((state) => {
          const { currentDeckId, currentCardIndex } = state;
          if (!currentDeckId) return state;

          const newDecks = state.decks.map((deck) => {
            if (deck.id !== currentDeckId) return deck;

            const newCards = deck.cards.map((card, index) => {
              if (index !== currentCardIndex) return card;
              return {
                ...card,
                status,
                lastReviewed: new Date().toISOString(),
                reviewCount: card.reviewCount + 1,
              };
            });

            // Recalculate mastery
            const mastered = newCards.filter((c) => c.status === 'mastered').length;
            const mastery = Math.round((mastered / newCards.length) * 100);

            return {
              ...deck,
              cards: newCards,
              mastery,
              lastStudied: new Date().toISOString(),
            };
          });

          return { decks: newDecks };
        });
      },

      toggleBookmark: (cardId: string) => {
        set((state) => ({
          decks: state.decks.map((deck) => ({
            ...deck,
            cards: deck.cards.map((card) =>
              card.id === cardId ? { ...card, bookmarked: !card.bookmarked } : card
            ),
          })),
        }));
      },

      addDeck: (deck: FlashcardDeck) => {
        set((state) => ({ decks: [deck, ...state.decks] }));
      },

      setCurrentDeck: (deckId: string) => {
        set({ currentDeckId: deckId, currentCardIndex: 0, isFlipped: false });
      },
    }),
    {
      name: STORAGE_KEYS.FLASHCARDS,
      partialize: (state) => ({
        decks: state.decks,
        currentDeckId: state.currentDeckId,
      }),
    }
  )
);
