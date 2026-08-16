# Signal — Architecture Reference

**Purpose of this file**: a single document a fresh Claude session (or anyone) can read to fully understand this project without exploring the repo first. If you're picking this project back up with no prior context, read this file top to bottom before touching anything — it tells you what exists, where it lives, and what's already been decided so you don't redo work or re-litigate settled decisions.

For a human editor's "how do I do X" guide, see [DOCS.md](DOCS.md) instead — this file is the technical/architectural map.

---

## 1. What this is

**Signal** is a niche content site reviewing **AI customer support tools** — chatbots, AI support agents, WhatsApp/messaging AI, helpdesk automation, CX analytics, etc. It is not a generic AI-tool directory; it's deliberately narrow.

Owner/author: **Maxwell Timothy** — a real content marketing expert (6+ years covering AI, published on MakeUseOf/MSN/Flipboard/Make Tech Easier/NewsBreak, authored a ChatGPT eBook used in university coursework). He works in **Growth and Marketing at Heyy** (not founder) and has **previously written contributed content for Chatbase and Crisp**. All three of those tools are reviewed on this site — this is a disclosed, real conflict of interest, not hypothetical. See `/methodology` and the author bio for the exact disclosure language. **Never re-introduce a "founder of Heyy" claim** — that was a mistaken assumption made early in this project and explicitly corrected by the user. If Heyy, Chatbase, or Crisp content is ever regenerated, the disclosure must be preserved.

Content model — **spine / joint / skin**:
- **Spine**: `/categories` — a fixed taxonomy every tool hangs off of. Each category is a pillar page.
- **Joint**: internal-linking, citation-winning pages — tool-vs-tool comparisons (`/compare/[slug]`), alternatives pages (`/alternatives/[tool]`), use-case pages (`/best/[useCase]`).
- **Skin**: individual tool profile pages (`/tools/[slug]`) — the actual conversion/citation surface. TLDR, pricing, channels, features, company info, a proprietary 5-dimension scorecard, FAQ (schema.org marked up), a human-voiced verdict, author byline + "last verified" date.

**Non-negotiable content standard**: nothing on this site is fabricated. Pricing, features, and sentiment quotes are sourced from official pricing pages, vendor docs, or real reviews (G2, Capterra, Trustpilot, Reddit, HN) with real URLs. Where something isn't publicly documented, the content says so explicitly rather than guessing. Uphold this standard for any new content.

---

## 2. Repo, branches, deployment

- **GitHub**: `maxwell14344/signal` (this was originally attempted under `timothymaxwell149/signal` but pushed to `maxwell14344` instead after an auth mismatch — `maxwell14344` is the account actually in use).
- **Local path**: `C:\Users\cute\Desktop\ai-tool-reviews`
- **Branches**:
  - `master` — production. This is what Vercel deploys to the production URL.
  - `signal-v1` — a frozen backup of the *original, unrelated* generic-AI-tool-directory version of this project (pre-pivot). Do not touch; it's a deliberate snapshot.
  - `signal-v2` — **the active development branch for the current site** (the AI customer support pivot described in this whole document). Work happens here, then gets pushed to `master` when ready to go live.
- **Vercel project**: `ai-tool-reviews` under team/scope `maxwell-1980s-projects`. Connected via GitHub integration — pushes to any branch trigger a deployment (production branch = `master`, everything else = preview).
- **Vercel CLI auth**: already linked locally (`vercel` CLI works in the project directory without re-linking).

To deploy a change: commit → push the branch → if it's meant to go live, merge into `master` and push `master` too (production only updates from `master`).

---

