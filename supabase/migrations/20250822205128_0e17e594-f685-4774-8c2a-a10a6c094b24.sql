-- Update offers table status constraint to match application logic
-- First, update any existing data to use the new status values
UPDATE offers 
SET status = 'submitted' 
WHERE status = 'pending';

UPDATE offers 
SET status = 'rejected' 
WHERE status = 'declined';

-- Drop the existing check constraint
ALTER TABLE offers DROP CONSTRAINT IF EXISTS offers_status_check;

-- Add the new check constraint with the correct status values
ALTER TABLE offers ADD CONSTRAINT offers_status_check 
CHECK (status IN ('submitted', 'shortlisted', 'accepted', 'rejected'));

-- Update the default value to 'submitted'
ALTER TABLE offers ALTER COLUMN status SET DEFAULT 'submitted';