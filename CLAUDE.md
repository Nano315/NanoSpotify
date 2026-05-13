# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**TrueShuffle** — a Next.js "companion app" for Spotify. The repo directory is `NanoSpotify` but the product (and `package.json` `name`) is `trueshuffle`. UI copy is in French. The app does not stream audio; it reads the user's library via Spotify Web API and writes new playlists back.

Two user-facing surfaces today:
- `/` — library grid, lets the user generate a Fisher-Yates–shuffled clone of any playlist (or Liked Songs) named `[Source] - Shuffle`.
- `/top-100` — the user's top 100 tracks for a time range (`long_term` / `medium_term` / `short_term`), with a "Save as playlist" button.

## Commands

```bash
npm run dev      # next dev (App Router, hot reload at :3000)
npm run build    # next build
npm run start    # next start (after build)
npm run lint     # eslint (flat config in eslint.config.mjs, extends next/core-web-vitals + next/typescript)
```

No test runner is configured.

## Required env vars (`.env.local`)

```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
NEXTAUTH_URL          # e.g. http://localhost:3000
NEXTAUTH_SECRET
```

The Spotify app's redirect URI must include `${NEXTAUTH_URL}/api/auth/callback/spotify`.

## Architecture

### Auth — NextAuth v4 + Spotify with manual refresh rotation

[lib/auth.ts](lib/auth.ts) defines `authOptions` and `refreshAccessToken()`. The `jwt` callback stores `accessToken` / `refreshToken` / `expiresAt` on the JWT, and proactively calls `refreshAccessToken()` 60 s before expiry by POSTing to `https://accounts.spotify.com/api/token` with a `Basic base64(client_id:client_secret)` header. The `session` callback exposes `accessToken`, `refreshToken`, and `error` on `session.user` — the typing for this lives in [types/next-auth.d.ts](types/next-auth.d.ts) (module augmentation of `next-auth` and `next-auth/jwt`).

Scopes requested: `user-read-email user-read-private playlist-read-private playlist-modify-public playlist-modify-private user-library-read user-top-read`. If you add a feature that needs a new scope, update the `SCOPES` constant — users will need to re-authenticate.

The route handler is at [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts). NextAuth is **v4** (not v5/Auth.js) — the TECH_SPEC mentions v5 but it was never migrated; don't `import { auth }` style.

### Spotify client — single server-side factory

[lib/spotify-client.ts](lib/spotify-client.ts) exports `getSpotifyClient()`, which calls `getServerSession(authOptions)`, instantiates a fresh `SpotifyWebApi` with the user's `accessToken`, and returns it (or `null` if unauthenticated). **Every Spotify call goes through this** — never instantiate `SpotifyWebApi` directly elsewhere, and never import `spotify-web-api-node` from a client component (it's server-only).

### Data flow — server actions, not React Query

Despite `@tanstack/react-query` and `zustand` being listed in `package.json`, neither is actually used. `QueryClientProvider` is wired up in [app/providers.tsx](app/providers.tsx) but no `useQuery`/`useMutation` calls exist, and `zustand` is not imported anywhere. The current data flow is:

- **Reads:** server components (`app/page.tsx`, `app/top-100/page.tsx`) `await` server actions directly.
- **Writes / long ops:** client components call `"use server"` actions via `useTransition` or plain `async` handlers, then surface results with `sonner` toasts (and `canvas-confetti` for success).

All server actions live in [actions/](actions/) and start with `"use server"`. If you're tempted to add a new API route under `app/api/`, prefer a server action unless there's a specific reason (webhooks, third-party callbacks).

### Robust Spotify calls in `actions/shuffle.ts`

`callSpotify(name, op, retries=3)` is a local helper in [actions/shuffle.ts](actions/shuffle.ts) that wraps an SDK call with exponential backoff (500/1000/2000 ms) on 5xx / `ECONNRESET`, but throws immediately on 4xx. Reuse this pattern for any new write action — Spotify's API has transient 5xxs especially on `addTracksToPlaylist` batches.

### Shuffle algorithm and playlist mutation

