// Auth for every tool. One module, one place to change when the identity
// decision lands. See docs/auth.md — this is NOT resolved yet.
//
// Everything below is a placeholder shape, not a working implementation.
// Do not ship a tool that reads real data against this file as written.

import { getClient } from "./supabase.js";

export async function getSession() {
  const supabase = await getClient();
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function requireStaff() {
  const session = await getSession();
  if (!session) {
    window.location.href = "/login.html?next=" + encodeURIComponent(location.pathname);
    return null;
  }
  return session;
}

// Roles come from the database, not from the client. A role read here is for
// showing and hiding UI only. RLS is what actually enforces access.
export async function getRoles() {
  const supabase = await getClient();
  const { data, error } = await supabase.from("user_roles").select("role");
  if (error) return [];
  return data.map((r) => r.role);
}

export async function signOut() {
  const supabase = await getClient();
  await supabase.auth.signOut();
  window.location.href = "/";
}
