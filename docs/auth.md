# Auth: open decision

Status: deliberately deferred, September 2026. Build on free accounts with
placeholder data, demo locally, decide this only if a tool needs to go live
with real data.

Nothing in the code changes when the decision lands. Row Level Security and
the auth module work identically on Supabase Free and Pro. What the paid
plans buy is a database that does not pause, backups, and SAML SSO.

## The requirement

- Staff sign in once and can see the status of their own requests.
- Joe sees facilities requests. Dennis sees IT requests. Bou sees HR items.
  None of them sees the others' by default.
- Staff Hub content is staff-only by definition.
- Ryan needs an admin view across everything.

The personal build's insert-only, no-login model does not work for any of
this. Do not reach for it here.

## Candidates

### A. Microsoft Entra ID (M365) as the identity provider
Staff already have these accounts. No new password, no new account
provisioning, and offboarding is already handled by whatever happens when IT
disables an account. Requires Supabase's paid tier for SAML/OIDC SSO, or
doing the OIDC handshake independently and exchanging for a Supabase session.

Question to resolve: does CF's tenant allow registering an app for this, and
who approves it.

### B. Supabase Auth with magic links to the cornerstone domain
Simpler to stand up, no tenant coordination. But it is a second identity
system to maintain, and offboarding becomes a manual step someone has to
remember.

### C. Skip custom auth entirely for intake tools
Microsoft Forms plus a Power Automate flow plus a SharePoint list already
has SSO, permissions, and status. For facilities and IT intake specifically,
this may be the honest answer. See docs/conventions.md.

## Recommendation to work through

Entra ID, because the identity already exists and offboarding is already
solved. The cost is coordination, not money. Worth confirming before
committing to the paid Supabase tier.

## Roles

Roles live in a `user_roles` table in Postgres, read server-side by RLS
policies. The client may read roles to show and hide UI. The client never
enforces anything.

Defined roles: see `ROLES` in config/site.config.js. Keep that list and the
database in sync.
