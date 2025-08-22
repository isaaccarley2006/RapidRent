import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from '@/hooks/useDemoMode';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

type Status = "not_started" | "in_progress" | "verified" | "failed" | "needs_attention";

export default function IdentityVerificationCard() {
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isDemoMode, referenceCheckState, startReferenceCheck, getRemainingTime } = useDemoMode();
  const { verificationState, refresh: refreshVerification } = useVerificationStatus();

  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === '1';

  // Get status and updated time from unified verification state
  const status: Status = verificationState.comprehensive_verification_status as Status;
  const updatedAt = verificationState.comprehensive_verification_completed_at 
    ? new Date(verificationState.comprehensive_verification_completed_at).toLocaleString() 
    : "—";

  // Update remaining time for demo mode
  useEffect(() => {
    if (isDemoMode && referenceCheckState.status === 'in_progress') {
      const interval = setInterval(() => {
        const remaining = getRemainingTime();
        setRemainingTime(remaining);
        if (remaining <= 0) {
          refreshVerification();
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isDemoMode, referenceCheckState, getRemainingTime, refreshVerification]);

  const pillClass = (s: Status) => {
    const base = "inline-flex items-center rounded-full border px-2 py-1 text-xs";
    if (s === "verified") return `${base} border-green-500 text-green-700`;
    if (s === "failed") return `${base} border-red-500 text-red-700`;
    if (s === "in_progress") return `${base} border-amber-500 text-amber-700`;
    return `${base} border-border text-muted-foreground`;
  };

  const label = (s: Status) =>
    s === "verified" ? "View status" :
    s === "in_progress" ? "Resume" :
    s === "failed" ? "Try again" : "Verify now";

  async function startVerification() {
    setLoading(true);
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to start verification",
          variant: "destructive"
        });
        return;
      }

      if (isDemoMode) {
        // For demo mode, use internal reference check system
        const submissionId = `demo_${Date.now()}`;
        startReferenceCheck(submissionId);
        refreshVerification();
        setLoading(false);
        return;
      }

      // For non-demo mode, use the actual backend
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({
          title: "Authentication required",
          description: "Please sign in first",
          variant: "destructive"
        });
        return;
      }
      
      // Get all profile data and references
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        toast({
          title: "Profile error",
          description: "Unable to fetch profile data. Please ensure your profile is complete.",
          variant: "destructive"
        });
        return;
      }

      const { data: references, error: referencesError } = await supabase
        .from('tenant_references')
        .select('*')
        .eq('tenant_id', user.id);

      if (referencesError) {
        console.error('Error fetching references:', referencesError);
      }
      
      console.log('Submitting reference check with data:', { profileData, references });
      
      const headers = { Authorization: `Bearer ${session.access_token}` };
      
      const { data, error } = await supabase.functions.invoke("process-reference-check", {
        body: {
          profileData: profileData,
          references: references || []
        },
        headers
      });
      
      if (error) {
        console.error("Reference check submission error:", error);
        toast({
          title: "Reference check failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Reference check submitted",
        description: `Your verification will complete in 30 seconds. Submission ID: ${data.submissionId}`,
      });
      
      refreshVerification();
    } catch (e: any) {
      console.error("Reference check submission exception:", e);
      toast({
        title: "Reference check error",
        description: e?.message || String(e),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function runDiagnostics() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
      
      const { data, error } = await supabase.functions.invoke("cc_echo", {
        body: {},
        headers
      });
      setDiagnostics({ data, error });
    } catch (e: any) {
      setDiagnostics({ error: e });
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Identity verification</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isDemoMode ? "Complete your reference check to unlock verified status" : "Confirm your identity to unlock faster decisions."}
            {isDemoMode && status === 'in_progress' && ` (${remainingTime}s remaining)`}
          </p>
        </div>
        <button
          onClick={refreshVerification}
          className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          aria-label="Refresh verification status"
        >
          Refresh status
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className={pillClass(status)} aria-label={`Status: ${status}`}>
          {status === "verified" ? "✅ verified" : status.replace("_", " ")}
        </span>
        <span className="text-xs text-muted-foreground">Updated: {updatedAt}</span>
      </div>

      <div className="mt-4">
        <Button
          id="verify-start"
          data-testid="verify-start"
          onClick={startVerification}
          disabled={loading}
          aria-label="Start identity verification"
          variant="default"
          size="lg"
        >
          {loading ? "Loading..." : label(status)}
        </Button>
        {isDebugMode && (
          <button
            onClick={runDiagnostics}
            className="ml-3 text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          >
            Run diagnostics
          </button>
        )}
      </div>

      {diagnostics && (
        <div className="mt-4">
          <pre className="text-xs bg-muted p-3 rounded overflow-auto">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>
      )}

      {!user && (
        <p className="mt-2 text-xs text-muted-foreground">Sign in to start verification.</p>
      )}
    </div>
  );
}