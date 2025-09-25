-- Add missing columns to profiles table for visa and nationality data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS visa_type TEXT,
ADD COLUMN IF NOT EXISTS nationality TEXT;