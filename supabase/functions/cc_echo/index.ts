import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const j = (obj: any, status = 200) =>
  new Response(JSON.stringify(obj, null, 2), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: auth } = await supabase.auth.getUser();
  return j({
    echo: {
      hasAuthorizationHeader: Boolean(authHeader),
      authHeaderPrefix: authHeader.slice(0, 7), // e.g. "Bearer "
      authHeaderLength: authHeader.length
    },
    user: {
      signedIn: Boolean(auth?.user),
      id: auth?.user?.id ?? null,
      email: auth?.user?.email ?? null
    }
  });
});