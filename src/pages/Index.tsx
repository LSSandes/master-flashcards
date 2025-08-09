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
  const [currentView, setCurrentView] = useState<"Study" | "Create" | "Manage">(
    "Study"
  );
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { loading: cardsLoading } = useFlashcards();
  const navigate = useNavigate();

  if (authLoading || cardsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-first-background p-4">
        <Card className="w-full max-w-md text-center z-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              FlashCard Master
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Welcome to FlashCard Master! Sign in to create and study your
              personal flashcards with spaced repetition.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="w-full outline-1 outline-dashed outline-purple-500 outline-offset-2"
            >
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-custom-background relative overflow-hidden">
      <div className="relative">
        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          user={user}
        />

        <main className="container mx-auto px-4 py-8 z-20">
          {currentView === "Study" && <StudyMode />}
          {currentView === "Create" && <CreateCard />}
          {currentView === "Manage" && <ManageCards />}
        </main>
      </div>
    </div>
  );
};

export default Index;
