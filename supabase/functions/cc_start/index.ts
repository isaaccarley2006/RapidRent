import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const CC_API_KEY = Deno.env.get("CC_API_KEY")!;
const CC_BASE = "https://api.complycube.com/v1";
const CC_CALLBACK_BASE = Deno.env.get("CC_CALLBACK_BASE") ?? "https://rentview.co.uk";

type J = Record<string, unknown>;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    console.log("=== CC_START SIMPLIFIED AUTH ===");
    console.log("DEPLOYMENT MARKER: SIMPLIFIED_2025_08_17_13_15");
    console.log("Function deployment time:", new Date().toISOString());
    console.log("CC_API_KEY exists:", !!CC_API_KEY);
    
    const authHeader = req.headers.get("Authorization") ?? "";
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      console.log("[cc_start] authHeaderPresent:", Boolean(authHeader), "length:", authHeader.length);
      return new Response(JSON.stringify({
        error: "Unauthenticated",
        hint: "Missing/invalid Bearer token"
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
    const user = auth.user;
    const email = user.email ?? `${user.id}@example.invalid`;

    const client = await createOrReuseComplyCubeClient(user.id, email);

    console.log("=== COMPLYCUBE API CALL ===");
    console.log("API Key exists:", !!CC_API_KEY);
    console.log("API Key starts with 'test_':", CC_API_KEY?.startsWith('test_'));
    console.log("Client ID:", client.id);
    console.log("Callback base:", CC_CALLBACK_BASE);

    const res = await fetch(`${CC_BASE}/flow/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: client.id,
        checkTypes: ["identity_check", "document_check"],
        successUrl: `${CC_CALLBACK_BASE}/renter/verification?result=success`,
        cancelUrl: `${CC_CALLBACK_BASE}/renter/verification?result=cancel`,
        language: "en",
        theme: "light"
      }),
    });

    console.log("ComplyCube API response status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.log("ComplyCube API error response:", errorText);
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }
      
      return json({ 
        error: "ComplyCube session error", 
        status: res.status,
        details: errorDetails,
        apiKeyType: CC_API_KEY?.startsWith('test_') ? 'test' : 'live'
      }, res.status);
    }

    const data = await res.json();
    const redirectUrl = data.redirectUrl as string;
    const provider_ref = client.id as string;

    await supabase.from("verifications").upsert({
      user_id: user.id,
      type: "identity_rtr",
      provider: "complycube",
      status: "in_progress",
      provider_ref,
      metadata: { createdFrom: "cc_start" },
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,type" });

    return json({ redirectUrl, provider_ref });
  } catch (e) {
    return json({ error: "Server error", details: String(e) }, 500);
  }
});

function json(obj: J, status = 200) {
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: { 
      ...corsHeaders,
      "Content-Type": "application/json" 
    } 
  });
}

async function createOrReuseComplyCubeClient(externalId: string, email: string) {
  const res = await fetch("https://api.complycube.com/v1/clients", {
    method: "POST",
    headers: { Authorization: `Bearer ${CC_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "person", email, externalId, personDetails: { firstName: "RentView", lastName: "User" } }),
  });
  if (res.ok) return await res.json();
  return { id: externalId }; // sandbox fallback for duplicates
}