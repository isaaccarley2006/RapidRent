-- Create community profile cards table
CREATE TABLE public.community_profile_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  headline TEXT NOT NULL,
  bio TEXT,
  budget_per_person NUMERIC,
  preferred_areas TEXT[],
  move_in_date DATE,
  duration_months INTEGER,
  gender_preference TEXT,
  occupation TEXT,
  work_pattern TEXT,
  has_pets BOOLEAN DEFAULT false,
  is_smoker BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  community_groups TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community connections table
CREATE TABLE public.community_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  target_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for community profile cards
ALTER TABLE public.community_profile_cards ENABLE ROW LEVEL SECURITY;

-- Enable RLS for community connections
ALTER TABLE public.community_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for community_profile_cards
CREATE POLICY "Users can view all active community profiles" 
ON public.community_profile_cards 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own community profile" 
ON public.community_profile_cards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community profile" 
ON public.community_profile_cards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community profile" 
ON public.community_profile_cards 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for community_connections
CREATE POLICY "Users can view their own connections" 
ON public.community_connections 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "Users can create connection requests" 
ON public.community_connections 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they're involved in" 
ON public.community_connections 
FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = target_id);

-- Add update trigger for community_profile_cards
CREATE TRIGGER update_community_profile_cards_updated_at
BEFORE UPDATE ON public.community_profile_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add update trigger for community_connections
CREATE TRIGGER update_community_connections_updated_at
BEFORE UPDATE ON public.community_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data for community profile cards
INSERT INTO public.community_profile_cards (
  user_id, headline, bio, budget_per_person, preferred_areas, 
  move_in_date, duration_months, gender_preference, occupation, 
  work_pattern, has_pets, is_smoker, status, community_groups
) VALUES 
-- Spanish community profiles
('00000000-0000-0000-0000-000000000001', 'Spanish Marketing Manager seeking Shoreditch flatmate', 'Love cooking paella and exploring London''s food scene! Looking for clean, social housemates.', 800, '{"Shoreditch", "Hackney", "Bethnal Green"}', '2024-11-15', 12, 'mixed', 'Marketing Manager', 'hybrid', false, false, 'active', '{"Spanish", "Shoreditch"}'),
('00000000-0000-0000-0000-000000000002', 'Barcelona native - Software Engineer', 'Tech professional from Barcelona. Clean, quiet, but love weekend social events. Seeking similar minded people.', 900, '{"Canary Wharf", "Bermondsey", "London Bridge"}', '2024-12-01', 6, 'mixed', 'Software Engineer', 'remote', false, false, 'active', '{"Spanish"}'),
('00000000-0000-0000-0000-000000000003', 'Valencia student seeking central London share', 'Masters student at UCL. Social, responsible, and love exploring museums and galleries.', 650, '{"Camden", "Kings Cross", "Bloomsbury"}', '2024-11-01', 10, 'female', 'Student', 'full-time', false, false, 'active', '{"Spanish"}'),

-- French community profiles  
('00000000-0000-0000-0000-000000000004', 'Parisian Finance Professional - South London', 'Investment banker from Paris. Clean, professional, enjoy wine tasting and cycling along Thames.', 1200, '{"Clapham", "Battersea", "Wandsworth"}', '2024-12-15', 12, 'mixed', 'Investment Banker', 'office', false, false, 'active', '{"French"}'),
('00000000-0000-0000-0000-000000000005', 'French Chef looking for foodie flatmates', 'Professional chef specializing in modern French cuisine. Love hosting dinner parties!', 750, '{"Borough", "Bermondsey", "London Bridge"}', '2024-11-20', 8, 'mixed', 'Chef', 'evenings', false, false, 'active', '{"French"}'),
('00000000-0000-0000-0000-000000000006', 'Lyon native - Creative Designer', 'Graphic designer with passion for art and sustainable living. Seeking eco-conscious housemates.', 700, '{"Peckham", "Nunhead", "New Cross"}', '2024-10-30', 12, 'mixed', 'Graphic Designer', 'freelance', true, false, 'active', '{"French"}'),

-- German community profiles
('00000000-0000-0000-0000-000000000007', 'Berlin Engineer - East London enthusiast', 'Mechanical engineer from Berlin. Love techno, cycling, and exploring East London''s street art scene.', 850, '{"Hackney Wick", "Stratford", "Bow"}', '2024-11-10', 6, 'mixed', 'Mechanical Engineer', 'hybrid', false, false, 'active', '{"German"}'),
('00000000-0000-0000-0000-000000000008', 'Munich PhD researcher seeking quiet space', 'Academic researcher in renewable energy. Quiet, clean, but sociable on weekends.', 800, '{"Imperial College area", "South Kensington", "Chelsea"}', '2024-12-01', 24, 'mixed', 'PhD Researcher', 'flexible', false, false, 'active', '{"German"}'),
('00000000-0000-0000-0000-000000000009', 'Hamburg startup founder - dynamic professional', 'Fintech startup founder. High energy, clean, looking for ambitious housemates in central London.', 1000, '{"Shoreditch", "Old Street", "Angel"}', '2024-11-05', 12, 'mixed', 'Startup Founder', 'full-time', false, false, 'active', '{"German", "Shoreditch"}'),

-- Shoreditch-specific community profiles
('00000000-0000-0000-0000-000000000010', 'Creative Professional - Shoreditch Local', 'Fashion photographer living in Shoreditch for 3 years. Know all the best spots!', 900, '{"Shoreditch", "Hoxton", "Old Street"}', '2024-11-25', 6, 'mixed', 'Photographer', 'irregular', false, false, 'active', '{"Shoreditch"}'),
('00000000-0000-0000-0000-000000000011', 'Tech Consultant - Shoreditch Lifestyle', 'Management consultant who loves the Shoreditch scene. Social, clean, great at organizing house activities.', 950, '{"Shoreditch", "Hackney", "Dalston"}', '2024-12-10', 12, 'mixed', 'Management Consultant', 'travel', false, false, 'active', '{"Shoreditch"}'),
('00000000-0000-0000-0000-000000000012', 'Artist seeking creative community in Shoreditch', 'Mixed media artist with studio space. Looking for other creatives to share living space and inspiration.', 700, '{"Shoreditch", "Bethnal Green", "Hackney Wick"}', '2024-11-15', 12, 'mixed', 'Artist', 'flexible', true, false, 'active', '{"Shoreditch"}')