# 내 트리를 꾸며줘 (Decorate My Tree)

A Christmas web app from **향수병 게임즈** (Homesick Games) — small web games I make in Toronto because I miss Korea.

Make a tree, send the link to friends and family, and they hang an ornament with a short message.
The ornaments are Korean winter street snacks instead of glass balls: 붕어빵, 호떡, 귤, 군고구마, 호빵, 계란빵.
Anyone can see who hung what, but **only the tree owner can read the messages, and only on Christmas** (Dec 25, Korea time).

## How it works

- **No login.** Creating a tree returns a random owner key. The browser keeps it in `localStorage`,
  and the owner can copy a "key link" (`/t/<id>#k=<key>`) to open the tree on another device.
  The key is in the URL hash, so it never reaches the server logs; the page strips it from the address bar right away.
- **The server never stores the key**, only an HMAC of it. Same for IPs (used for spam limits).
- **Messages are locked in SQL.** `get_tree` only adds the `message` field when the owner hash matches *and* `now() >= open_at`,
  so there is no way to read them early from the browser.
- **Spam limits:** 5 trees per hour and 10 ornaments per 10 minutes per IP, 120 ornaments per tree,
  a small bad-word filter, no links in messages, and the owner can take any ornament down.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Supabase Postgres, called through PostgREST RPC with plain `fetch` (no SDK). RLS is on with no policies,
  so only the server's secret key can call the functions.
- Ornaments and the tree are hand-written SVG components.

## Run locally

```bash
npm install
# without these the pages render but creating trees is turned off
export SUPABASE_URL=https://xxxx.supabase.co
export SUPABASE_SECRET_KEY=sb_secret_...
npm run dev
```

Run `supabase/schema.sql` once in the Supabase SQL editor first.
To see the after-Christmas screen early, set `NEXT_PUBLIC_OPEN_AT=2020-01-01T00:00:00Z`.

## Files

- `supabase/schema.sql` — tables, limits and the four RPC functions
- `src/lib/server/` — DB calls, hashing, input cleaning
- `src/app/api/trees/` — create tree, get tree, hang ornament, hide ornament
- `src/components/TreeClient.tsx` — the tree page (owner and visitor views)
- `src/components/OrnamentArt.tsx`, `TreeArt.tsx` — the drawings
