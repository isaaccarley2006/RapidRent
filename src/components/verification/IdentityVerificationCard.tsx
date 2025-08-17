import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

type Status = "not_started" | "in_progress" | "verified" | "failed" | "needs_attention";

export default function IdentityVerificationCard() {
  const [status, setStatus] = useState<Status>("not_started");
  const [updatedAt, setUpdatedAt] = useState<string>("—");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function loadStatus() {
    if (!user?.id) { 
      setStatus("not_started"); 
      setUpdatedAt("—"); 
      return; 
    }

    const { data } = await supabase
      .from("verifications")
      .select("status,updated_at")
      .eq("user_id", user.id)
      .eq("type", "identity_rtr")
      .maybeSingle();

    setStatus((data?.status as Status) ?? "not_started");
    setUpdatedAt(data?.updated_at ? new Date(data.updated_at).toLocaleString() : "—");
  }

  useEffect(() => { 
    loadStatus(); 
  }, [user]);

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
    if (!user) {
      console.log("No user found, cannot start verification")
      alert("Please sign in to start verification.")
      return
    }
    
    console.log("=== VERIFICATION START DEBUG ===")
    console.log("User ID:", user.id)
    console.log("User email:", user.email)
    
    // Get fresh session before making the call
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    console.log("Session exists:", !!sessionData.session)
    console.log("Session error:", sessionError)
    console.log("Access token exists:", !!sessionData.session?.access_token)
    
    setLoading(true)
    try {
      console.log("Calling cc_start function...")
      const { data, error } = await supabase.functions.invoke("cc_start", { body: {} })
      
      console.log("Function response:", { data, error })
      
      if (error) {
        console.error('Verification error details:', error)
        alert(`Verification failed: ${JSON.stringify(error, null, 2)}`)
        return
      }
      
      if (data?.redirectUrl) {
        console.log("Redirecting to:", data.redirectUrl)
        window.open(data.redirectUrl, "_blank", "noopener")
      } else {
        console.error("No redirect URL received:", data)
        alert("No redirect URL received from verification service")
      }
      
      await loadStatus()
    } catch (e) {
      console.error('Unexpected error:', e)
      alert(`Unexpected error: ${e.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Identity verification</h2>
          <p className="mt-1 text-sm text-muted-foreground">Confirm your identity to unlock faster decisions.</p>
        </div>
        <button
          onClick={loadStatus}
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
      </div>

      {!user && (
        <p className="mt-2 text-xs text-muted-foreground">Sign in to start verification.</p>
      )}
    </div>
  );
}