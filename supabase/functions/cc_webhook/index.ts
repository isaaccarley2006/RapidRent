import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  try {
    const raw = await req.text();
    const signature = req.headers.get("ComplyCube-Signature") ?? "";

    // TODO: replace with HMAC check using CC_WEBHOOK_SECRET when you go Live
    const valid = await verifySignature(raw, signature);
    if (!valid) {
      // return new Response("invalid signature", { status: 401 });
    }

    const event = JSON.parse(raw);

    // Admin client (bypasses RLS so the webhook can update rows)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // 1) Log the payload for debugging
    await admin.from("webhook_events").insert({
      provider: "complycube",
      event_type: event?.type ?? "unknown",
      payload: event
    });

    // 2) Update verification status by ComplyCube client id
    const clientId = event?.data?.clientId ?? event?.clientId ?? null;
    if (clientId) {
      const approved =
        event?.data?.result === "approved" ||
        event?.data?.status === "approved" ||
        event?.status === "completed";

      const status = approved ? "verified" : "failed";

      await admin
        .from("verifications")
        .update({ status, metadata: event, updated_at: new Date().toISOString() })
        .eq("provider", "complycube")
        .eq("provider_ref", String(clientId));
    }

    return new Response("ok");
  } catch (e) {
    return new Response("error", { status: 500 });
  }
});

async function verifySignature(_payload: string, _sig: string) {
  // Test Mode: accept; when going Live, verify HMAC with CC_WEBHOOK_SECRET
  return true;
}