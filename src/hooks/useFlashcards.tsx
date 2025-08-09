import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";
import { features } from "process";

export interface CardData {
  id: string;
  word: string;
  definition: string;
  bin: number;
  incorrect_count: number;
  next_review: string | null;
  user_id?: string | null;
}

export const useFlashcards = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchCards = async () => {
    setLoading(true);
    try {
      let query = supabase.from("flashcards").select("*");

      if (isAuthenticated && user) {
        // Fetch user's cards
        query = query.eq("user_id", user.id);
      } else {
        // Fetch demo cards (where user_id is null)
        query = query.is("user_id", null);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Error fetching cards:", error);
        toast({
          title: "Error",
          description: "Failed to load flashcards",
          variant: "destructive",
        });
      } else {
        console.log("data================>", data);
        setCards(data || []);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast({
        title: "Error",
        description: "Failed to load flashcards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [isAuthenticated, user]);

  const createCard = async (word: string, definition: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create flashcards",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase.from("flashcards").insert({
        word,
        definition,
        user_id: user.id,
        bin: 0,
        incorrect_count: 0,
        next_review: null,
      });

      if (error) {
        console.error("Error creating card:", error);
        toast({
          title: "Error",
          description: "Failed to create flashcard",
          variant: "destructive",
        });
        return false;
      }

      await fetchCards();
      toast({
        title: "Success!",
        description: "Flashcard created successfully",
      });
      return true;
    } catch (error) {
      console.error("Error creating card:", error);
      toast({
        title: "Error",
        description: "Failed to create flashcard",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCard = async (cardId: string, correct: boolean) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to study flashcards",
        variant: "destructive",
      });
      return;
    }

    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    let newBin = card.bin;
    let newIncorrectCount = card.incorrect_count;
    let nextReview: string | null = null;

    if (correct) {
      // Move to next bin (max 11)
      newBin = Math.min(card.bin + 1, 11);
    } else {
      // Reset to bin 1 and increment incorrect count
      newBin = 1;
      newIncorrectCount = card.incorrect_count + 1;
    }

    // Calculate next review time based on bin
    const intervals = [
      0, // bin 0 (now)
      5 * 1000, // bin 1 - 5 seconds
      25 * 1000, // bin 2 - 25 seconds
      2 * 60 * 1000, // bin 3 - 2 minutes
      10 * 60 * 1000, // bin 4 - 10 minutes
      1 * 60 * 60 * 1000, // bin 5 - 1 hour
      5 * 60 * 60 * 1000, // bin 6 - 5 hours
      1 * 24 * 60 * 60 * 1000, // bin 7 - 1 day
      5 * 24 * 60 * 60 * 1000, // bin 8 - 5 days
      25 * 24 * 60 * 60 * 1000, // bin 9 - 25 days
      4 * 30 * 24 * 60 * 60 * 1000, // bin 10 - 4 months (approx 30 days/month)
      Infinity, // bin 11 - never
    ];

    if (newBin > 0 && newBin < intervals.length) {
      const reviewDate = new Date();

      if (intervals[newBin] !== Infinity) {
        reviewDate.setTime(reviewDate.getTime() + intervals[newBin]);
        nextReview = reviewDate.toISOString();
      } else {
        nextReview = null; // or handle "never" case
      }
    }

    try {
      const { error } = await supabase
        .from("flashcards")
        .update({
          bin: newBin,
          incorrect_count: newIncorrectCount,
          next_review: nextReview,
        })
        .eq("id", cardId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating card:", error);
        toast({
          title: "Error",
          description: "Failed to update flashcard",
          variant: "destructive",
        });
        return;
      }

      await fetchCards();
      checkForNoWords();
    } catch (error) {
      console.error("Error updating card:", error);
      toast({
        title: "Error",
        description: "Failed to update flashcard",
        variant: "destructive",
      });
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please signin to delete flashcards",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from("flashcards")
        .delete()
        .eq("id", cardId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting card:", error);
        toast({
          title: "Error",
          description: "Failed to delete flashcard",
          variant: "destructive",
        });
        return false;
      }
      await fetchCards();
      toast({
        title: "Deleted",
        description: "Flashcard deleted successfully",
      });
      return true;
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        title: "Error",
        description: "Failed to delete flashcard",
        variant: "destructive",
      });
    }
    console.log("delete cards----->", cards);
  };

  const checkForNoWords = () => {
    const hasWordsToReview = cards.some((card) => card.bin < 12);
    if (!hasWordsToReview) {
      toast({
        title: "Congratulations!",
        description:
          "You have no more words to review; you are permanently done!",
        variant: "destructive",
      });
    }
  };

  return {
    cards,
    loading,
    createCard,
    updateCard,
    deleteCard,
    fetchCards,
  };
};
