# MineCrox — Minecraft File Hosting & CDN Platform

Monorepo:

- `backend/`: FastAPI API service
- `frontend/`: Next.js (App Router) web UI (SSR + SEO)

## Local dev (Docker)

```powershell
Copy-Item .env.example .env
# edit .env if needed

docker compose up --build
```

Frontend: http://localhost:3000

Backend OpenAPI: http://localhost:8000/docs

## Production (Docker + Nginx)

This repo is set up to serve:

- Web UI: `https://minecrox.ktoxz.id.vn` (Next.js)
- API: `https://api.ktoxz.id.vn` (FastAPI)

### 1) Prepare DNS + firewall

- Create **A records** for `minecrox.ktoxz.id.vn` and `api.ktoxz.id.vn` pointing to your server IP.
- Open ports `80` and `443`.

### 2) Configure environment

- Copy `.env.prod` to the server (or edit it in place).
- Ensure these are correct:
	- `DOMAIN=minecrox.ktoxz.id.vn`
	- `BACKEND_CORS_ORIGINS=https://minecrox.ktoxz.id.vn`
	- `NEXT_PUBLIC_API_BASE_URL=https://api.ktoxz.id.vn`

### 3) Bootstrap TLS certs + start services

Nginx config in [deploy/nginx/conf.d/minecrox.conf](deploy/nginx/conf.d/minecrox.conf) expects Let's Encrypt cert files to exist.
Use the helper script to generate temporary dummy certs, start the stack, then request real certs:

```bash
chmod +x deploy/init-letsencrypt.sh
./deploy/init-letsencrypt.sh you@example.com
```

After that, the stack is running via [docker-compose.prod.yml](docker-compose.prod.yml) and Nginx listens on `80/443`.

### 4) Verify

```bash
curl -i https://api.ktoxz.id.vn/healthz
curl -i https://minecrox.ktoxz.id.vn
```

Notes:

- Uploads can be large; Nginx is configured with `client_max_body_size 110m` for `api.ktoxz.id.vn`.

## Production (Caddy only)

If you already run Caddy on the host (no Nginx), you can use the sample Caddy config:

- [deploy/caddy/Caddyfile](deploy/caddy/Caddyfile)

Key points:

- `api.ktoxz.id.vn` sets `request_body max_size 120MB` to avoid proxy 413.
- CORS headers are added by Caddy too, so even proxy errors won't look like CORS issues in the browser.

After updating your Caddyfile:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Important: if you're using Docker/systemd for the backend, you must **rebuild/restart** the backend after code changes; otherwise the old upload parser behavior will still return a plain `500` that browsers report as CORS.
