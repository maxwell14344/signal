# NorthStack — Editor's Guide

A quick, practical guide to making changes to the site day-to-day. This is the "how do I do X" doc — a fuller reference doc comes later once the project settles.

## The two ways to edit content

There are **two independent paths** to change what's on the live site. They don't sync automatically — pick one per edit, don't mix them for the same change.

### 1. The admin panel (fastest, no code)

Go to `/admin` on the live site, log in, and edit directly. Changes save straight to the database and show up on the live pages within seconds — no deploy needed.

What you can do there today:
- **Tools** — edit every field (pricing, TLDR, scorecard, FAQ, pros/cons, sentiment quotes, verdict, etc.), assign primary/secondary categories via a search-and-tag picker, mark a tool "verified today," create brand-new tools.
- **Categories** — create new categories, edit existing ones.
- **Comparisons** — create a new tool-vs-tool comparison (pick two tools, it builds the slug automatically), edit TLDR/feature matrix/verdict.
- **Alternatives pages** and **Use-case pages** — create new ones, edit intro + entries.
- **Authors** — create new author profiles, edit bio/credentials/links, upload an avatar image.
- **Settings** — change the admin password.

Most of the "detail" fields (TLDR, scorecard, FAQ, pricing plans, pros/cons, sentiment quotes, entries on alternatives/use-case pages) are edited as **raw JSON in a textarea** rather than a fully custom form — this keeps the admin simple to maintain, but it means: keep the brackets/quotes balanced, and if you get an error it's almost always a JSON typo. Copy the existing value out, edit it in a text editor if it's easier, paste it back.

### 2. Git / JSON files (versioned, reviewable)

Every tool, category, comparison, alternatives page, use-case page, and author also has a JSON file under `content/`. This is the git-versioned copy — good for bulk edits, review via pull request, or working with Claude Code directly.

```
content/
  categories.json
  authors/*.json
  tools/*.json
  comparisons/*.json
  alternatives/*.json
  use-cases/*.json
```

Editing these files does **not** change the live site by itself — you have to run an import.

## Syncing between the two

```bash
npm run db:import              # push content/*.json into the live database
npm run db:import -- --dry-run # preview what would change, without writing anything
npm run db:import -- --force=<slug>   # override the staleness guard for one tool

npm run db:export              # snapshot the live database back into content/*.json (local only)
```

- `db:import` **won't silently clobber an admin edit**: if a tool's database row is newer than the JSON file, it skips that tool and warns you. Use `--force=<slug>` if you're sure the JSON should win.
- `db:export` **refuses to run if `content/` has uncommitted git changes** — it doesn't want to overwrite edits you haven't committed yet. Commit or stash first.
- `db:export` only works locally (it needs to write files to disk, which the deployed site can't do). `db:import` works locally or you can trigger it as a button from inside the admin dashboard.

**Rule of thumb:** if you're making one quick tweak, use the admin panel. If you're doing a bulk content pass, adding several tools at once, or want the change reviewable/revertible via git history, edit the JSON and run `db:import`.

## Adding a brand-new tool

Either:
- **Admin panel**: Tools → New tool → fill in slug/name/website/tagline/primary category → Create. You land on the edit page to fill in everything else.
- **JSON**: drop a new file in `content/tools/<slug>.json` matching the shape of an existing tool, then `npm run db:import`.

## Local development

```bash
npm run dev              # start the dev server
vercel env pull .env.local   # refresh local env vars (DB credentials, secrets) from Vercel
```

The database is shared — there's one Neon Postgres instance behind `DATABASE_URL`, used by local dev, preview deployments, and production alike. Be a little careful experimenting locally against `npm run dev`; you're talking to the real data.

## Where things live

- `lib/db/schema.ts` — the Drizzle schema (source of truth for the database shape)
- `lib/db/queries.ts` — read functions every page uses
- `lib/actions/*.ts` — the Server Actions the admin forms call to write data
- `app/admin/(protected)/*` — the admin UI itself
- `app/tools/[slug]`, `app/compare/[slug]`, `app/alternatives/[tool]`, `app/best/[useCase]`, `app/categories/[slug]` — the public page templates

## Admin password

Bootstrapped from an env var on first run, then stored (hashed) in the database — changeable anytime from `/admin/settings` without a redeploy. For a full session wipe (kill any other logged-in session), rotate `AUTH_SECRET` in the Vercel dashboard's environment variables.
