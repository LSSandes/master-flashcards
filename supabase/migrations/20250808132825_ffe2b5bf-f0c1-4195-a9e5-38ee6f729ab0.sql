-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  bin INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  next_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for this demo)
CREATE POLICY "Anyone can view flashcards" 
ON public.flashcards 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create flashcards" 
ON public.flashcards 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update flashcards" 
ON public.flashcards 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete flashcards" 
ON public.flashcards 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON public.flashcards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert demo data
INSERT INTO public.flashcards (word, definition, bin, incorrect_count, next_review) VALUES
('Serendipity', 'The occurrence and development of events by chance in a happy or beneficial way.', 0, 0, NULL),
('Ephemeral', 'Lasting for a very short time; transitory.', 2, 1, now() - interval '10 seconds'),
('Ubiquitous', 'Present, appearing, or found everywhere.', 5, 0, now() + interval '30 minutes');