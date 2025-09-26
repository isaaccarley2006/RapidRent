-- Update the current user's role to agent
UPDATE users 
SET role = 'agent', updated_at = now() 
WHERE id = 'a81ec641-0e72-4fc3-8f07-318b8c542fb5';