## 3. Tech stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**, **Tailwind CSS v4**
- **Database**: Neon Postgres (provisioned via Vercel's storage marketplace integration), accessed through **Drizzle ORM** using the **connectionless HTTP driver** (`@neondatabase/serverless` + `drizzle-orm/neon-http`) — deliberately chosen to avoid serverless connection-pool exhaustion; never swap to a `pg`/`Pool`-based driver without understanding why this choice was made.
- **File storage**: Vercel Blob, public store named `signal-media`, used for author avatars (and available for any future image uploads).
- **Auth**: `bcryptjs` (password hashing) + `jose` (JWT signing/verification) — hand-rolled, not a library like NextAuth. See §6.
- **Icons**: `lucide-react`
- **Fonts**: Inter (body) + Onest (headings) — Onest is the free-license stand-in for Seline's paid "Roobert" font.

---

## 4. Data layer — the two editing paths

There are **two independent ways to change content**, by design, per explicit user request. They do not sync automatically.

1. **Admin panel** (`/admin`) — writes directly to Postgres via Server Actions. Live instantly, no redeploy.
2. **Git-versioned JSON** under `content/` — edited by hand or by Claude Code, synced to the DB via scripts.

```
content/
  categories.json
  authors/*.json
  tools/*.json
  comparisons/*.json
  alternatives/*.json
  use-cases/*.json
```

Sync scripts (`lib/db/scripts/`):
- `npm run db:seed` — bootstraps the admin password (from `ADMIN_INITIAL_PASSWORD` env var) and seeds `content/authors/*.json`. Safe to re-run.
- `npm run db:import` — pushes `content/*.json` → database. Upserts by slug. Has a **staleness guard**: skips a tool if its DB row is newer than the JSON (prints a warning), overridable with `--force=<slug>` or `--force` for all. Supports `--dry-run`.
- `npm run db:export` — snapshots database → `content/*.json`. **Local-only** (needs filesystem write access Vercel's production runtime doesn't have). Refuses to run if `content/` has uncommitted git changes, to avoid clobbering in-progress edits.

**Runtime always reads from the database, never from JSON directly.** JSON is purely a git-versioned seed/backup format. `lib/db/queries.ts` is the single source of read functions every page uses.

Import order matters (categories → tools → comparisons → alternatives → use-cases) because later types reference tools by slug — `lib/db/scripts/import.ts` already handles this correctly; don't reorder without checking dependencies.

---

## 5. Database schema (`lib/db/schema.ts`)

Tables: `authors`, `categories`, `tools`, `tool_categories` (many-to-many, `is_primary` flag distinguishes primary from secondary category), `comparisons` (tool A vs tool B, unique on the pair, canonical-slug pattern — see §7), `alternative_pages` + `alternative_entries`, `use_case_pages` + `use_case_tool_entries`, `settings` (key/value — currently just holds `admin_password_hash`), `content_revisions` (audit log table, defined but not actively written to yet — available if revision history becomes a priority).

Every content table carries: `status` (draft/published — public queries filter to `published` only), `authorId`, `lastVerifiedAt` (an **explicit**, manually-triggered "I re-checked this" timestamp — never auto-bumped on every edit, that would defeat its purpose as a freshness/trust signal), `version` (auto-incremented on save).

`tools.rating` is `numeric(2,1)` — supports 1.0–9.9 in 0.1 increments. The admin form clamps it to 1.0–5.0 with `step={0.1}` and server-side validation in `lib/actions/tools.ts`.

Complex fields (`tldr`, `channels`, `keyFeatures`, `companyInfo`, `faq`, `scorecard`, `pricingPlans`, `pros`, `cons`, `sentimentQuotes`, `bestFor`, and `entries` on alternatives/use-case pages) are stored as `jsonb` and edited in the admin as **raw JSON in a textarea**, not custom field-by-field forms. This was a deliberate scope/time trade-off, not an oversight — if it becomes painful, building proper structured editors for these is the natural next step (nothing architecturally blocks it).

**Scorecard rubric** (used identically across all tools, documented on `/methodology`): Ease of Setup, AI Quality, Omnichannel Support, Pricing Value, Vendor Support Quality — each scored 1–5 with a justifying note.

---

## 6. Admin panel (`/admin`)

- **Auth**: single admin account (no multi-user roles). Password bootstrapped from `ADMIN_INITIAL_PASSWORD` env var into a bcrypt hash in the `settings` table on first `db:seed` run — changeable anytime from `/admin/settings` without a redeploy (updates the DB hash directly).
- **Session**: `jose`-signed JWT in an httpOnly cookie (`admin_session`, 7-day expiry). `middleware.ts` (Edge runtime) verifies the JWT signature/expiry only — **never put bcrypt in middleware**, it's Node-only and will break on Edge.
- **Full session revocation**: rotating `AUTH_SECRET` in Vercel's env vars invalidates every existing signed cookie instantly. This is the "kill all sessions" mechanism — there's no per-session DB revocation list.
- **Route structure**: `app/admin/login/page.tsx` is unprotected. Everything else lives under `app/admin/(protected)/` (a route group — doesn't affect URLs, just keeps the authenticated sidebar layout from wrapping the login page).
- **CRUD coverage**: Tools, Categories, Comparisons, Alternatives pages, Use-case pages, and Authors all have full create + list + edit from the admin. Tool editing includes a searchable tag-style picker (`components/admin/CategoryPicker.tsx`) for primary + secondary category assignment.
- **Known UI gotcha (fixed)**: search/autocomplete dropdowns (`SearchBox`, `CategoryPicker`, `ToolPicker`) originally used an `onBlur` + `setTimeout` hack to close on outside-click, which raced against the click on a result and made selection unreliable. Fixed by adding `onMouseDown={(e) => e.preventDefault()}` on the results container, which stops the input from blurring at all when clicking a result — the standard, robust fix for this exact pattern. If you build another autocomplete/combobox component, use this pattern from the start.
- **Note the site's public Navbar/Footer still wrap `/admin` pages** — there was no time to split them into a separate layout via route groups. Cosmetically odd but not broken. Worth fixing if there's ever a slow afternoon.

---

## 7. Routes

```
app/
  page.tsx                                    # home: Hero, Trending, Categories, Buying-guides section, All Tools
  categories/{page.tsx, [slug]/page.tsx}       # spine
  tools/[slug]/page.tsx                        # skin
  compare/[comparisonSlug]/page.tsx            # joint: canonical slug is "<toolA>-vs-<toolB>";
                                                #   requesting the reversed order redirects to canonical
  alternatives/[toolSlug]/page.tsx             # joint: slug pattern "<tool>-alternatives"
  best/[useCaseSlug]/page.tsx                  # joint: e.g. "shopify", "saas", "whatsapp-business"
  methodology/page.tsx                         # EEAT: scoring rubric + conflict-of-interest disclosure
  authors/[slug]/page.tsx                      # author bio + everything they've reviewed
  admin/...                                    # see §6
  sitemap.ts / robots.ts / llms.txt/route.ts   # all generated live from the DB, not static files
```

All dynamic routes use `generateStaticParams` (build-time pre-render of published content) + `dynamicParams = true` (so admin-created content renders on first request without a redeploy).

---

## 8. Design system

Warm, editorial aesthetic modeled on **seline.com** (specifically its blog post layout) — a deliberate departure from generic dark-SaaS styling.
- Palette: Tailwind "stone" warm-neutral scale. Page bg `#FAFAF9`, cards `#FFFFFF`, borders `stone-300 @ ~50%`, headings `#0C0A09`, body text `#44403C`, muted `#78716C`. Accent: amber (`#D97706`).
- Fonts: Inter (body) + Onest (headings, weight 400–500 — restrained, not bold).
- Tokens live in `app/globals.css` as CSS custom properties (`--background`, `--surface`, `--accent`, etc.) mapped through Tailwind v4's `@theme inline` — most retheming is a token-value change, not a component rewrite.
- Cards: `rounded-lg`/`rounded-xl`, 1px border, subtle shadow (`.card-shadow` utility class).
- Long-form entry text (alternatives/use-case blurbs) is auto-split into paragraphs with the final "recommendation" sentence pulled into a visually distinct accent-tinted callout — see `components/EntryBody.tsx` + `lib/text.ts`. Apply this same component anywhere else dense practitioner-voiced text needs breaking up.

---

## 9. Current content inventory (as of last update)

- **9 tools**: Chatbase, Crisp, Intercom, Zendesk, ManyChat, Heyy, Tidio, SiteGPT, Wonderchat
- **12 categories** (4 have 0 tools currently — intentional placeholders for future growth): AI Chatbots, AI Support Agents, Live Chat & Shared Inbox, Helpdesk & Ticketing Automation, WhatsApp & Social Messaging AI, Knowledge Base & AI Self-Service, Conversational Commerce, AI Voice Agents (empty), AI Email Support (empty), CX Analytics & QA (empty), Agent Assist/Copilot (empty), Contact Center AI/CCaaS (empty)
- **3 comparisons**: Intercom vs Zendesk, Crisp vs Intercom, Heyy vs Intercom
- **5 alternatives pages**: Intercom, Zendesk, Crisp, ManyChat, Tidio alternatives
- **3 use-case pages**: Shopify, SaaS, WhatsApp Business
- **1 author**: Maxwell Timothy

This is a young, deliberately small seed set meant to grow — the architecture (taxonomy with empty placeholder categories, reusable joint-page templates) is built to scale up without restructuring.

---

## 10. Environment variables (set in Vercel dashboard, pulled locally via `vercel env pull .env.local`)

- `DATABASE_URL` (+ related `POSTGRES_*`/`PG*` vars, auto-injected by the Neon integration)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
- `AUTH_SECRET` — JWT signing secret; rotating it kills all admin sessions
- `ADMIN_INITIAL_PASSWORD` — bootstrap-only, read once by `db:seed`; the live password lives in the DB after that
- `NEXT_PUBLIC_SITE_URL` — used by `lib/jsonld.ts`, `sitemap.ts`, `llms.txt` for absolute URLs; **update this if the production domain changes**

Never commit real values for these — the repo is public.

---

## 11. Where to look for what

| Need to... | Look at |
|---|---|
| Understand/change the DB shape | `lib/db/schema.ts` |
| Add a new read query | `lib/db/queries.ts` |
| Add/change an admin write action | `lib/actions/*.ts` |
| Change how a public page looks | `app/<route>/page.tsx` + the components it imports |
| Change the visual design system | `app/globals.css` |
| Understand auth | `lib/auth.ts` (Edge-safe JWT bits), `lib/auth-admin.ts` (Node-only bcrypt/DB bits) |
| Bulk-edit content | `content/*.json` + `npm run db:import` |
| Onboard a fresh Claude session | this file, then `DOCS.md` for the human-editor angle |

---

## 12. Explicit decisions worth not re-litigating

- Flat JSON + DB hybrid was chosen over a headless CMS, specifically so both git-based and admin-panel editing could coexist as **genuinely independent** paths (user's explicit requirement), not because a CMS wasn't considered.
- `neon-http` (connectionless) over `pg`/pooled — serverless connection exhaustion is a real, known failure mode this sidesteps.
- Raw-JSON textareas for complex admin fields over fully custom per-field forms — a conscious scope cut given time constraints, not a design ideal. Revisit if it becomes a real workflow pain point.
- The public Navbar/Footer wrapping `/admin` pages is a known cosmetic gap, not a bug to "fix" by surprise — mention it if touching admin layout, but it wasn't asked for as a priority.
- Heyy/Chatbase/Crisp conflict-of-interest disclosure is load-bearing for this site's credibility — treat any change to author identity, employment, or past work relationships as something to get right via real research (WebSearch), never assumption.
