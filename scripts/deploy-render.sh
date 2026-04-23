#!/usr/bin/env bash
# Deploy Biazmark to Render via their REST API — no interactive login needed.
#
# Prereqs (one-time, 2 min):
#   1. Open https://dashboard.render.com/register (sign up — free, no card)
#   2. Open https://dashboard.render.com/u/settings#api-keys → "Create API Key"
#   3. Put it in your shell:   export RENDER_API_KEY=rnd_...
#   4. Run this script.
#
# What this does:
#   - Pushes this repo to GitHub under your account (needs `gh auth login` done once)
#   - Calls POST /v1/blueprints on Render with the render.yaml from the repo
#   - Prints the URLs + next-step commands
#
# Re-run safe: Render skips resources that already exist.

set -euo pipefail

cd "$(dirname "$0")/.."

[ -n "${RENDER_API_KEY:-}" ] || { echo "✗ Set RENDER_API_KEY from https://dashboard.render.com/u/settings#api-keys"; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "✗ gh CLI missing"; exit 1; }

# --- 1. Make sure the repo exists on GitHub + current branch is pushed ---
if ! gh auth status >/dev/null 2>&1; then
  echo "→ GitHub auth required (one-time). Opening browser..."
  gh auth login --web --git-protocol https
fi

OWNER=$(gh api user --jq .login)
REPO_URL=""
if gh repo view "$OWNER/biazmark" >/dev/null 2>&1; then
  REPO_URL="https://github.com/$OWNER/biazmark"
  echo "→ Repo exists: $REPO_URL"
else
  echo "→ Creating GitHub repo $OWNER/biazmark (private)..."
  gh repo create biazmark --private --source=. --push
  REPO_URL="https://github.com/$OWNER/biazmark"
fi

# Make sure everything is pushed
git push -u origin main 2>/dev/null || git push

# --- 2. Trigger Render blueprint ---
echo "→ Creating Render blueprint from $REPO_URL"
RESP=$(curl -sS -X POST https://api.render.com/v1/blueprints \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"biazmark\",
    \"repo\": \"$REPO_URL\",
    \"branch\": \"main\"
  }")

echo "$RESP" | python -m json.tool || echo "$RESP"

# --- 3. Inject secrets that need sync: false ---
echo "→ Injecting secrets (Anthropic, OpenAI, SECRET_KEY, BIAZMARK_API_KEY)"
BIAZMARK_API_KEY="${BIAZMARK_API_KEY:-bzk_$(python -c 'import secrets;print(secrets.token_urlsafe(40))')}"
SECRET_KEY="${SECRET_KEY:-$(python -c 'import secrets;print(secrets.token_urlsafe(48))')}"

# Pull from apimarket if available, else prompt once
if [ -z "${ANTHROPIC_API_KEY:-}" ] && command -v vercel >/dev/null 2>&1; then
  TMP=$(mktemp -d)
  (cd "$TMP" && vercel link --yes --project apimarket >/dev/null 2>&1 && vercel env pull .env --environment=production >/dev/null 2>&1) || true
  [ -f "$TMP/.env" ] && {
    eval "$(grep -E '^(ANTHROPIC_API_KEY|OPENAI_API_KEY|REPLICATE_API_TOKEN|RESEND_API_KEY)=' "$TMP/.env" | sed 's/^/export /')"
  }
  rm -rf "$TMP"
fi

# Render service ID — fetch after blueprint created
SERVICE_ID=$(curl -sS -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services?name=biazmark-backend&limit=1" \
  | python -c "import json,sys; d=json.load(sys.stdin); print(d[0]['service']['id'] if d else '')")

if [ -n "$SERVICE_ID" ]; then
  for pair in \
    "SECRET_KEY=$SECRET_KEY" \
    "BIAZMARK_API_KEY=$BIAZMARK_API_KEY" \
    "ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}" \
    "OPENAI_API_KEY=${OPENAI_API_KEY:-}" \
    "REPLICATE_API_TOKEN=${REPLICATE_API_TOKEN:-}" \
    "RESEND_API_KEY=${RESEND_API_KEY:-}"
  do
    k="${pair%%=*}"; v="${pair#*=}"
    [ -z "$v" ] && continue
    curl -sS -X PUT "https://api.render.com/v1/services/$SERVICE_ID/env-vars/$k" \
      -H "Authorization: Bearer $RENDER_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"value\":\"$v\"}" >/dev/null
  done
  echo "  ✓ Secrets uploaded"
fi

# --- 4. Wire Vercel frontend to Render URL ---
if command -v vercel >/dev/null 2>&1; then
  RENDER_URL="https://biazmark-backend.onrender.com"
  (
    cd frontend
    vercel env rm BIAZMARK_BACKEND_URL production --yes >/dev/null 2>&1 || true
    echo "$RENDER_URL" | vercel env add BIAZMARK_BACKEND_URL production >/dev/null
    vercel env rm BIAZMARK_API_KEY production --yes >/dev/null 2>&1 || true
    echo "$BIAZMARK_API_KEY" | vercel env add BIAZMARK_API_KEY production >/dev/null
    vercel --prod --yes
  ) 2>&1 | tail -3
  echo "  ✓ Vercel frontend redeployed"
fi

echo
echo "════════════════════════════════════════════════════════════"
echo "  ✓ Biazmark live on Render + Vercel"
echo
echo "  Backend:   https://biazmark-backend.onrender.com"
echo "  Frontend:  https://biazmark.vercel.app"
echo "  Dashboard: https://dashboard.render.com"
echo
echo "  First request after 15-min idle takes ~30s to wake up (free tier)."
echo "  Upgrade to Starter (\$7/mo) to keep warm."
echo "════════════════════════════════════════════════════════════"
