import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useFlashcards } from "@/hooks/useFlashcards";

const binNames = [
  "New",
  "5 sec",
  "25 sec",
  "2 min",
  "10 min",
  "1 hour",
  "5 hours",
  "1 day",
  "5 days",
  "25 days",
  "4 months",
  "Never",
];

const getBinColor = (bin: number) => {
  if (bin === 0) return "bg-muted text-muted-foreground";
  if (bin <= 3) return "bg-error/20 text-error-foreground border-error/30";
  if (bin <= 6)
    return "bg-warning/20 text-warning-foreground border-warning/30";
  if (bin <= 9)
    return "bg-success/20 text-success-foreground border-success/30";
  if (bin === 11)
    return "bg-primary/20 text-primary-foreground border-primary/30";
  return "bg-muted text-muted-foreground";
};

const formatTimeUntilReview = (nextReview: Date | null) => {
  if (!nextReview) return "Ready now";

  const now = new Date();
  const diff = nextReview.getTime() - now.getTime();

  if (diff <= 0) return "Ready now";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

export default function ManageCards() {
  const { cards, deleteCard } = useFlashcards();
  const handleDelete = (id: string) => {
    deleteCard(id);
  };
  return (
    <div className="max-w-6xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Manage Flashcards
        </h2>
        <p className="text-muted-foreground">
          View and track your learning progress
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No cards yet
          </h3>
          <p className="text-muted-foreground">
            Create your first flashcard to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="p-6 bg-card/80 flex flex-col justify-between backdrop-blur-sm border border-border hover:shadow-card-hover transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col justify-between h-full space-y-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {card.word}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {card.definition}
                  </p>
                </div>
                <div className="space-y-4 flex-col justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getBinColor(card.bin)}>
                      {binNames[card.bin] || "Unknown"}
                    </Badge>

                    {card.incorrect_count != 11 ? (
                      <Badge
                        variant="outline"
                        className="bg-error/10 text-error border-error/30"
                      >
                        ❌ {card.incorrect_count}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-error/10 text-error border-error/30"
                      >
                        ☠️ Hard to remember
                      </Badge>
                    )}
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Next review:{" "}
                      {formatTimeUntilReview(
                        card.next_review ? new Date(card.next_review) : null
                      )}
                    </div>
                    <div className="flex justify-center items-center gap-3">
                      <button
                        className="bg-red-500 rounded-full p-1"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {cards.length > 0 && (
        <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {cards.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {cards.filter((card) => card.bin >= 8).length}
              </div>
              <div className="text-sm text-muted-foreground">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {cards.filter((card) => card.bin > 0 && card.bin < 8).length}
              </div>
              <div className="text-sm text-muted-foreground">Learning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error">
                {cards.filter((card) => card.incorrect_count === 11).length}
              </div>
              <div className="text-sm text-muted-foreground">Difficult</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
