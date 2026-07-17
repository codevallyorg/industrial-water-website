# Forbes Water Website — Complete Startup Guide

## Prerequisites

Before starting, make sure you have these installed on your machine:

| Tool | Version | Check Command |
|------|---------|---------------|
| **Node.js** | v18+ (recommended v20) | `node --version` |
| **npm** | v9+ | `npm --version` |
| **Docker** | v20+ | `docker --version` |
| **Docker Compose** | v2+ | `docker compose version` |

> [!TIP]
> If you don't have Node.js, install it via [nvm](https://github.com/nvm-sh/nvm):
> ```bash
> curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
> nvm install 20
> ```

---

## Step-by-Step Startup

### Step 1: Start the Database (Docker Postgres)

```bash
cd /home/codevally/Documents/Projects/forbes-water-website
docker compose up -d
```

This starts a Postgres 17 container on **port 5433** with:
- Database: `forbes_water`
- User: `forbes`
- Password: `forbes_dev_password`

Verify it's running:
```bash
docker ps | grep forbes-water-db
```

---

### Step 2: Start the Backend (Strapi CMS)

```bash
cd /home/codevally/Documents/Projects/forbes-water-website/backend
npm install          # install dependencies (first time only)
npm run develop      # start Strapi in dev mode
```

> [!IMPORTANT]
> On **first run**, Strapi will:
> 1. Build the admin panel
> 2. Create database tables
> 3. Open at **http://localhost:1337/admin**
> 4. Ask you to **create an admin user** — fill in your details

#### After First Login — Seed Content & Generate API Tokens

Once Strapi is running and you've created an admin user:

```bash
# In a NEW terminal:
cd /home/codevally/Documents/Projects/forbes-water-website/backend

npm run seed        # loads all content from the design prototype
npm run tokens      # generates API tokens — COPY the output!
```

> [!WARNING]
> **Copy the tokens from `npm run tokens` output!** You'll need to paste them into `frontend/.env.local`:
> - `STRAPI_API_TOKEN` — read-only token for the frontend
> - `STRAPI_ENQUIRY_TOKEN` — create-only token for the contact form

---

### Step 3: Configure the Frontend

The frontend env file already exists at `frontend/.env.local`. If you ran `npm run tokens` above, update the tokens:

```bash
cd /home/codevally/Documents/Projects/forbes-water-website/frontend
```

Edit `.env.local` and replace the token values if needed:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRAPI_URL=http://127.0.0.1:1337
STRAPI_API_TOKEN=<paste-read-token-here>
STRAPI_ENQUIRY_TOKEN=<paste-enquiry-token-here>
ALLOW_INDEXING=false
REVALIDATE_SECRET=dev-revalidate-secret-9256f280dd711d6e
```

---

### Step 4: Start the Frontend (Next.js)

```bash
cd /home/codevally/Documents/Projects/forbes-water-website/frontend
npm install          # install dependencies (first time only)
npm run dev          # start Next.js dev server
```

The site will be live at **http://localhost:3000** 🎉

---

## Quick Reference — All Commands

```bash
# From project root:
docker compose up -d                    # ① Start Postgres

cd backend && npm run develop           # ② Start Strapi → localhost:1337/admin
cd backend && npm run seed              # ③ Seed content (first time)
cd backend && npm run tokens            # ④ Generate API tokens (first time)

cd frontend && npm run dev              # ⑤ Start Next.js → localhost:3000
```

---

## Architecture Overview

```
┌──────────────────────┐     ┌─────────────────────┐     ┌──────────────┐
│   Next.js Frontend   │────▶│   Strapi Backend     │────▶│  PostgreSQL  │
│   localhost:3000     │     │   localhost:1337      │     │  port 5433   │
│                      │     │                      │     │  (Docker)    │
│  • 20 routes         │     │  • Content API       │     │              │
│  • Server Components │     │  • Admin panel       │     │              │
│  • Tailwind v4       │     │  • Media uploads     │     │              │
└──────────────────────┘     └─────────────────────┘     └──────────────┘
```

---

## About the Logo

The website currently uses a **text-based logo** matching the approved design:

- **Header**: Droplet SVG icon + "Forbes" + "Water" (in cyan `#34d3e0`)
- **Footer**: Same pattern, slightly smaller

This is defined in:
- [Header.tsx](file:///home/codevally/Documents/Projects/forbes-water-website/frontend/src/components/layout/Header.tsx#L79-L86) — header logo
- [Footer.tsx](file:///home/codevally/Documents/Projects/forbes-water-website/frontend/src/components/layout/Footer.tsx#L34-L41) — footer logo
- [icons/index.tsx](file:///home/codevally/Documents/Projects/forbes-water-website/frontend/src/components/icons/index.tsx#L12-L19) — the Droplet SVG component

### To Replace with a Custom Logo Image

If you have a logo file (PNG, SVG, or WebP):

1. Place the logo in `frontend/public/` (e.g., `frontend/public/forbes-water-logo.svg`)
2. Update `Header.tsx` to use `next/image` instead of the text/SVG
3. Update `Footer.tsx` similarly

> [!NOTE]
> **Share your logo file with me** and I'll make the code changes for you!

---

## Common Issues & Troubleshooting

| Problem | Solution |
|---------|----------|
| `docker compose up` fails | Make sure Docker daemon is running: `sudo systemctl start docker` |
| Strapi can't connect to DB | Check Postgres is running: `docker ps`, verify port 5433 |
| Frontend shows 403 errors | Tokens may be wrong — re-run `npm run tokens` in backend |
| `npm install` fails | Try deleting `node_modules` and `package-lock.json`, then retry |
| Port 3000 already in use | Kill the process: `lsof -ti:3000 | xargs kill -9` |
| Port 1337 already in use | Kill the process: `lsof -ti:1337 | xargs kill -9` |

---

## Stopping Everything

```bash
# Stop frontend: Ctrl+C in the terminal running npm run dev
# Stop backend: Ctrl+C in the terminal running npm run develop
# Stop database:
cd /home/codevally/Documents/Projects/forbes-water-website
docker compose down          # stops and removes the container
# docker compose down -v     # also deletes the database data (careful!)
```

---

## ⚡ Quick Start — 3 Terminals

```bash
# Terminal 1 — Database
docker compose up -d

# Terminal 2 — Backend (Strapi CMS)
cd backend && npm install && npm run develop
# → Opens at http://localhost:1337/admin
# → First time: create admin user, then run: npm run seed && npm run tokens

# Terminal 3 — Frontend (Next.js)
cd frontend && npm install && npm run dev
# → Opens at http://localhost:3000
```
