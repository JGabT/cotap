# CoTap — cotap.id

Landing page for **CoTap**, a premium NFC business card that opens a live digital profile at `cotap.id/yourname`.

Built with **Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui** and deployed as a static site on **Cloudflare Workers**.

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
| `/order` | Three-step demo checkout |

Routing uses React Router. `wrangler.jsonc` serves `index.html` for every route via the SPA fallback, so direct links work on Workers.

## Run locally

```bash
bun install
bun run dev
```

The dev server runs at `http://localhost:5173`.

## Build

```bash
bun run build
```

Outputs to `dist/`.

## Deploy

```bash
bun run deploy
```

This builds the site and runs `wrangler deploy` using `wrangler.jsonc`. On first deploy, Wrangler prints the free `*.workers.dev` URL for the `cotap` worker.

To preview the built site in the Workers runtime:

```bash
bun run cf:dev
```

## Structure

- `src/pages/` — one component per route
- `src/components/site/` — shared sections and page building blocks
- `src/components/ui/` — shadcn/ui primitives
- `src/index.css` — theme tokens, typography and motion
- `wrangler.jsonc` — Cloudflare Workers static asset config
- `public/_headers` — security and caching headers

## Notes

- The checkout is a **UI mockup** (₱300 Basic / ₱800 Premium + ₱80 delivery). No payment is processed and no order is stored — connect Stripe, PayMongo or GCash before launch.
- Social links in the footer point to example handles; update them to the real accounts.

## Demo

The **Live preview** section lets visitors type a name, pick a role and auto-generate a `cotap.id/yourname` link. Their details carry over to the checkout at the bottom of the page.

## Checkout

The mock checkout collects name, username, phone and address, then offers:

- **Delivery** — +₱80, 3–5 working days
- **Pickup** — free, address shared by SMS

Payment supports mock card and GCash methods, followed by an order confirmation and a link back to the live preview. The physical card preview beside the form updates as details are entered.

## Colour

The accent palette is a bright green (`--primary: oklch(0.885 0.176 124)`) defined in `src/index.css`. Change that token to re-theme buttons, links, glows and the favicon accent.
