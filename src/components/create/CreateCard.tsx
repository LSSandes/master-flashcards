import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFlashcards } from "@/hooks/useFlashcards";

export default function CreateCard() {
  const { createCard, fetchCards } = useFlashcards();
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!word.trim() || !definition.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a word and definition.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createCard(word.trim(), definition.trim());
      await fetchCards();
      setWord("");
      setDefinition("");
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" max-w-2xl mx-auto animate-slide-up my-10">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Create New Flashcard
          </h2>
          <p className="text-muted-foreground">
            Add a new word and definition to your study deck
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="word" className="text-foreground font-medium">
              Word or Term
            </Label>
            <Input
              id="word"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter the word you want to learn..."
              className="h-12 text-lg bg-input/50 border-border focus:border-primary transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="definition" className="text-foreground font-medium">
              Definition
            </Label>
            <Textarea
              id="definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter the definition or explanation..."
              className="min-h-32 text-lg bg-input/50 border-border focus:border-primary transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !word.trim() || !definition.trim()}
            className="w-full h-12 text-lg bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Creating..." : "Create Flashcard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
