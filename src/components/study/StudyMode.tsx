import { useState, useEffect } from "react";
import FlashCard from "@/components/flashcard/FlashCard";
import { useFlashcards } from "@/hooks/useFlashcards";

interface CardData {
  id: string;
  word: string;
  definition: string;
  bin: number;
  incorrect_count: number;
  next_review: string | null;
  user_id?: string | null;
}

export default function StudyMode() {
  const {cards, updateCard } = useFlashcards();
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [studyQueue, setStudyQueue] = useState<CardData[]>([]);

  useEffect(() => {
    // Build study queue based on spaced repetition algorithm
    const now = new Date();

    // Cards ready for review (bins 1-11)
    const readyCards = cards
      .filter(
        (card) =>
          card.bin > 0 &&
          card.bin < 12 &&
          card.incorrect_count < 11 &&
          (!card.next_review || new Date(card.next_review) <= now)
      )
      .sort((a, b) => {
        // Sort by bin (higher bins first), then by time
        if (a.bin !== b.bin) return b.bin - a.bin;
        if (!a.next_review && !b.next_review) return 0;
        if (!a.next_review) return -1;
        if (!b.next_review) return 1;
        return (
          new Date(a.next_review).getTime() - new Date(b.next_review).getTime()
        );
      });

    // New cards (bin 0)
    const newCards = cards.filter((card) => card.bin === 0);

    // If no ready cards, use new cards
    const queue = readyCards.length > 0 ? readyCards : newCards;

    setStudyQueue(queue);
    setCurrentCard(queue[0] || null);
  }, [cards]);

  const handleAnswer = async (correct: boolean) => {
    if (!currentCard) return;

    await updateCard(currentCard.id, correct);

    // Move to next card
    const nextQueue = studyQueue.slice(1);
    setStudyQueue(nextQueue);
    setCurrentCard(nextQueue[0] || null);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-16 animate-slide-up">
        <div className="w-32 h-32 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl">🧠</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome to Cognition Cards!
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Create your first flashcard to start your learning journey with spaced
          repetition.
        </p>
      </div>
    );
  }

  if (!currentCard) {
    // Check if all cards are mastered or in hard-to-remember
    const masteredCards = cards.filter((card) => card.bin === 11);
    const forgottenCards = cards.filter((card) => card.bin === 12);

    if (masteredCards.length + forgottenCards.length === cards.length) {
      return (
        <div className="text-center py-16 animate-slide-up">
          <div className="w-32 h-32 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Congratulations!
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            You have no more words to review; you are permanently done!
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-16 animate-slide-up">
        <div className="w-32 h-32 bg-yellow-300/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl">⏰</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          All Caught Up!
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          You are temporarily done; please come back later to review more words.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 animate-slide-up">
      <div className="text-center mb-8 ">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Study Session
        </h2>
        <p className="text-muted-foreground">
          {studyQueue.length} card{studyQueue.length !== 1 ? "s" : ""} remaining
        </p>
      </div>

      <FlashCard
        word={currentCard.word}
        definition={currentCard.definition}
        onCorrect={() => handleAnswer(true)}
        onIncorrect={() => handleAnswer(false)}
        className="mb-8 backdrop-blur-sm"
      />

      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full">
          <div className="text-sm text-muted-foreground">
            Bin: {currentCard.bin === 0 ? "New" : currentCard.bin}
          </div>
          <div className="w-1 h-1 bg-muted rounded-full"></div>
          <div className="text-sm text-muted-foreground">
            Mistakes: {currentCard.incorrect_count}
          </div>
        </div>
      </div>
    </div>
  );
}
