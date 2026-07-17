# Forbes Water — Website

Marketing site for Forbes Water, an independent Australian water treatment & consulting firm.
A **finalised, approved design** converted to a production Next.js frontend + Strapi CMS backend.

```
frontend/   Next.js 16 (App Router, TS, Tailwind v4)   → the public site (20 routes)
backend/    Strapi 5 (TS, Postgres)                     → the CMS
design/     the approved prototype + SEO map            → READ-ONLY source of truth
deploy/     nginx reverse-proxy config
```

> **The design is final — it is not to be redesigned.** `design/forbes-water-site.dc.html` is the
> source of truth for every layout, colour and word of copy. See `CLAUDE.md`.

## Quick start

```bash
docker compose up -d                      # dev Postgres on :5433

cd backend
cp .env.example .env                      # set DATABASE_PASSWORD + generate secrets
npm install && npm run develop            # Strapi → localhost:1337/admin  (create an admin user)
npm run seed                              # load content from the design prototype
npm run tokens                            # mint API tokens — copy them into frontend/.env.local

cd ../frontend
cp .env.example .env.local                # paste the two tokens from `npm run tokens`
npm install && npm run dev                # Next.js → localhost:3000
```

## Architecture at a glance

- **20 routes**: home, about, services (+8 detail), industries (+5 detail), sustainability, projects,
  contact. Detail pages are SSG via `generateStaticParams`; slugs come from Strapi — never IDs.
- **Content is dynamic** (all copy, images, stats, cards, services, industries, projects, team, SEO,
  nav, footer, contacts). **Design is static** (tokens, icon set, layout, section order, form rules).
- **Three data shapes** cover almost every grid — `ui.numbered-item`, `ui.icon-item`, `ui.stat` — so
  the same three React components render most sections. Don't add a fourth bespoke grid.
- **Server Components by default.** Only three Client Components exist: `Header`, `MobileNav`,
  `ContactForm`.
- **Security**: Strapi's public role has zero permissions; the frontend reads server-side with a
  read-only token that cannot touch `enquiry`; the contact form uses a separate create-only token.
  The token is `server-only` and never reaches the browser.
- **SEO**: per-page `generateMetadata` with canonical/OG, JSON-LD (Organization, WebSite, Service,
  BreadcrumbList, ItemList), `sitemap.ts` (20 URLs from Strapi), a three-tier `robots.ts`, `/llms.txt`.

## Deployment (VPS)

Postgres + pm2, nginx out front. See `backend/README.md` and `deploy/nginx.conf`.

```bash
cd backend  && npm ci && npm run build
cd frontend && npm ci && npm run build
pm2 start ecosystem.config.js && pm2 save
```

`ALLOW_INDEXING=true` only in production — anything else makes `robots.txt` return `Disallow: /` so
staging can't be indexed.

## Working on this repo

Read `CLAUDE.md` first. Helpful tooling lives in `.claude/`:
- Skills: `design-fidelity`, `strapi-content-type`, `seo-page`
- Agents: `design-porter`, `strapi-schema`, `seo-a11y-auditor`
- Commands: `/sync-types`, `/seed`, `/check-design`
