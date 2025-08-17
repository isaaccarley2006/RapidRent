import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const CC_API_KEY = Deno.env.get("CC_API_KEY");
const CC_CALLBACK_BASE = Deno.env.get("CC_CALLBACK_BASE");

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
    console.log("🚀 cc_start function called");
    
    // Check environment variables first
    if (!SUPABASE_URL || !SERVICE_ROLE || !SUPABASE_ANON_KEY || !CC_API_KEY || !CC_CALLBACK_BASE) {
      console.error("❌ Missing environment variables:", {
        SUPABASE_URL: !!SUPABASE_URL,
        SERVICE_ROLE: !!SERVICE_ROLE,
        SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY,
        CC_API_KEY: !!CC_API_KEY,
        CC_CALLBACK_BASE: !!CC_CALLBACK_BASE,
      });
      return json({ error: "Server configuration error" }, 500);
    }
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("❌ No authorization header");
      return json({ error: "Authorization required" }, 401);
    }

    // Create Supabase client with the user's token
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ User authentication failed:", userError);
      return json({ error: "Authentication failed" }, 401);
    }

    console.log("✅ Authenticated user:", user.id);

    // Create or reuse ComplyCube client
    const clientId = await createOrReuseComplyCubeClient(user.id, user.email!);
    console.log("✅ ComplyCube client ID:", clientId);

    // Create a new ComplyCube session
    const sessionResponse = await fetch("https://api.complycube.com/v1/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId,
        redirectUrl: `${CC_CALLBACK_BASE}/verification-complete`,
      }),
    });

    if (!sessionResponse.ok) {
      const errorText = await sessionResponse.text();
      console.error("❌ ComplyCube session creation failed:", errorText);
      return json({ error: "Failed to create verification session" }, 500);
    }

    const sessionData = await sessionResponse.json();
    console.log("✅ ComplyCube session created:", sessionData.redirectUrl);

    // Store verification status in database
    const admin = createClient(SUPABASE_URL!, SERVICE_ROLE!);
    const { error: insertError } = await admin
      .from("verifications")
      .upsert({
        user_id: user.id,
        provider: "complycube",
        type: "identity_rtr",
        status: "in_progress",
        provider_ref: clientId,
        metadata: { sessionId: sessionData.id },
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("❌ Database insert failed:", insertError);
      return json({ error: "Failed to store verification status" }, 500);
    }

    console.log("✅ Verification status stored in database");

    return json({
      redirectUrl: sessionData.redirectUrl,
      provider_ref: clientId,
    });

  } catch (error) {
    console.error("❌ cc_start error:", error);
    return json({ error: "Internal server error" }, 500);
  }
});

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function createOrReuseComplyCubeClient(externalId: string, email: string): Promise<string> {
  try {
    console.log("🔄 Creating ComplyCube client for:", email);
    
    const response = await fetch("https://api.complycube.com/v1/clients", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CC_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "person",
        email,
        externalId,
      }),
    });

    if (response.ok) {
      const client = await response.json();
      console.log("✅ ComplyCube client created:", client.id);
      return client.id;
    } else {
      const errorData = await response.json();
      console.log("⚠️ Client creation failed, checking if duplicate:", errorData);
      
      // If it's a duplicate, try to use the externalId as clientId
      if (errorData.code === "CLIENT_ALREADY_EXISTS" || response.status === 409) {
        console.log("✅ Using existing client with externalId:", externalId);
        return externalId;
      }
      
      throw new Error(`ComplyCube client creation failed: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error("❌ createOrReuseComplyCubeClient error:", error);
    throw error;
  }
}