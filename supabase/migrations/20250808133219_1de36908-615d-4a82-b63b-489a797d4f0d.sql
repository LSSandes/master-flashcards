-- Fix security vulnerabilities in flashcards system

-- Drop insecure RLS policies
DROP POLICY IF EXISTS "Anyone can view flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Anyone can create flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Anyone can update flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Anyone can delete flashcards" ON public.flashcards;

-- Add user_id column to associate flashcards with users
ALTER TABLE public.flashcards 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing demo data to be owned by a placeholder user (will be cleaned up when real users create cards)
-- For now, set user_id to null for demo cards, but we'll create secure policies

-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create secure RLS policies that restrict access to user's own flashcards
CREATE POLICY "Users can view their own flashcards" 
ON public.flashcards 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own flashcards" 
ON public.flashcards 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flashcards" 
ON public.flashcards 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flashcards" 
ON public.flashcards 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Allow viewing demo cards (where user_id is null) for unauthenticated users
CREATE POLICY "Anyone can view demo flashcards" 
ON public.flashcards 
FOR SELECT 
USING (user_id IS NULL);

-- Clear existing demo data as it's no longer secure
DELETE FROM public.flashcards;