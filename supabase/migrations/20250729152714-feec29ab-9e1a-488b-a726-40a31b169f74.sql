-- Add property details columns to properties table
ALTER TABLE public.properties 
ADD COLUMN bedrooms integer,
ADD COLUMN bathrooms integer, 
ADD COLUMN furnished boolean DEFAULT false,
ADD COLUMN property_type text DEFAULT 'apartment';