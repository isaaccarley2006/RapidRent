import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

type Status = "not_started" | "in_progress" | "verified" | "failed" | "needs_attention";

export default function IdentityVerificationCard() {
  const [status, setStatus] = useState<Status>("not_started");
  const [updatedAt, setUpdatedAt] = useState<string>("—");
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const { user } = useAuth();

  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === '1';

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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
      
      const { data, error } = await supabase.functions.invoke("cc_start", {
        body: {},
        // include the token explicitly to avoid any surprises:
        headers
      });
      if (error) {
        console.error("cc_start invoke error:", error);
        alert(error.message);
        return;
      }
      if (data?.redirectUrl) window.open(data.redirectUrl, "_blank", "noopener");
      await loadStatus();
    } catch (e: any) {
      console.error("startVerification exception:", e);
      alert(e?.message || String(e));
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