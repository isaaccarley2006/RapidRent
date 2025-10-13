-- Insert 7 new community profile cards to reach 20 total
INSERT INTO community_profile_cards (
  user_id, headline, bio, budget_per_person, preferred_areas, move_in_date, 
  duration_months, occupation, work_pattern, gender_preference, has_pets, 
  is_smoker, community_groups, status
) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Creative marketing manager seeking fun flatmates 🎯', 
   'Marketing manager from Berlin who loves hosting dinner parties and weekend brunches. Looking for social flatmates who enjoy good wine, Netflix nights, and exploring London''s food scene together.', 
   1100, ARRAY['Camden', 'King''s Cross', 'Islington'], '2024-03-10', 18, 'Marketing Manager', 'hybrid', 'no_preference', false, false, 
   ARRAY['German', 'Global'], 'active'),

  ('11111111-1111-1111-1111-111111111002', 'Yoga instructor + wellness enthusiast 🧘‍♀️', 
   'Certified yoga instructor from Barcelona seeking mindful flatmates. I start my days with meditation and love cooking healthy meals. Looking for someone who values a peaceful, wellness-focused home environment.', 
   850, ARRAY['Clapham', 'Brixton', 'Battersea'], '2024-02-25', 12, 'Yoga Instructor', 'freelance', 'female', false, false, 
   ARRAY['Spanish', 'Global'], 'active'),

  ('11111111-1111-1111-1111-111111111003', 'Finance analyst + fitness fanatic 💪', 
   'Investment analyst who hits the gym at 6am every day. I''m organized, clean, and love meal prepping on Sundays. Looking for active flatmates who don''t mind protein shakes in the fridge and early morning alarms.', 
   1300, ARRAY['Canary Wharf', 'London Bridge', 'City of London'], '2024-04-15', 24, 'Investment Analyst', 'office', 'no_preference', false, false, 
   ARRAY['Global', 'Shoreditch'], 'active'),

  ('11111111-1111-1111-1111-111111111004', 'Music producer with studio at home 🎵', 
   'Electronic music producer from Paris who works mostly nights. I have a small home studio (soundproofed!) and love collaborating with other creatives. Perfect for someone on different schedule who appreciates good beats.', 
   900, ARRAY['Hackney', 'Bethnal Green', 'Bow'], '2024-01-15', 12, 'Music Producer', 'freelance', 'no_preference', false, true, 
   ARRAY['French', 'Global'], 'active'),

  ('11111111-1111-1111-1111-111111111005', 'Medical student + rescue dog lover 🩺', 
   'Final year medical student with two rescue dogs (both house trained and very friendly!). I study a lot but love unwinding with dog walks in the park. Looking for pet-loving flatmates who don''t mind some furry companionship.', 
   750, ARRAY['Greenwich', 'Deptford', 'New Cross'], '2024-03-20', 12, 'Medical Student', 'student', 'no_preference', true, false, 
   ARRAY['Global'], 'active'),

  ('11111111-1111-1111-1111-111111111006', 'Freelance journalist covering London events 📰', 
   'Travel journalist who''s always exploring London''s hidden gems and events. I work irregular hours but love sharing stories and restaurant recommendations. Looking for curious flatmates who enjoy discovering the city together.', 
   800, ARRAY['Shoreditch', 'Dalston', 'Hackney'], '2024-02-05', 18, 'Journalist', 'freelance', 'no_preference', false, false, 
   ARRAY['Global', 'Shoreditch'], 'active'),

  ('11111111-1111-1111-1111-111111111007', 'Tech startup founder + coffee addict ☕', 
   'Building a sustainable tech startup while consuming unhealthy amounts of specialty coffee. I work long hours but value good conversations and collaborative energy at home. Looking for ambitious flatmates who understand the hustle.', 
   1200, ARRAY['Old Street', 'Shoreditch', 'Angel'], '2024-04-01', 24, 'Startup Founder', 'hybrid', 'no_preference', false, false, 
   ARRAY['Global', 'Shoreditch'], 'active');