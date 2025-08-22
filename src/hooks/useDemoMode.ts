import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type VerificationStatus = 'not_started' | 'in_progress' | 'verified' | 'failed';

export interface DemoVerificationState {
  identity_verified: VerificationStatus;
  employment_verified: VerificationStatus;
  income_verified: VerificationStatus;
  credit_verified: VerificationStatus;
  references_verified: VerificationStatus;
  bank_verified: VerificationStatus;
}

const DEMO_STORAGE_KEY = 'rentview_demo_state';

export const useDemoMode = () => {
  const { toast } = useToast();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoState, setDemoState] = useState<DemoVerificationState>({
    identity_verified: 'not_started',
    employment_verified: 'not_started',
    income_verified: 'not_started',
    credit_verified: 'not_started',
    references_verified: 'not_started',
    bank_verified: 'not_started',
  });

  useEffect(() => {
    // Check if demo mode is enabled via URL param
    const urlParams = new URLSearchParams(window.location.search);
    const isDemo = urlParams.get('demo') === '1' || urlParams.get('demo') === 'true';
    setIsDemoMode(isDemo);

    // Load demo state from localStorage
    if (isDemo) {
      const savedState = localStorage.getItem(DEMO_STORAGE_KEY);
      if (savedState) {
        try {
          setDemoState(JSON.parse(savedState));
        } catch (e) {
          console.warn('Failed to parse demo state from localStorage');
        }
      }
    }
  }, []);

  const saveDemoState = (state: DemoVerificationState) => {
    setDemoState(state);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  };

  const simulateVerification = async (
    type: keyof DemoVerificationState,
    name: string,
    duration: number = 3000
  ): Promise<boolean> => {
    // Set to in_progress
    const newState = { ...demoState, [type]: 'in_progress' as VerificationStatus };
    saveDemoState(newState);

    toast({
      title: `${name} verification started`,
      description: 'Processing your verification...',
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, duration));

    // Random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    const finalStatus: VerificationStatus = isSuccess ? 'verified' : 'failed';
    
    const finalState = { ...demoState, [type]: finalStatus };
    saveDemoState(finalState);

    toast({
      title: `${name} verification ${isSuccess ? 'completed' : 'failed'}`,
      description: isSuccess 
        ? `${name} has been successfully verified`
        : `${name} verification failed. Please try again.`,
      variant: isSuccess ? 'default' : 'destructive',
    });

    return isSuccess;
  };

  const resetDemoState = () => {
    const resetState: DemoVerificationState = {
      identity_verified: 'not_started',
      employment_verified: 'not_started',
      income_verified: 'not_started',
      credit_verified: 'not_started',
      references_verified: 'not_started',
      bank_verified: 'not_started',
    };
    saveDemoState(resetState);
    toast({
      title: 'Demo reset',
      description: 'All verification statuses have been reset',
    });
  };

  const completeAllVerifications = async () => {
    const completedState: DemoVerificationState = {
      identity_verified: 'verified',
      employment_verified: 'verified',
      income_verified: 'verified',
      credit_verified: 'verified',
      references_verified: 'verified',
      bank_verified: 'verified',
    };
    saveDemoState(completedState);
    toast({
      title: 'All verifications completed',
      description: 'Demo profile is now 100% verified',
    });
  };

  const getCompletionPercentage = () => {
    const verifications = Object.values(demoState);
    const verifiedCount = verifications.filter(status => status === 'verified').length;
    return Math.round((verifiedCount / verifications.length) * 100);
  };

  return {
    isDemoMode,
    demoState,
    simulateVerification,
    resetDemoState,
    completeAllVerifications,
    getCompletionPercentage,
  };
};