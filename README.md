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
