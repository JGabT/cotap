# CoTap — cotap.id

Full-stack site for **CoTap**, a premium NFC business card that opens a live digital profile at `cotap.id/yourname`.

- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Routing:** React Router (SPA)
- **Backend:** Cloudflare Worker API (`worker/index.ts`)
- **Database:** Cloudflare D1 (`cotap-db`)
- **Cache:** Cloudflare R2 (`cotap-cache`)
- **Hosting:** Cloudflare Workers with static assets

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Short landing page: hero, three routes in |
| `/how-it-works` | The tap flow plus the full feature grid |
| `/preview` | Interactive name/role/link preview |
| `/card` | Card finishes, materials and specs |
| `/teams` | CoTap for Teams |
| `/pricing` | Basic ₱300, Premium ₱800 and Teams |
| `/faq` | Product and shipping questions |
| `/order` | Three-step checkout |
| `/admin` | Owner console for members, links and plans |
| `/portal` | Client login + self-service profile editor |
| `/u/:handle` | Public live profile (D1-backed, R2-cached) |

Direct links work because `wrangler.jsonc` uses the SPA fallback for non-API routes.

## Backend

### Data model

D1 tables (`migrations/0001_init.sql`):

- `users` — name, handle, role, bio, email, phone, address, plan (`basic` / `pro` / `team`), status, PBKDF2 password hash, avatar + theme
- `links` — label, URL, symbol/icon, order, visibility, owner
- `orders` — order id, plan, delivery method, shipping, total, payment method

### Auth

There are two independent signed-cookie sessions:

- **Owner admin** — single shared `ADMIN_PASSWORD`, 12-hour session
- **Clients** — email + password (PBKDF2-SHA256, 100k iterations), 30-day session

Clients can only touch their own profile and links. Admin routes reject client cookies
and portal routes reject admin cookies.

### R2 profile cache

`GET /api/profiles/:handle` reads from R2 first:

- profile key: `profiles/<handle>.json`
- TTL safety: 24 hours
- invalidated whenever a member, link, plan, avatar, theme or order changes
- response header `x-cotap-cache: HIT | MISS`

Uploaded profile pictures live in the same bucket under `avatars/` and are served
publicly at `/api/avatars/<file>`, with a 2 MB limit and immutable cache headers.

The admin UI can also purge a profile manually with **Purge cache**.

