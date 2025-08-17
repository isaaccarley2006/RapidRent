import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const CC_API_KEY = Deno.env.get("CC_API_KEY")!;
const CC_CALLBACK_BASE = Deno.env.get("CC_CALLBACK_BASE")!;

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
    console.log("🔍 cc_echo diagnostics function called");
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      headers: {
        authorization: authHeader ? "✅ Present" : "❌ Missing",
        userAgent: req.headers.get('User-Agent') || "Not provided",
      },
      environment: {
        supabaseUrl: SUPABASE_URL ? "✅ Set" : "❌ Missing",
        ccApiKey: CC_API_KEY ? "✅ Set" : "❌ Missing",
        ccCallbackBase: CC_CALLBACK_BASE ? "✅ Set" : "❌ Missing",
      },
      auth: null as any,
      complyCubeTest: null as any,
    };

    // Test Supabase authentication
    if (authHeader) {
      try {
        const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
          global: {
            headers: { Authorization: authHeader },
          },
        });

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          diagnostics.auth = { status: "❌ Failed", error: userError.message };
        } else if (user) {
          diagnostics.auth = { 
            status: "✅ Success", 
            userId: user.id, 
            email: user.email 
          };
        } else {
          diagnostics.auth = { status: "❌ No user found" };
        }
      } catch (authError) {
        diagnostics.auth = { status: "❌ Exception", error: String(authError) };
      }
    } else {
      diagnostics.auth = { status: "❌ No auth header" };
    }

    // Test ComplyCube API connectivity
    if (CC_API_KEY) {
      try {
        const ccResponse = await fetch("https://api.complycube.com/v1/clients?limit=1", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${CC_API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (ccResponse.ok) {
          diagnostics.complyCubeTest = { 
            status: "✅ API connectivity successful",
            statusCode: ccResponse.status 
          };
        } else {
          const errorText = await ccResponse.text();
          diagnostics.complyCubeTest = { 
            status: "❌ API call failed",
            statusCode: ccResponse.status,
            error: errorText.substring(0, 200) // Truncate for safety
          };
        }
      } catch (ccError) {
        diagnostics.complyCubeTest = { 
          status: "❌ API connection exception", 
          error: String(ccError) 
        };
      }
    } else {
      diagnostics.complyCubeTest = { status: "❌ No API key configured" };
    }

    console.log("✅ Diagnostics completed:", JSON.stringify(diagnostics, null, 2));

    return new Response(JSON.stringify(diagnostics, null, 2), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ cc_echo error:", error);
    
    const errorDiagnostics = {
      timestamp: new Date().toISOString(),
      status: "❌ Function error",
      error: String(error),
    };

    return new Response(JSON.stringify(errorDiagnostics, null, 2), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});