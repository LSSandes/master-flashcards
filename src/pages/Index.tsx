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
      <div className="min-h-screen flex items-center justify-center bg-first-background lg:p-32 p-4">
        <div className=" text-center z-10 flex flex-col gap-10">
          <div className="lg:text-7xl text-4xl font-bold p-4 max-w-4xl lg:text-left text-center select-none">
            Learn new language with master flashcards
          </div>

          <div className="space-y-4 flex flex-col gap-5 items-center justify-start">
            <p className="lg:text-2xl text-lg max-w-2xl text-center select-none">
              Welcome to FlashCard Master! Sign in to create and study your
              personal flashcards with spaced repetition.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="w-[200px] outline-1 outline-dashed outline-purple-500 outline-offset-2"
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="flex-1 "></div>
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
