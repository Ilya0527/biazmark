# Deploying Biazmark

Three targets. Free tier on all three.

```
Backend   →  Render         →  https://biazmark-backend.onrender.com
Frontend  →  Vercel         →  https://biazmark.vercel.app
Mobile    →  Android APK    →  mobile/android/app/build/outputs/apk/release/
```

**Monthly cost** (default setup): **$0** — all three on free tiers.
Render sleeps after 15 min idle; first request takes ~30s to wake up. Good
enough for the demo stage. Upgrade Render to Starter ($7/mo) when you have
real traffic.

---

## Quick start (under 10 minutes)

```bash
# 1. Env file
cp .env.example .env
./scripts/generate-secret.sh       # → SECRET_KEY (paste into .env)

# 2. Render account (no credit card required)
#    https://dashboard.render.com/register
#    → Create API key: https://dashboard.render.com/u/settings#api-keys
export RENDER_API_KEY=rnd_...

# 3. Deploy everything in one shot
make deploy-backend
```

The `deploy-backend` target runs `scripts/deploy-render.sh`, which:
1. Pushes this repo to GitHub (or reuses an existing `$USER/biazmark`)
2. Calls Render's Blueprint API with `render.yaml` — creates:
   - Web service (FastAPI backend, Docker)
   - Worker service (arq, same image, different command)
   - Redis (25MB free)
   - Postgres (1GB free)
   - Persistent disk (1GB) for media files
3. Uploads all secrets (Anthropic, OpenAI, SECRET_KEY, BIAZMARK_API_KEY)
   from your apimarket Vercel project env if present, otherwise from `.env`
4. Rewires the Vercel `biazmark` project's `BIAZMARK_BACKEND_URL` +
   `BIAZMARK_API_KEY` to point at Render
5. Redeploys the Vercel frontend

Re-run anytime — it's idempotent.

---

## Manual (without the script)

### Backend on Render

1. https://dashboard.render.com → **New → Blueprint**
2. Connect your GitHub account, pick the `biazmark` repo
3. Render reads `render.yaml` and shows the plan: web + worker + Redis + Postgres
4. Click **Apply**
5. On each `sync: false` env var (SECRET_KEY, BIAZMARK_API_KEY, ANTHROPIC_API_KEY, …),
   click "Edit" and paste the value

### Frontend on Vercel

1. vercel.com → **Add New → Project** → pick the same repo
2. **Root Directory:** `frontend`
3. **Environment Variables (Production):**
   - `BIAZMARK_BACKEND_URL` = `https://biazmark-backend.onrender.com`
   - `BIAZMARK_API_KEY` = the same key you set on Render
4. **Deploy**

Thereafter every `git push` to `main` auto-redeploys both services.

---

## Mobile — Android APK

```bash
BIAZMARK_URL=https://biazmark.vercel.app ./scripts/build-mobile-apk.sh
```

Signed APK at `mobile/android/app/build/outputs/apk/release/app-release.apk` —
ready for Google Play upload.

---

## Cost alert (optional but recommended)

`.github/workflows/cost-alert.yml` runs daily at 08:00 UTC. Opens a GitHub
issue if your Fly invoice passes `$5`. Requires `FLY_API_TOKEN` secret.

(Currently wired for Fly. To monitor Render costs, swap the GraphQL query
to Render's billing API in the same workflow — 10-min change.)

---

## Custom domains

### Backend on `api.biazmark.com`

- Render → your service → **Settings → Custom Domains → Add**
- Follow the CNAME instructions
- Then update: `Settings → Environment → OAUTH_REDIRECT_BASE=https://api.biazmark.com`

### Frontend on `biazmark.com`

- Vercel → Project → Domains → Add `biazmark.com` and `www.biazmark.com`
- Backend env: `CORS_ORIGINS=https://biazmark.com,https://www.biazmark.com`

---

## Alternatives

Got your own preference? The backend is a standard Docker container — deploys to:

| Platform | Command | Notes |
|----------|---------|-------|
| **Render** (recommended) | `./scripts/deploy-render.sh` | $0 free tier, sleeps after 15m |
| **Fly.io** | `./scripts/deploy-backend-fly.sh` | Pay-as-you-go, needs credit card |
| **Railway** | `railway up` from `backend/` | $5 credit/month free |
| **Koyeb** | `koyeb service create` | 1 service free, 512MB |

---

## Post-deploy checklist

- [ ] `GET /healthz` returns 200
- [ ] `GET /readyz` returns `"db":"ok"`
- [ ] `GET /api/tier` returns 401 (auth works) and 200 with `X-API-Key` header
- [ ] Frontend loads, connects to backend (no BackendBanner "demo mode" notice)
- [ ] Create a business → background research runs → summary appears within 15s
- [ ] Worker logs show `arq` startup
- [ ] Set up Render spend alert at `$5` (dashboard → Account → Billing)

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Frontend shows "demo mode" banner | `BIAZMARK_BACKEND_URL` not set on Vercel, or backend is sleeping — first request takes ~30s on free tier. |
| `401 invalid_api_key` from backend | `BIAZMARK_API_KEY` mismatch between Render and Vercel. The script keeps them in sync; manual setup requires pasting the same value both places. |
| `429 rate_limited` | Default is 60 req/min/IP. Raise with `RATE_LIMIT_PER_MINUTE=120` on Render. |
| OAuth redirect fails | Redirect URI on the provider's dev dashboard must match `${OAUTH_REDIRECT_BASE}/api/oauth/callback/<platform>` exactly. |
| Slow first response | Free Render sleeps. Upgrade to Starter, or ping `/healthz` every 10 min from an external uptime checker. |
| SQLite locked errors | You kept the Fly config — switch to Render Postgres (automatic with render.yaml). |
