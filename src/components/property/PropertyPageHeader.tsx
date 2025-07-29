import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
export const PropertyPageHeader: React.FC = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const handleBackToListings = () => {
    navigate('/listings');
  };
  return;
};