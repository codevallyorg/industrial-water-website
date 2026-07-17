<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# frontend/ — Forbes Water

Next.js 16 · React 19 · TypeScript · Tailwind v4.
Read the root `CLAUDE.md` first — especially **"the design is final, do not redesign it."**
Heed the Next.js block above: check `node_modules/next/dist/docs/` rather than trusting recall.

## Layout

```
src/
  app/          routes; layout.tsx owns fonts + Header/Footer + Organization JSON-LD
                sitemap.ts  robots.ts  llms.txt/route.ts  api/revalidate/route.ts
  components/
    layout/     Header(client)  MobileNav(client)  Footer  CtaBand
    ui/         Button SectionHeading Eyebrow Stat StatGroup MediaFrame Breadcrumb
    sections/   Hero PageHero DetailHero NumberedGrid IconCardGrid
                ServiceGrid IndustryGrid ProjectGrid TeamGrid Testimonial
    icons/      static inline SVGs — not editable from the CMS
    forms/      ContactForm(client)
  lib/          strapi/{client,queries,types}.ts   seo.ts   schema.ts
  actions/      submit-enquiry.ts
```

## Rules

**Server Components by default.** The only Client Components are `Header`, `MobileNav`,
`ContactForm`. Adding a fourth needs a real justification.

**Never import `lib/strapi/client.ts` from a Client Component.** It's `server-only` and carries the
API token; importing it client-side is a build error, and that error is a feature. If the browser
needs data, add a route handler under `app/api/`.

**Data fetching** — one query per page, in the page's Server Component. Explicit `populate` (never
`populate=*` in production code — it over-fetches and can expose draft fields). Tag every fetch so
the Strapi webhook can revalidate it.

**Styling** — Tailwind v4. Tokens are `@theme` custom properties in `globals.css`, ported verbatim
from the prototype. Use the token utilities (`bg-ink`, `text-accent`, `font-display`), never a raw
hex in a component. If a value isn't in the token set, check the prototype — don't invent one.

The site is **dark-theme only**. There is no light mode in the design; don't add
`prefers-color-scheme` handling.

**Images** — always `next/image`, always a real `sizes`. **`preload` on the hero image only**
(`priority` is deprecated in 16 — see below). Strapi media is remote: hosts are allowlisted in
`next.config.ts` `remotePatterns`.

**Metadata** — every page exports `generateMetadata` built via `lib/seo.ts#buildMetadata`, which
falls back to `global.defaultSeo`. Canonical on every page. JSON-LD via `components/seo/JsonLd`.

**A11y** — the prototype omits it; we add it: skip link, `aria-expanded`/`aria-controls` on the nav
dropdowns and burger, visible focus rings, one `<h1>` per page, keyboard-operable menus,
`prefers-reduced-motion` guard on `fadeUp`. None of this may change the visual design.

## Next 16 — verified deltas from the bundled docs

These were checked against `node_modules/next/dist/docs/` in this exact version (16.2.10). They
contradict what most Next 14/15 knowledge will tell you. **Don't "fix" code back to the old forms.**

- **`priority` is deprecated → use `preload={true}`** on the hero image.
  (`03-api-reference/02-components/image.md:293`)
- **`images.qualities` is a required allowlist**, defaulting to `[75]`. A `quality` outside it is
  silently coerced. Add values explicitly if the design needs them.
- **`revalidateTag(tag)` single-arg is deprecated** → `revalidateTag(tag, 'max')`, or
  `revalidateTag(tag, { expire: 0 })` for immediate expiry from an external webhook (our case).
  The "Previous Model" caching guide still shows the old one-arg form — it's stale; trust the API
  reference.
- **`params` / `searchParams` are Promises. Always.** The Next 15 sync fallback is gone. Applies to
  pages, layouts, route handlers, `generateMetadata`, and the `id` passed to `generateSitemaps`.
- **We stay on the "Previous Model" caching.** Do **not** set `cacheComponents: true` — it changes
  `generateStaticParams` rules (empty arrays become build errors) and demands `<Suspense>` around
  runtime APIs. `fetch(url, { next: { tags, revalidate } })` remains correct and is what we use.
- **`fetch` is NOT cached by default** (since 15). Opt in per call; don't assume Next 13/14 behaviour.
- **`metadataBase` is mandatory** once any relative canonical/OG URL is used — otherwise build error.
  Set once in the root layout.
- **Turbopack is the default** for dev and build. A custom `webpack()` config would break the build.
- **`next lint` is removed**; the `eslint` key in `next.config.ts` is gone. Lint via the `eslint` CLI.
- **`middleware.ts` → `proxy.ts`** (`export function proxy()`), Node runtime only.
- `robots.ts` `rules` accepts an **array** of per-user-agent rules — which is how our three-tier
  policy is expressed. `minimumCacheTTL` now defaults to 4h.
- `robots.ts`/`sitemap.ts` are cached at build time unless they touch a runtime API — so
  `ALLOW_INDEXING` must be correct **at build time**, not just at runtime.

When in doubt, read `node_modules/next/dist/docs/` rather than trusting recall.

## Env
```
NEXT_PUBLIC_SITE_URL   public origin, used for canonical/OG/sitemap
STRAPI_URL             server-side Strapi origin
STRAPI_API_TOKEN       read-only content token — SERVER ONLY, never NEXT_PUBLIC_*
ALLOW_INDEXING         "true" only in production; anything else ⇒ robots.txt Disallow: /
REVALIDATE_SECRET      shared with the Strapi webhook
```
