// Auth for every tool: Sign in with Microsoft (Entra, CF tenant only)
// through Supabase Auth. See docs/auth.md.
//
// This file only decides what to SHOW. It is not the lock. The lock is Row
// Level Security in the database (db/policies/): a browser that skips all of
// this still gets nothing back.

import { getClient } from "./supabase.js";

export const STAFF_DOMAIN = "cornerstoneweb.org";

// Resolves once any sign-in redirect (?code=...) has been processed.
export async function getSession() {
  const supabase = await getClient();
  const { data } = await supabase.auth.getSession();
  // Tidy the address bar after the Microsoft round trip.
  if (new URLSearchParams(location.search).has("code")) {
    history.replaceState(null, "", location.pathname + location.hash);
  }
  return data.session ?? null;
}

export function isStaff(session) {
  const email = session?.user?.email?.toLowerCase() ?? "";
  return email.endsWith("@" + STAFF_DOMAIN);
}

export function displayName(session) {
  const m = session?.user?.user_metadata ?? {};
  return m.full_name || m.name || session?.user?.email || "Signed in";
}

export async function signIn() {
  const supabase = await getClient();
  await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      scopes: "email",
      // Come back to this exact page. Must match a Redirect URL in Supabase.
      redirectTo: location.origin + location.pathname,
    },
  });
}

export async function signOut() {
  const supabase = await getClient();
  await supabase.auth.signOut();
  location.replace(location.pathname);
}

// Reads that go through RLS. Returns [] on any error so a page never breaks
// because the database said no.
export async function selectAll(table, orderBy) {
  const supabase = await getClient();
  let q = supabase.from(table).select("*");
  if (orderBy) q = q.order(orderBy);
  const { data, error } = await q;
  if (error) { console.warn(`[auth] ${table}:`, error.message); return []; }
  return data ?? [];
}
