import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react';
import { VerificationStatus } from '@/hooks/useDemoMode';

interface VerificationCardProps {
  title: string;
  description: string;
  status: VerificationStatus;
  onVerify: () => Promise<void>;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  title,
  description,
  status,
  onVerify,
  loading = false,
  icon
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            <Circle className="w-3 h-3 mr-1" />
            Not Started
          </Badge>
        );
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'in_progress':
        return 'In Progress...';
      case 'failed':
        return 'Try Again';
      default:
        return 'Verify Now';
    }
  };

  const getButtonVariant = () => {
    if (status === 'verified') return 'outline';
    if (status === 'failed') return 'destructive';
    return 'default';
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm mt-1">{description}</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onVerify}
          disabled={loading || status === 'in_progress' || status === 'verified'}
          variant={getButtonVariant()}
          className="w-full"
        >
          {loading ? 'Processing...' : getButtonText()}
        </Button>
      </CardContent>
      
      {status === 'in_progress' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
          <div className="h-full bg-primary animate-pulse" />
        </div>
      )}
    </Card>
  );
};