import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { VerificationCard } from './VerificationCard';
import { useDemoMode } from '@/hooks/useDemoMode';
import { 
  IdCard, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Users, 
  Building2,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const VerificationDashboard: React.FC = () => {
  const { 
    demoState, 
    simulateVerification, 
    resetDemoState, 
    completeAllVerifications, 
    getCompletionPercentage 
  } = useDemoMode();
  
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleVerification = async (type: keyof typeof demoState, name: string, duration?: number) => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));
    try {
      await simulateVerification(type, name, duration);
    } finally {
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }
  };

  const completionPercentage = getCompletionPercentage();

  const verificationItems = [
    {
      key: 'identity_verified' as const,
      title: 'Identity Verification',
      description: 'Verify your identity with government-issued ID',
      icon: <IdCard className="w-5 h-5" />,
      duration: 4000,
    },
    {
      key: 'employment_verified' as const,
      title: 'Employment Verification',
      description: 'Confirm your current employment status',
      icon: <Briefcase className="w-5 h-5" />,
      duration: 3500,
    },
    {
      key: 'income_verified' as const,
      title: 'Income Verification',
      description: 'Verify your income with pay stubs or tax documents',
      icon: <DollarSign className="w-5 h-5" />,
      duration: 3000,
    },
    {
      key: 'credit_verified' as const,
      title: 'Credit Check',
      description: 'Authorize a soft credit check for rental approval',
      icon: <CreditCard className="w-5 h-5" />,
      duration: 2500,
    },
    {
      key: 'references_verified' as const,
      title: 'References Verification',
      description: 'Verify your personal and professional references',
      icon: <Users className="w-5 h-5" />,
      duration: 4500,
    },
    {
      key: 'bank_verified' as const,
      title: 'Bank Verification',
      description: 'Verify your bank account for rental payments',
      icon: <Building2 className="w-5 h-5" />,
      duration: 2000,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Completion Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Profile Verification</CardTitle>
              <CardDescription>
                Complete your profile verification to unlock faster rental decisions
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completionPercentage} className="h-2" />
          
          {/* Demo Controls */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={completeAllVerifications}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete All (Demo)
            </Button>
            <Button
              onClick={resetDemoState}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {verificationItems.map((item) => (
          <VerificationCard
            key={item.key}
            title={item.title}
            description={item.description}
            status={demoState[item.key]}
            onVerify={() => handleVerification(item.key, item.title, item.duration)}
            loading={loadingStates[item.key]}
            icon={item.icon}
          />
        ))}
      </div>

      {completionPercentage === 100 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Profile Complete!</h3>
                <p className="text-sm text-green-700">
                  Your profile is fully verified and ready for rental applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};