import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
      alert("Please sign in to start verification."); 
      return; 
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("cc_start", { body: {} });
      if (error) throw error;
      if (data?.redirectUrl) window.open(data.redirectUrl, "_blank", "noopener");
      await loadStatus();
    } catch (e) {
      console.error(e);
      alert("Could not start verification. Please try again.");
    } finally {
      setLoading(false);
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
        <button
          id="verify-start"
          data-testid="verify-start"
          onClick={startVerification}
          disabled={loading}
          aria-label="Start identity verification"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          {loading ? "Loading..." : label(status)}
        </button>
      </div>

      {!user && (
        <p className="mt-2 text-xs text-muted-foreground">Sign in to start verification.</p>
      )}
    </div>
  );
}