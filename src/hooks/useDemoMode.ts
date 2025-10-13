import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export type VerificationStatus =
  | "not_started"
  | "in_progress"
  | "verified"
  | "failed";

export interface DemoVerificationState {
  identity_verified: VerificationStatus;
  employment_verified: VerificationStatus;
  income_verified: VerificationStatus;
  credit_verified: VerificationStatus;
  references_verified: VerificationStatus;
  bank_verified: VerificationStatus;
}

const DEMO_STORAGE_KEY = "rapidrent_demo_state";
const REFERENCE_CHECK_STORAGE_KEY = "rapidrent_reference_check";

interface ReferenceCheckState {
  submissionId: string;
  startTime: number;
  completionTime: number;
  status: "not_started" | "in_progress" | "completed";
}

export const useDemoMode = () => {
  const { toast } = useToast();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoState, setDemoState] = useState<DemoVerificationState>({
    identity_verified: "not_started",
    employment_verified: "not_started",
    income_verified: "not_started",
    credit_verified: "not_started",
    references_verified: "not_started",
    bank_verified: "not_started",
  });
  const [referenceCheckState, setReferenceCheckState] =
    useState<ReferenceCheckState>({
      submissionId: "",
      startTime: 0,
      completionTime: 0,
      status: "not_started",
    });

  useEffect(() => {
    // Check if demo mode is enabled via URL param
    const urlParams = new URLSearchParams(window.location.search);
    const isDemo =
      urlParams.get("demo") === "1" || urlParams.get("demo") === "true";
    setIsDemoMode(isDemo);

    // Load demo state from localStorage
    if (isDemo) {
      const savedState = localStorage.getItem(DEMO_STORAGE_KEY);
      if (savedState) {
        try {
          setDemoState(JSON.parse(savedState));
        } catch (e) {
          console.warn("Failed to parse demo state from localStorage");
        }
      }

      // Load reference check state
      const savedReferenceState = localStorage.getItem(
        REFERENCE_CHECK_STORAGE_KEY
      );
      if (savedReferenceState) {
        try {
          const parsedState = JSON.parse(savedReferenceState);
          setReferenceCheckState(parsedState);

          // Check if verification should be completed
          const now = Date.now();
          if (
            parsedState.status === "in_progress" &&
            now >= parsedState.completionTime
          ) {
            completeReferenceCheck(parsedState.submissionId);
          }
        } catch (e) {
          console.warn(
            "Failed to parse reference check state from localStorage"
          );
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
    const newState = {
      ...demoState,
      [type]: "in_progress" as VerificationStatus,
    };
    saveDemoState(newState);

    toast({
      title: `${name} verification started`,
      description: "Processing your verification...",
    });

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, duration));

    // Random success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    const finalStatus: VerificationStatus = isSuccess ? "verified" : "failed";

    const finalState = { ...demoState, [type]: finalStatus };
    saveDemoState(finalState);

    toast({
      title: `${name} verification ${isSuccess ? "completed" : "failed"}`,
      description: isSuccess
        ? `${name} has been successfully verified`
        : `${name} verification failed. Please try again.`,
      variant: isSuccess ? "default" : "destructive",
    });

    return isSuccess;
  };

  const resetDemoState = () => {
    const resetState: DemoVerificationState = {
      identity_verified: "not_started",
      employment_verified: "not_started",
      income_verified: "not_started",
      credit_verified: "not_started",
      references_verified: "not_started",
      bank_verified: "not_started",
    };
    saveDemoState(resetState);
    toast({
      title: "Demo reset",
      description: "All verification statuses have been reset",
    });
  };

  const completeAllVerifications = async () => {
    const completedState: DemoVerificationState = {
      identity_verified: "verified",
      employment_verified: "verified",
      income_verified: "verified",
      credit_verified: "verified",
      references_verified: "verified",
      bank_verified: "verified",
    };
    saveDemoState(completedState);
    toast({
      title: "All verifications completed",
      description: "Demo profile is now 100% verified",
    });
  };

  const startReferenceCheck = (submissionId: string) => {
    const now = Date.now();
    // Use 30 seconds for demo instead of 6 hours
    const completionTime = now + 30 * 1000;

    const newState: ReferenceCheckState = {
      submissionId,
      startTime: now,
      completionTime,
      status: "in_progress",
    };

    setReferenceCheckState(newState);
    localStorage.setItem(REFERENCE_CHECK_STORAGE_KEY, JSON.stringify(newState));

    toast({
      title: "Reference check started",
      description:
        "Your verification is being processed. You'll be notified when complete.",
    });

    // Set a timer to complete the verification
    setTimeout(() => {
      completeReferenceCheck(submissionId);
    }, 30 * 1000);
  };

  const completeReferenceCheck = async (submissionId: string) => {
    const completedState: DemoVerificationState = {
      identity_verified: "verified",
      employment_verified: "verified",
      income_verified: "verified",
      credit_verified: "verified",
      references_verified: "verified",
      bank_verified: "verified",
    };

    const completedReferenceState: ReferenceCheckState = {
      submissionId,
      startTime: referenceCheckState.startTime,
      completionTime: Date.now(),
      status: "completed",
    };

    setDemoState(completedState);
    setReferenceCheckState(completedReferenceState);
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(completedState));
    localStorage.setItem(
      REFERENCE_CHECK_STORAGE_KEY,
      JSON.stringify(completedReferenceState)
    );

    // Persist verification status to database
    await persistVerificationToDatabase();

    toast({
      title: "✅ Verification Complete!",
      description:
        "Your profile has been fully verified. You now have verified status across all views.",
    });
  };

  const persistVerificationToDatabase = async () => {
    try {
      // Check if we have access to user context
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        console.log("No user found, skipping database persistence");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          identity_verified: true,
          employment_verified: true,
          income_verified: true,
          credit_verified: true,
          references_verified: true,
          bank_verified: true,
          comprehensive_verification_status: "verified",
          comprehensive_verification_completed_at: new Date().toISOString(),
          profile_completion_percentage: 100,
          identity_verified_at: new Date().toISOString(),
          employment_verified_at: new Date().toISOString(),
          income_verified_at: new Date().toISOString(),
          credit_verified_at: new Date().toISOString(),
          references_verified_at: new Date().toISOString(),
          bank_verified_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      console.log("Successfully persisted demo verification to database");
    } catch (error) {
      console.error("Error persisting verification to database:", error);
    }
  };

  const getRemainingTime = () => {
    if (referenceCheckState.status !== "in_progress") return 0;
    const now = Date.now();
    const remaining = Math.max(0, referenceCheckState.completionTime - now);
    return Math.ceil(remaining / 1000); // Return seconds remaining
  };

  const getCompletionPercentage = () => {
    const verifications = Object.values(demoState);
    const verifiedCount = verifications.filter(
      (status) => status === "verified"
    ).length;
    return Math.round((verifiedCount / verifications.length) * 100);
  };

  return {
    isDemoMode,
    demoState,
    referenceCheckState,
    simulateVerification,
    resetDemoState,
    completeAllVerifications,
    startReferenceCheck,
    completeReferenceCheck,
    getRemainingTime,
    getCompletionPercentage,
  };
};
