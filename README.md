# Signal — AI Tool Reviews

Structured, AI-citable reviews of AI tools: pricing, pros/cons, and real sentiment sourced from Reddit, X, and Hacker News.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a new tool (the whole point of this architecture)

Every tool is one JSON file at `content/tools/<slug>.json`, matching the `Tool` type in [`lib/schema.ts`](lib/schema.ts). Drop in a new file and the tool automatically appears on the homepage, its category page, the sitemap, and `/llms.txt` — no other code changes needed.

Minimum you need per tool:
- `slug`, `name`, `website`, `category` (must match a slug in `content/categories.json`)
- `tagline`, `tldr` (3-6 bullets — this is what gets surfaced to AI agents/crawlers)
- `pricing.startingPrice` + `pricing.plans[]`
- `pros` / `cons`
- `sentiment[]` — **only include quotes you can verify are real**, each with its actual source URL. Don't fabricate quotes; better to have fewer, real ones.
- `bestFor`, `hotTake`, `trending`, `rating`, `dateAdded`, `lastUpdated`

Adding a new category: append an entry to `content/categories.json`.

## Where things live

- `content/tools/*.json` — the single source of truth for every tool
- `content/categories.json` — category definitions
- `lib/tools.ts` — data loaders (`getAllTools`, `getToolBySlug`, `getTrendingTools`, etc.)
- `lib/jsonld.ts` — generates `Product`/`Offer` schema.org JSON-LD per tool page
- `app/llms.txt/route.ts` — auto-generated AI-citability index at `/llms.txt`
- `app/sitemap.ts` / `app/robots.ts` — auto-generated from content, no manual updates needed

## Deploying

Recommended: [Vercel](https://vercel.com/new) — zero-config for Next.js. Before going live, update `SITE_URL` in `lib/jsonld.ts`, `app/sitemap.ts`, and `app/llms.txt/route.ts` from the `example.com` placeholder to the real domain.
