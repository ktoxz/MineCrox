# MineCrox — Minecraft pack hosting (private-by-link)

MineCrox is a minimalist file host for Minecraft packs:

- Upload **.zip**
- Validate contents (resource pack / datapack)
- Return a **private-by-link** landing page
- Downloads use **signed redirects** (S3 keys are never exposed)

Repo layout:

- `backend/` — FastAPI API
- `frontend/` — Next.js (App Router) SSR UI

Key behavior:

- No public listing
- File pages are `noindex,nofollow`
- **Sliding expiry**: when a file is downloaded, its **Expires** time is refreshed (so 1 download/day can keep it alive)

## Local dev (Docker)

```powershell
Copy-Item .env.example .env
docker compose up --build
```

- Web: http://localhost:3000
- API: http://localhost:8000/docs

## Production (VPS + Docker + Caddy)

Recommended setup:

- Web: `https://minecrox.ktoxz.id.vn`
- API: `https://api.ktoxz.id.vn`

### 1) DNS

Create A-records for:

- `minecrox.ktoxz.id.vn` → VPS IP
- `api.ktoxz.id.vn` → VPS IP

### 2) Reverse proxy (Caddy)

Install Caddy on the host and use the sample config:

- [deploy/caddy/Caddyfile](deploy/caddy/Caddyfile)

Reload:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 3) Production env

Create `.env.prod` on the VPS (do not commit it). Start from `.env.example` and set at least:

- `DOMAIN=minecrox.ktoxz.id.vn`
- `BACKEND_ENV=prod`
- `BACKEND_CORS_ORIGINS=https://minecrox.ktoxz.id.vn`
- `NEXT_PUBLIC_API_BASE_URL=https://api.ktoxz.id.vn`
- S3 (Vietnix): `S3_ENDPOINT_URL`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- `S3_PRESIGN_ENDPOINT_URL` must be **browser-reachable** (usually the same Vietnix endpoint)

Important (Next.js): `NEXT_PUBLIC_*` is baked into the frontend at **build time**, so you must rebuild the frontend after changing `NEXT_PUBLIC_API_BASE_URL`.

### 4) Start production containers

Use [docker-compose.prod.yml](docker-compose.prod.yml):

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml ps
```

### 5) Verify

```bash
curl -i https://api.ktoxz.id.vn/healthz
curl -i https://api.ktoxz.id.vn/docs
```

## Turnstile (anti-bot)

If you enable Turnstile, you must configure both sides:

- Backend: `TURNSTILE_ENABLED=true`, `TURNSTILE_SECRET_KEY=...`, optional `TURNSTILE_EXPECTED_HOSTNAME=minecrox.ktoxz.id.vn`
- Frontend: `NEXT_PUBLIC_TURNSTILE_SITE_KEY=...` (requires frontend rebuild)

## Troubleshooting

### “CORS blocked” but the real issue is 500

Browsers often display CORS errors when the API returns a `500` without CORS headers.
Check backend logs:

```bash
docker compose -f docker-compose.prod.yml logs -n 200 backend
```

Common causes:

- Wrong S3 bucket/keys, or bucket not created
- Turnstile enabled but captcha token missing
- Frontend built with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