### API

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/profiles/:handle` | public | Cached public profile |
| POST | `/api/orders` | public | Create an order, member account and session |
| POST | `/api/auth/login` | public | Client login |
| POST | `/api/auth/logout` | client | Clear client session |
| GET | `/api/auth/me` | public | Client session check |
| POST | `/api/auth/password` | client | Change own password |
| GET | `/api/portal/profile` | client | Own profile + links |
| PATCH | `/api/portal/profile` | client | Update own name, handle, role, phone |
| POST | `/api/portal/links` | client | Add own link |
| PATCH | `/api/portal/links/:linkId` | client | Edit own link |
| DELETE | `/api/portal/links/:linkId` | client | Delete own link |
| POST | `/api/portal/avatar` | client | Upload a profile picture to R2 |
| GET | `/api/avatars/:file` | public | Serve an uploaded profile picture |
| POST | `/api/admin/login` | password | Signed 12-hour session cookie |
| POST | `/api/admin/logout` | session | Clear session |
| GET | `/api/admin/me` | public | Session check |
| GET | `/api/admin/users` | admin | List members |
| GET | `/api/admin/users/:id` | admin | Member + links |
| PATCH | `/api/admin/users/:id` | admin | Update name, handle, role, contact, plan, status |
| DELETE | `/api/admin/users/:id` | admin | Delete member + links |
| POST | `/api/admin/users/:id/links` | admin | Add link |
| PATCH | `/api/admin/users/:id/links/:linkId` | admin | Edit link |
| DELETE | `/api/admin/users/:id/links/:linkId` | admin | Delete link |
| DELETE | `/api/admin/users/:id/cache` | admin | Purge R2 profile cache |

## Admin

Open **`/admin`**. The console lets the owner:

- search and select any member
- change name, username, role, email, phone and status
- add, edit and remove public links
- switch plans (Basic / Pro / Teams), including one-click **Upgrade to Pro**
- view the live public profile
- purge the R2 cache for that profile
- delete a member

Auth is a single shared admin password stored as a Worker secret. Login issues an
HttpOnly, signed session cookie (HMAC-SHA256, 12 hours).

Set or rotate the secrets:

```bash
bunx wrangler secret put ADMIN_PASSWORD
bunx wrangler secret put ADMIN_SESSION_SECRET
```

For local development, put the same values in `.dev.vars` (gitignored).

## Client portal

Clients sign in at **`/portal`** with their email and password. They can:

- edit their name, username, role, bio and phone
- choose a profile picture: initials, a stock symbol avatar, or upload a photo (2 MB, PNG/JPG/WebP)
- design their public page: 6 presets plus custom accent, page and card colors, font and background pattern
- add, edit and remove links, each with its own symbol/icon
- copy or open their live profile
- change their password
- request a Pro/Teams upgrade

Plans, status and email changes stay with the owner admin. Every client change
purges the R2 cache and goes live immediately. The card preview in the portal is a
live, interactive mirror of the public page.

## Checkout

The checkout collects name, username, phone, address, email and a password. It
creates the member and login, sets the client session and offers:

- **Delivery** — +₱80, 3–5 working days
- **Pickup** — free

Card and GCash payment screens are **mock** — no money moves. Submitting the order
creates a real D1 member, account and order record, signs the client in, and makes
the profile immediately available at `/u/username`.

## Run locally

```bash
bun install
bun run db:migrate:local
bun run dev:worker
```

`dev:worker` builds the site and starts Wrangler at `http://localhost:8787` with
local D1 and R2 bindings. For frontend-only work, `bun run dev` runs Vite at
`http://localhost:5173` and proxies `/api` to Wrangler on port 8787.

## Deploy

```bash
bun run db:migrate   # apply schema + seed to remote D1 (first deploy)
bun run deploy       # build + wrangler deploy
```

The Worker bindings are declared in `wrangler.jsonc`:

- `DB` → D1 `cotap-db`
- `CACHE` → R2 `cotap-cache`
- `ASSETS` → built site in `dist/`

## Structure

- `src/pages/` — one component per route
- `src/components/site/` — shared marketing sections and page building blocks
- `src/components/admin/` — login, member editor and link editor
- `worker/index.ts` — Worker API, admin/client auth, D1 queries and R2 cache
- `migrations/0001_init.sql` — schema + demo members
- `migrations/0002_client_auth.sql` — password hashes + unique email index
- `migrations/0003_profile_customization.sql` — avatars, themes and link symbols
- `migrations/0004_profile_bio.sql` — profile bios
- `src/index.css` — theme tokens, typography and motion
- `wrangler.jsonc` — Worker, D1, R2 and asset bindings

## Notes

- Payments are **mock**. No card is charged and no GCash request is sent.
- The public checkout rejects duplicate usernames and emails. Before production,
  add rate limiting, email verification and a real payment provider (Stripe,
  PayMongo or GCash).
- Image uploads validate MIME type and size. Add magic-byte validation, moderation
  and a cleanup job for orphaned R2 objects before production.
- Admin auth is a single shared password, not per-user accounts. Client passwords
  are PBKDF2-hashed; add a reset flow before launch.
- Seeded demo accounts share a demo password. Change or remove them before launch.
- Social links in the footer point to example handles; update them to the real accounts.

## Colour

The accent palette is a bright green (`--primary: oklch(0.885 0.176 124)`) defined
in `src/index.css`. Change that token to re-theme buttons, links, glows and the
favicon accent.
