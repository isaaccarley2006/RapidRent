-- First drop the existing constraint to allow updates
ALTER TABLE offers DROP CONSTRAINT IF EXISTS offers_status_check;

-- Now add the new constraint with all required status values
ALTER TABLE offers ADD CONSTRAINT offers_status_check 
CHECK (status IN ('submitted', 'shortlisted', 'accepted', 'rejected', 'pending', 'declined'));

-- Update the default value to 'submitted'
ALTER TABLE offers ALTER COLUMN status SET DEFAULT 'submitted';