- [lib/algorithms/fisher-yates.ts](lib/algorithms/fisher-yates.ts) — pure Fisher-Yates over an array of track URIs, non-mutating.
- `createShufflePlaylist(sourcePlaylistId, sourceName)` in [actions/shuffle.ts](actions/shuffle.ts):
  1. Paginates **all** source tracks — 100/page via `getPlaylistTracks` for normal playlists, 50/page via `getMySavedTracks` for the special id `"liked-songs"`.
  2. Shuffles the URI list.
  3. Looks for an existing playlist whose name **exactly equals** `[Source] - Shuffle`. If found, `replaceTracksInPlaylist` with the first 100 then `addTracksToPlaylist` with the rest (100 at a time — Spotify's hard cap per call). If not, `createPlaylist` (private) then batch-add.

Two conventions to preserve:
- **`liked-songs` sentinel id.** [actions/spotify.ts](actions/spotify.ts) prepends a virtual playlist with `id: "liked-songs"` so the UI can render it; `shuffle.ts` branches on this literal. Any new action that takes a playlist id must handle this case.
- **Filter out `- Shuffle` outputs.** `getUserPlaylists()` filters playlists whose name ends with ` - Shuffle` so users don't shuffle an already-shuffled list. Keep this filter if you change the listing.

### Top 100

`getMyTopTracks` is capped at 50, so [actions/top-tracks.ts](actions/top-tracks.ts) does **two parallel calls** at offsets 0 and 50 and concatenates. `saveTopTracksAsPlaylist` in [actions/save-playlist.ts](actions/save-playlist.ts) names the output `Mon Top 100 - {Toujours|6 Mois|4 Semaines}` and uses `replaceTracksInPlaylist` (single call, ≤100 URIs) — it does **not** append, so re-saving overwrites.

### Time range URL param

The `range` param on `/top-100` is the source of truth — `TimeRangeFilter` calls `router.push("/top-100?range=...")` and the server component re-renders. There's no client state; pass `key={timeRange}` to `TrackList` to remount on change.

### Routing & shell

[app/layout.tsx](app/layout.tsx) wraps everything in `<Providers>` (SessionProvider + QueryClientProvider) and `<AppShell>` (top bar, mobile bottom nav, sign-out). [components/layout/AppShell.tsx](components/layout/AppShell.tsx) shows the nav only when `session?.user` exists, so unauthenticated pages render the header chrome but no nav items — login is initiated from `<LoginButton />` placed inline on the page.

There is no route middleware — protection is per-action via `getSpotifyClient()` returning `null`. Pages render an empty state with a login CTA when that happens.

### Styling — Tailwind v4, no config file

Tailwind 4 is configured via the PostCSS plugin only ([postcss.config.mjs](postcss.config.mjs)). **There is no `tailwind.config.ts`.** Theme tokens and design utilities live in [app/globals.css](app/globals.css):
- `@theme { ... }` defines CSS custom properties Tailwind picks up.
- `@layer components` defines `.glass-panel`, `.glass-card` (the glassmorphism look), `.text-glow`.

When extending the theme, edit `globals.css` — don't create a `tailwind.config.ts`. Spotify green (`#1ed760`) and `--primary-glow` are the brand accents; the background is `#050505` (set on `<body>` in `layout.tsx`).

### TypeScript

- Path alias `@/*` → project root (e.g. `@/lib/auth`, `@/actions/shuffle`). Always use the alias for cross-directory imports.
- `strict: true`. The `spotify-web-api-node` types are loose — a few call sites use `(playlist: any)` because the upstream typings don't model paginated responses well; match that style if you hit similar issues rather than inventing new wrapper types.

## Things that look authoritative but aren't

- **`specs/PRD.md`, `specs/TECH_SPEC.md`, `specs/TODO.md`** were written at project kickoff and never updated. They describe NextAuth v5, Next 14+, a `(dashboard)` route group, `components/ui/`, `hooks/`, a "Vibe Explorer" feature, and a `useSpotify` client hook — **none of these exist in the current codebase**. Use the specs for product intent (the "True Shuffle" thesis, the design vibe) but never as a structural reference. The TODO file marks things as `[x]` that are merely scaffolded.
- **`README.md`** is the unmodified `create-next-app` template.
