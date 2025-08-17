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
    const authHeader = req.headers.get("Authorization") ?? "";
    console.log("=== CC_VERIFY NEW FUNCTION (JWT DISABLED) ===");
    console.log("FRESH DEPLOYMENT:", new Date().toISOString());
    console.log("Auth header exists:", !!authHeader);
    console.log("CC_API_KEY exists:", !!CC_API_KEY);
    console.log("CC_API_KEY length:", CC_API_KEY?.length || 0);
    
    // Manual authentication check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid auth header - returning 401");
      return json({ 
        error: "Authentication required", 
        details: "Missing or invalid Authorization header"
      }, 401);
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: auth, error: authErr } = await supabase.auth.getUser();
    console.log("Manual auth check - User exists:", !!auth?.user);
    console.log("Manual auth check - User ID:", auth?.user?.id);
    
    if (authErr || !auth?.user) {
      console.log("Manual authentication failed - returning 401");
      return json({ 
        error: "Authentication failed", 
        details: authErr?.message || "No user found"
      }, 401);
    }
    
    const user = auth.user;
    const email = user.email ?? `${user.id}@example.invalid`;

    const client = await createOrReuseComplyCubeClient(user.id, email);

    console.log("=== COMPLYCUBE API CALL ===");
    console.log("Client ID:", client.id);
    console.log("Making API request to ComplyCube...");

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
        details: errorDetails
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
      metadata: { createdFrom: "cc_verify" },
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,type" });

    console.log("SUCCESS: Returning redirect URL");
    return json({ redirectUrl, provider_ref });
  } catch (e) {
    console.log("ERROR:", String(e));
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