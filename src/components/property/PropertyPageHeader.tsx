import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
export const PropertyPageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleBackToListings = () => {
    navigate('/listings');
  };
  
  return (
    <div className="flex items-center justify-between p-6 border-b border-muted">
      <Button
        variant="ghost"
        onClick={handleBackToListings}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Button>
    </div>
  );
};