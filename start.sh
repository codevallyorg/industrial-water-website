#!/usr/bin/env bash
#
# Forbes Water — local dev launcher.
#
# Starts the whole stack in ONE terminal:
#   1. Postgres   (docker compose)         → :5433
#   2. Strapi CMS (background, logs → file) → :$BACKEND_PORT   (default 7000)
#   3. Next.js    (foreground)              → :$FRONTEND_PORT  (default 4000)
#
# Ctrl+C stops everything. Start ngrok yourself in another terminal (ngrok http $FRONTEND_PORT).
#
# Ports are dynamic — change them without editing any file:
#   ./start.sh                       # 4000 / 7000
#   ./start.sh -f 5000 -b 9000       # frontend 5000, backend 9000
#   FRONTEND_PORT=5000 ./start.sh    # env vars work too
#
# The frontend's STRAPI_URL is derived from the backend port every run, so the two can never
# drift out of sync (that mismatch is what breaks images).

set -euo pipefail

# ---- defaults (env vars override; flags override env) -----------------------
FRONTEND_PORT="${FRONTEND_PORT:-4000}"
BACKEND_PORT="${BACKEND_PORT:-7000}"

usage() {
  cat <<EOF
Usage: ./start.sh [-f FRONTEND_PORT] [-b BACKEND_PORT]

  -f, --frontend-port   Next.js port   (default 4000, or \$FRONTEND_PORT)
  -b, --backend-port    Strapi port    (default 7000, or \$BACKEND_PORT)
  -h, --help            Show this help

Postgres stays on :5433 (docker compose). Run ngrok yourself: ngrok http FRONTEND_PORT
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -f|--frontend-port) FRONTEND_PORT="$2"; shift 2 ;;
    -b|--backend-port)  BACKEND_PORT="$2";  shift 2 ;;
    -h|--help)          usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STRAPI_LOG="$ROOT/backend/strapi-dev.log"

# ---- helpers ----------------------------------------------------------------
c() { printf '\033[%sm%s\033[0m' "$1" "$2"; }              # colour
say() { echo "$(c '1;36' '»') $*"; }
free_port() { command -v fuser >/dev/null 2>&1 && fuser -k "$1/tcp" >/dev/null 2>&1 || true; }
port_open() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null && { exec 3<&- 3>&-; return 0; } || return 1; }

wait_for() {  # wait_for <port> <label> <timeout-seconds>
  local port="$1" label="$2" timeout="${3:-60}" i=0
  while (( i < timeout )); do
    port_open "$port" && { say "$label ready on :$port"; return 0; }
    sleep 1; ((i++))
  done
  echo "$(c '1;31' '✗') $label did not come up on :$port within ${timeout}s" >&2
  return 1
}

# ---- cleanup: kill Strapi (and its process tree) on exit --------------------
STRAPI_PID=""
cleanup() {
  echo
  say "Shutting down…"
  if [[ -n "$STRAPI_PID" ]] && kill -0 "$STRAPI_PID" 2>/dev/null; then
    # kill the whole process group so Strapi's children die too
    kill -- "-$STRAPI_PID" 2>/dev/null || kill "$STRAPI_PID" 2>/dev/null || true
  fi
  free_port "$BACKEND_PORT"
  say "Stopped. (Postgres left running — 'docker compose down' to stop it.)"
}
trap cleanup EXIT INT TERM

# ---- exported env: dynamic ports flow to both apps --------------------------
# Real env wins over .env / .env.local, so these override whatever the files say.
export PORT="$BACKEND_PORT"                                   # Strapi listens here
export STRAPI_URL="http://127.0.0.1:$BACKEND_PORT"           # frontend reads Strapi here
export NEXT_PUBLIC_SITE_URL="http://localhost:$FRONTEND_PORT" # canonical / OG base

echo
say "Forbes Water dev stack"
echo "    frontend  →  http://localhost:$FRONTEND_PORT"
echo "    backend   →  http://localhost:$BACKEND_PORT/admin"
echo "    postgres  →  127.0.0.1:5433 (docker)"
echo

# ---- 0. sanity: deps installed ---------------------------------------------
[[ -d "$ROOT/backend/node_modules"  ]] || { echo "$(c '1;31' '✗') backend deps missing — run: cd backend && npm install"  >&2; exit 1; }
[[ -d "$ROOT/frontend/node_modules" ]] || { echo "$(c '1;31' '✗') frontend deps missing — run: cd frontend && npm install" >&2; exit 1; }

# ---- 1. free the two app ports (only these; Postgres/other apps untouched) --
say "Freeing :$BACKEND_PORT and :$FRONTEND_PORT if stale…"
free_port "$BACKEND_PORT"
free_port "$FRONTEND_PORT"

# ---- 2. Postgres ------------------------------------------------------------
say "Starting Postgres (docker compose up -d)…"
( cd "$ROOT" && docker compose up -d )
wait_for 5433 "Postgres" 30

# ---- 3. Strapi (background, own process group so we can kill the tree) ------
say "Starting Strapi… (logs → backend/strapi-dev.log)"
: > "$STRAPI_LOG"
( cd "$ROOT/backend" && exec npm run develop ) >"$STRAPI_LOG" 2>&1 &
STRAPI_PID=$!
# Strapi builds the admin on first run — give it up to 3 minutes.
wait_for "$BACKEND_PORT" "Strapi" 180 || { echo "  last log lines:"; tail -n 20 "$STRAPI_LOG" >&2; exit 1; }

# ---- 4. Next.js (foreground — this terminal streams its logs) ---------------
say "Starting Next.js on :$FRONTEND_PORT …"
echo "$(c '2' '    (tail -f backend/strapi-dev.log in another terminal to watch Strapi)')"
echo
cd "$ROOT/frontend"
exec npx --no-install next dev -p "$FRONTEND_PORT"
