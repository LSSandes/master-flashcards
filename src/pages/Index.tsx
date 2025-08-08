import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/navigation/Navigation";
import StudyMode from "@/components/study/StudyMode";
import CreateCard from "@/components/create/CreateCard";
import ManageCards from "@/components/manage/ManageCards";
import { useAuth } from "@/hooks/useAuth";
import { useFlashcards } from "@/hooks/useFlashcards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [currentView, setCurrentView] = useState<"study" | "create" | "manage">("study");
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { cards, loading: cardsLoading, createCard, updateCard } = useFlashcards();
  const navigate = useNavigate();

  const handleCreateCard = async (word: string, definition: string) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    await createCard(word, definition);
  };

  const handleCardAnswered = (cardId: string, correct: boolean) => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    updateCard(cardId, correct);
  };

  if (authLoading || cardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">FlashCard Master</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Welcome to FlashCard Master! Sign in to create and study your personal flashcards with spaced repetition.
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary relative overflow-hidden">
      <div className="relative z-10">
        <Navigation currentView={currentView} onViewChange={setCurrentView} user={user} />
        
        <main className="container mx-auto px-4 py-8">
          {currentView === "study" && (
            <StudyMode cards={cards} onCardAnswered={handleCardAnswered} />
          )}
          {currentView === "create" && (
            <CreateCard onCardCreated={handleCreateCard} />
          )}
          {currentView === "manage" && (
            <ManageCards cards={cards} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;