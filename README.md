# CoTap — cotap.id

Landing page for **CoTap**, a premium NFC business card that opens a live digital profile at `cotap.id/yourname`.

Built with **Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui** and deployed as a static site on **Cloudflare Workers**.

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

- `src/components/site/` — page sections (hero, live preview, features, materials, teams, pricing, FAQ, claim form, footer)
- `src/components/ui/` — shadcn/ui primitives
- `src/index.css` — theme tokens, typography and motion
- `wrangler.jsonc` — Cloudflare Workers static asset config
- `public/_headers` — security and caching headers

## Notes

- Pricing (₱300 Basic / ₱800 Premium) and the claim form are placeholders — connect them to a backend, payment link or form service before launch.
- Social links in the footer point to example handles; update them to the real accounts.

## Demo

The **Live preview** section lets visitors type a name, pick a role and auto-generate a `cotap.id/yourname` link. Their claim is carried over to the reservation form at the bottom of the page.

## Colour

The accent palette is a bright blue (`--primary: oklch(0.66 0.17 255)`) defined in `src/index.css`. Change that token to re-theme buttons, links, glows and the favicon accent.
