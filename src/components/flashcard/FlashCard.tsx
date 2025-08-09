import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, Ban, CircleCheck } from "lucide-react";
interface FlashCardProps {
  word: string;
  definition: string;
  onCorrect: () => void;
  onIncorrect: () => void;
  className?: string;
}

export default function FlashCard({
  word,
  definition,
  onCorrect,
  onIncorrect,
  className,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [flashType, setFlashType] = useState<"success" | "error" | null>(null);

  const handleShowDefinition = () => {
    setIsFlipped(true);
  };

  const handleAnswer = (correct: boolean) => {
    setIsAnswered(true);
    setFlashType(correct ? "success" : "error");

    // Flash animation
    setTimeout(() => {
      setFlashType(null);
      if (correct) {
        onCorrect();
      } else {
        onIncorrect();
      }
      // Reset for next card
      setTimeout(() => {
        setIsFlipped(false);
        setIsAnswered(false);
      }, 500);
    }, 600);
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div
        className={cn(
          "card-flip h-80 relative transition-all duration-300",
          flashType === "success" && "flash-success",
          flashType === "error" && "flash-error"
        )}
      >
        <div
          className={cn(
            "card-flip-inner w-full h-full",
            isFlipped && "flipped"
          )}
        >
          {/* Front of card - Word */}
          <div className="card-front bg-gradient-to-br from-flashcard-front to-flashcard bg-card border border-border shadow-card hover:shadow-card-hover flex flex-col items-center justify-center p-8 transition-all duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {word}
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-primary-glow mx-auto mb-6"></div>
              {!isFlipped && (
                <button
                  onClick={handleShowDefinition}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-lg font-medium hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105 flex gap-3"
                >
                  <Eye />
                  Show Definition
                </button>
              )}
            </div>
          </div>

          {/* Back of card - Definition */}
          <div className="card-back bg-gradient-to-br from-flashcard-back to-flashcard bg-card border border-border shadow-card flex flex-col items-center justify-center p-8">
            <div className="text-center flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                Definition
              </h3>
              <p className="text-xl text-foreground mb-8 leading-relaxed">
                {definition}
              </p>
            </div>

            {isFlipped && !isAnswered && (
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-error to-error-glow text-error-foreground rounded-lg font-medium hover:shadow-glow-error transition-all duration-300 transform hover:scale-105 flex gap-2 items-center justify-center"
                >
                  <Ban className="w-4 h-4" />I got it wrong
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-success to-success-glow text-success-foreground rounded-lg font-medium hover:shadow-glow-success transition-all duration-300 transform hover:scale-105 flex gap-2 items-center justify-center"
                >
                  <CircleCheck className="w-4 h-4" />I got it right
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
