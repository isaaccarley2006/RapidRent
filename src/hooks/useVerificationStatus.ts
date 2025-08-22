import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/hooks/useDemoMode';
import { supabase } from '@/lib/supabase';

export type VerificationStatus = 'not_started' | 'in_progress' | 'verified' | 'failed';

export interface UnifiedVerificationState {
  identity_verified: boolean;
  employment_verified: boolean;
  income_verified: boolean;
  credit_verified: boolean;
  references_verified: boolean;
  bank_verified: boolean;
  comprehensive_verification_status: 'not_started' | 'in_progress' | 'verified' | 'failed';
  comprehensive_verification_completed_at: string | null;
  profile_completion_percentage: number;
  verification_source: 'database' | 'demo_mode' | 'none';
}

export const useVerificationStatus = () => {
  const { user } = useAuth();
  const { isDemoMode, demoState, referenceCheckState } = useDemoMode();
  const [verificationState, setVerificationState] = useState<UnifiedVerificationState>({
    identity_verified: false,
    employment_verified: false,
    income_verified: false,
    credit_verified: false,
    references_verified: false,
    bank_verified: false,
    comprehensive_verification_status: 'not_started',
    comprehensive_verification_completed_at: null,
    profile_completion_percentage: 0,
    verification_source: 'none'
  });
  const [loading, setLoading] = useState(true);

  const fetchDatabaseVerificationStatus = async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          identity_verified,
          employment_verified,
          income_verified,
          credit_verified,
          references_verified,
          bank_verified,
          comprehensive_verification_status,
          comprehensive_verification_completed_at,
          profile_completion_percentage
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching verification status:', error);
      return null;
    }
  };

  const syncDemoModeToDatabase = async () => {
    if (!user?.id || !isDemoMode) return;

    // Check if demo mode shows verified status that's not in database
    const allDemoVerified = Object.values(demoState).every(status => status === 'verified');
    const referenceCompleted = referenceCheckState.status === 'completed';

    if (allDemoVerified && referenceCompleted) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            identity_verified: true,
            employment_verified: true,
            income_verified: true,
            credit_verified: true,
            references_verified: true,
            bank_verified: true,
            comprehensive_verification_status: 'verified',
            comprehensive_verification_completed_at: new Date().toISOString(),
            profile_completion_percentage: 100,
            identity_verified_at: new Date().toISOString(),
            employment_verified_at: new Date().toISOString(),
            income_verified_at: new Date().toISOString(),
            credit_verified_at: new Date().toISOString(),
            references_verified_at: new Date().toISOString(),
            bank_verified_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
        console.log('Successfully synced demo mode verification to database');
      } catch (error) {
        console.error('Error syncing demo mode to database:', error);
      }
    }
  };

  const updateVerificationState = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // First sync demo mode to database if needed
    await syncDemoModeToDatabase();

    // Fetch current database status
    const dbStatus = await fetchDatabaseVerificationStatus();

    if (isDemoMode) {
      // In demo mode, combine demo state with database state
      const allDemoVerified = Object.values(demoState).every(status => status === 'verified');
      const anyDemoInProgress = Object.values(demoState).some(status => status === 'in_progress');
      const referenceCompleted = referenceCheckState.status === 'completed';
      const referenceInProgress = referenceCheckState.status === 'in_progress';

      let comprehensiveStatus: 'not_started' | 'in_progress' | 'verified' | 'failed' = 'not_started';
      
      if (allDemoVerified && referenceCompleted) {
        comprehensiveStatus = 'verified';
      } else if (anyDemoInProgress || referenceInProgress) {
        comprehensiveStatus = 'in_progress';
      } else if (dbStatus?.comprehensive_verification_status) {
        comprehensiveStatus = dbStatus.comprehensive_verification_status as 'not_started' | 'in_progress' | 'verified' | 'failed';
      }

      setVerificationState({
        identity_verified: demoState.identity_verified === 'verified' || dbStatus?.identity_verified || false,
        employment_verified: demoState.employment_verified === 'verified' || dbStatus?.employment_verified || false,
        income_verified: demoState.income_verified === 'verified' || dbStatus?.income_verified || false,
        credit_verified: demoState.credit_verified === 'verified' || dbStatus?.credit_verified || false,
        references_verified: demoState.references_verified === 'verified' || dbStatus?.references_verified || false,
        bank_verified: demoState.bank_verified === 'verified' || dbStatus?.bank_verified || false,
        comprehensive_verification_status: comprehensiveStatus,
        comprehensive_verification_completed_at: referenceCompleted 
          ? new Date(referenceCheckState.completionTime).toISOString() 
          : dbStatus?.comprehensive_verification_completed_at || null,
        profile_completion_percentage: comprehensiveStatus === 'verified' ? 100 : (dbStatus?.profile_completion_percentage || 0),
        verification_source: 'demo_mode'
      });
    } else if (dbStatus) {
      // Use database status for non-demo mode
      setVerificationState({
        identity_verified: dbStatus.identity_verified || false,
        employment_verified: dbStatus.employment_verified || false,
        income_verified: dbStatus.income_verified || false,
        credit_verified: dbStatus.credit_verified || false,
        references_verified: dbStatus.references_verified || false,
        bank_verified: dbStatus.bank_verified || false,
        comprehensive_verification_status: (dbStatus.comprehensive_verification_status as 'not_started' | 'in_progress' | 'verified' | 'failed') || 'not_started',
        comprehensive_verification_completed_at: dbStatus.comprehensive_verification_completed_at,
        profile_completion_percentage: dbStatus.profile_completion_percentage || 0,
        verification_source: 'database'
      });
    } else {
      // No verification data available
      setVerificationState({
        identity_verified: false,
        employment_verified: false,
        income_verified: false,
        credit_verified: false,
        references_verified: false,
        bank_verified: false,
        comprehensive_verification_status: 'not_started',
        comprehensive_verification_completed_at: null,
        profile_completion_percentage: 0,
        verification_source: 'none'
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    updateVerificationState();
  }, [user, isDemoMode, demoState, referenceCheckState]);

  const refresh = () => {
    updateVerificationState();
  };

  const isFullyVerified = () => {
    return verificationState.comprehensive_verification_status === 'verified';
  };

  const getVerificationProgress = () => {
    const verifications = [
      verificationState.identity_verified,
      verificationState.employment_verified,
      verificationState.income_verified,
      verificationState.credit_verified,
      verificationState.references_verified,
      verificationState.bank_verified,
    ];
    const verifiedCount = verifications.filter(Boolean).length;
    return Math.round((verifiedCount / verifications.length) * 100);
  };

  return {
    verificationState,
    loading,
    refresh,
    isFullyVerified,
    getVerificationProgress,
    isDemoMode,
  };
};