// Single Supabase client for every tool. Import from here, never construct
// a second client.
import { ENV } from "./env.js";

let client = null;

export async function getClient() {
  if (client) return client;
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
  client = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_PUBLISHABLE_KEY);
  return client;
}
