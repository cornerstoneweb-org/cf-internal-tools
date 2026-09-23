# Conventions

## Buy vs build, per tool

Cornerstone already pays for Microsoft 365, SharePoint, Forms, Lists and
Power Automate, with SSO in place. Before building a tool here, answer this
honestly:

1. Can Forms plus a List plus a Power Automate flow do this?
2. If yes, is there a specific reason a custom build is better? A real
   dashboard or aggregation view, a workflow Power Automate handles badly,
   or a deliberate decision to keep building the skill.
3. If no clear reason, use Microsoft's stack and write down why here.

Staff Hub is the clearest custom case so far: it aggregates, and Microsoft
handles that badly. Facilities and IT intake are the least clear.

## Free phase rule, until the leadership demo lands

Placeholder data only. No real staff names, emails, phone numbers, extensions
or submissions in any file in this repo, including files that are not yet
committed.

GitHub Pages stays off. The site runs locally with `node scripts/serve.mjs`
for building and for demoing.

The reason: a public Pages site cannot be un-published, and anything committed
to git stays in history even after the file is deleted. Both are permanent in
a way that upgrading a plan later does not undo.

This rule lifts when hosting and auth are decided, not before.

## Code

- Copy and labels go in `config.js`, never hardcoded in `app.js`.
- New section or dataset should be a data or config change, not a code change.
- Feature flags default to `false`. A tool is invisible until it is ready.
- Absolute paths from the repo root (`/shared/...`) so local and Pages match.
- Secrets never enter this repo. Service role keys never enter this repo.

## Database

- RLS enabled on every table holding real data. No exceptions.
- A policy is not finished until it has been tested by querying as each role
  and confirming the wrong role gets nothing back.
- Migrations are numbered and append-only.

## Verification before calling a change done

Serve the site locally, drive it with a headless browser at desktop and phone
widths, check real DOM state and console errors. This catches what code
review misses.

## Publishing

Claude edits files and leaves them uncommitted. Ryan reviews the diff in
GitHub Desktop and pushes. Database changes go directly through the Supabase
MCP connector.

## Writing

No em dashes.
