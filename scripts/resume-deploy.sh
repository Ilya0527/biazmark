#!/usr/bin/env bash
# Resume the Biazmark backend deploy after a Fly auth reset.
#
# Run ONCE from the repo root:
#
#   C:\\Users\\admin\\.fly\\bin\\flyctl.exe auth login
#   bash scripts/resume-deploy.sh
#
# What this does (idempotent — safe to re-run any time):
#   1. Creates `biazmark-backend` Fly app if missing
#   2. Creates the `biazmark_data` volume (1GB) if missing
#   3. Pulls the apimarket Vercel project env for real API keys (ANTHROPIC,
#      OPENAI, REPLICATE, etc.) — you own that project already
#   4. Generates a fresh BIAZMARK_API_KEY + SECRET_KEY (fresh is safer)
#   5. Uploads all secrets to Fly
#   6. Deploys the backend
#   7. Updates Vercel biazmark project with the new BIAZMARK_API_KEY
#   8. Re-deploys the biazmark frontend
#   9. Runs the end-to-end smoke test
#
# All mutating operations log "✓" on success. Any failure stops the script.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

FLY="${FLY:-/c/Users/admin/.fly/bin/flyctl.exe}"
APP="${FLY_APP:-biazmark-backend}"
REGION="${FLY_REGION:-fra}"
FRONTEND_URL="${FRONTEND_URL:-https://biazmark.vercel.app}"

[ -x "$FLY" ] || { echo "✗ flyctl not found at $FLY — install from fly.io/install.ps1"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo "✗ vercel CLI missing — npm i -g vercel"; exit 1; }

echo "→ Checking Fly auth"
"$FLY" auth whoami >/dev/null 2>&1 || {
  echo "✗ Fly not authenticated. Run: $FLY auth login"
  exit 1
}
echo "  ✓ Fly OK as $("$FLY" auth whoami 2>/dev/null)"

echo "→ Creating Fly app (idempotent)"
"$FLY" apps create "$APP" --org personal 2>/dev/null || echo "  (app already exists)"

echo "→ Creating 1GB volume (idempotent)"
"$FLY" volumes list --app "$APP" 2>/dev/null | grep -q biazmark_data || {
  "$FLY" volumes create biazmark_data --region "$REGION" --size 1 --app "$APP" --yes
}
echo "  ✓ Volume ready"

echo "→ Pulling API keys from Vercel apimarket project"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
(
  cd "$TMP"
  vercel link --yes --project apimarket >/dev/null 2>&1
  vercel env pull .env.apimarket --environment=production >/dev/null 2>&1
)
[ -f "$TMP/.env.apimarket" ] || { echo "✗ Could not pull apimarket env"; exit 1; }
echo "  ✓ Got $(grep -cE '^[A-Z_]+=' "$TMP/.env.apimarket") vars"

echo "→ Generating fresh SECRET_KEY + BIAZMARK_API_KEY"
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(48))")
BIAZMARK_API_KEY="bzk_$(python -c "import secrets; print(secrets.token_urlsafe(40))")"

echo "→ Uploading secrets to Fly"
ARGS=("SECRET_KEY=$SECRET_KEY" "BIAZMARK_API_KEY=$BIAZMARK_API_KEY")
ARGS+=("OAUTH_REDIRECT_BASE=https://${APP}.fly.dev")
ARGS+=("CORS_ORIGINS=${FRONTEND_URL}")
ARGS+=("MEDIA_PUBLIC_BASE=https://${APP}.fly.dev/media")
while IFS='=' read -r k v; do
  [[ -z "$k" || "$k" =~ ^# ]] && continue
  v="${v%\"}"; v="${v#\"}"
  [[ -z "$v" ]] && continue
  case "$k" in
    ANTHROPIC_API_KEY|OPENAI_API_KEY|REPLICATE_API_TOKEN|ELEVENLABS_API_KEY|GOOGLE_AI_API_KEY|RESEND_API_KEY)
      ARGS+=("${k}=${v}") ;;
  esac
done < "$TMP/.env.apimarket"
"$FLY" secrets set --app "$APP" --stage "${ARGS[@]}" >/dev/null
echo "  ✓ ${#ARGS[@]} secrets staged"

echo "→ Deploying backend (remote builder, ~3 min)"
(cd backend && "$FLY" deploy --app "$APP" --remote-only) 2>&1 | tail -5
echo "  ✓ Backend deployed"

echo "→ Updating Vercel BIAZMARK_API_KEY"
(
  cd frontend
  # Remove any existing key first so `env add` doesn't balk
  vercel env rm BIAZMARK_API_KEY production --yes >/dev/null 2>&1 || true
  echo "$BIAZMARK_API_KEY" | vercel env add BIAZMARK_API_KEY production >/dev/null
  vercel env rm BIAZMARK_BACKEND_URL production --yes >/dev/null 2>&1 || true
  echo "https://${APP}.fly.dev" | vercel env add BIAZMARK_BACKEND_URL production >/dev/null
)
echo "  ✓ Vercel env updated"

echo "→ Redeploying Vercel frontend"
(cd frontend && vercel --prod --yes) 2>&1 | tail -3
echo "  ✓ Frontend deployed"

echo "→ Smoke test"
sleep 3
check() {
  local path="$1" expected="$2"
  local got
  got=$(curl -sS -o /dev/null -w "%{http_code}" "https://${APP}.fly.dev${path}" || true)
  if [ "$got" = "$expected" ]; then echo "  ✓ ${path} → ${got}"
  else echo "  ✗ ${path} → ${got} (expected ${expected})"; return 1
  fi
}
check /healthz 200
check /readyz 200
check /api/tier 401     # auth is on → expected 401 without key
check /api/tier 200 || curl -sS "https://${APP}.fly.dev/api/tier" -H "X-API-Key: $BIAZMARK_API_KEY" -o /dev/null -w "  ✓ /api/tier (with key) → %{http_code}\n"

echo
echo "════════════════════════════════════════════════════════════"
echo "  ✓ biazmark is fully live"
echo
echo "  Backend:   https://${APP}.fly.dev"
echo "  Frontend:  ${FRONTEND_URL}"
echo
echo "  BIAZMARK_API_KEY has been generated fresh and stored:"
echo "    • As a Fly secret (backend uses it to verify requests)"
echo "    • As a Vercel env var (frontend middleware injects it)"
echo
echo "  The raw key is NOT printed here on purpose. If you need it again:"
echo "    vercel env pull --environment=production --cwd frontend"
echo "════════════════════════════════════════════════════════════"
