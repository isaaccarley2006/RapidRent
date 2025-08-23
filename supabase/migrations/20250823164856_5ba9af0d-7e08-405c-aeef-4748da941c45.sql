-- Update existing 'submitted' offers to 'pending' status
UPDATE offers 
SET status = 'pending' 
WHERE status = 'submitted';

-- Update existing 'rejected' offers to 'pending' status (since we removed rejected)
UPDATE offers 
SET status = 'pending' 
WHERE status = 'rejected';