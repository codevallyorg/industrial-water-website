# Forbes Water — Backend (Strapi 5)

The CMS. TypeScript, Postgres. Makes the approved design editable — see `CLAUDE.md` for the content
model and the rules around it.

## Local dev

```bash
docker compose up -d          # dev Postgres on :5433 (from the repo root)
cd backend
cp .env.example .env          # fill DATABASE_PASSWORD + generate the secrets
npm install
npm run develop               # http://localhost:1337/admin
```

### Seeding

```bash
npm run extract-design        # re-lift content from the prototype → scripts/design-content.json
npm run seed                  # upsert content into Strapi (idempotent)
npm run tokens                # mint the two API tokens; prints them once
```

`seed` ports content verbatim from `design/forbes-water-site.dc.html` and
`design/SEO-Content-Map.md`, preserving the `(placeholder)` markers. Re-running never duplicates.

`tokens` creates:
- **`frontend-read`** — custom scope, read-only on content types, **no access to `enquiry`**.
- **`contact-form-create`** — create-only on `enquiry`, nothing else.

Copy both into `frontend/.env.local`.

## Security model

- **Public role has zero permissions.** Anonymous `GET /api/services` returns 403 — verify after any
  change:
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' localhost:1337/api/services   # expect 403
  ```
- The frontend reads server-side with `frontend-read`. `enquiry` (personal data) is never publicly
  readable and never populated into a page query.
- In production the admin is reachable only through nginx, IP-allowlisted (see `deploy/nginx.conf`),
  and the public REST API is blocked at the edge.

### Rate limiting (required)

Every site read is server-side, so Strapi isn't browser-reachable — the one public dynamic surface
is the contact form Server Action (a POST from the browser to Next). Protection is layered:

1. **nginx `limit_req`** in front of both apps — `deploy/nginx.conf` defines `general`, `forms` and
   `admin` zones. This is the primary defence against flooding/API abuse.
2. **App-level throttle** in the Server Action (`frontend/src/actions/submit-enquiry.ts`): 5
   submissions/minute per email, plus a honeypot field.

If client-side fetching is ever introduced, route it through a Next route handler — never expose the
Strapi token or origin to the browser.

## Production (VPS, pm2 + Postgres)

```bash
cd backend
cp .env.example .env          # production DB creds + fresh secrets (never reuse dev values)
npm ci
npm run build
# started via pm2 from the repo root — see ../ecosystem.config.js
```

Postgres runs natively on the VPS (`127.0.0.1:5432`). Point `DATABASE_*` at it and set
`DATABASE_SSL` as your setup requires.

### ISR webhook

Settings → Webhooks → create one pointing at `https://forbeswater.com.au/api/revalidate` with header
`Authorization: Bearer <REVALIDATE_SECRET>` (must match the frontend). Trigger on entry
publish/update/delete. It invalidates the Next cache tag for the changed content type.
