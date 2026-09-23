# Deploy

## Hosting

GitHub Pages from the repo root of the `main` branch. `.nojekyll` is present
so directories and files Jekyll would skip are served as-is.

URL shape once live:

```
<org>.github.io/cf-internal-tools/                  home
<org>.github.io/cf-internal-tools/tools/staff-hub/  Staff Hub
```

A custom domain (for example `tools.cornerstonefellowship.org`) makes the
absolute paths cleaner and is worth doing before wide rollout.

## Important: a Pages site is public

Checked September 2026: GitHub Pages serves publicly from a private repo on
both Free and Team. Publishing a Pages site privately requires GitHub
Enterprise Cloud. Team, including the free nonprofit Team plan, does not
unlock it.

So on Pages there is no middle ground. The site is public.

That is workable only if everything sensitive comes from Supabase behind auth
and RLS, and nothing sensitive sits in committed JSON. Before enabling a
tool, confirm what is in `tools/<tool>/data/` could be posted on a bulletin
board without harm.

If Staff Hub content cannot meet that bar, hosting moves off Pages to
something that can gate the whole site. Candidates not yet priced:

- Azure Static Web Apps. Restricting sign-in to CF's Entra tenant requires
  custom authentication, which is Standard plan only, not Free. Natural fit
  since CF already runs M365.
- Cloudflare Pages with Cloudflare Access in front, using Entra as the
  identity provider. Free tier user limits not yet confirmed.

Decide alongside docs/auth.md. These are the same decision wearing two hats.

## Steps

1. Create the Cornerstone GitHub organization.
2. Create `cf-internal-tools` under the org.
3. Push from GitHub Desktop.
4. Settings, Pages, deploy from `main`, root.
5. Flip a tool's `enabled` flag in `config/site.config.js` when it is ready.
