#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_DIR="$ROOT/deploy_package"

echo "=== [1/4] Build frontend (React/Vite) ==="
pnpm --filter @workspace/unb-website run build

echo "=== [2/4] Build API server (Express) ==="
pnpm --filter @workspace/api-server run build

echo "=== [3/4] Package deploy files ==="
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

cp "$ROOT/artifacts/api-server/dist/index.cjs" "$DEPLOY_DIR/index.cjs"
cp -r "$ROOT/artifacts/unb-website/dist/public" "$DEPLOY_DIR/public"

echo "=== [4/4] Compress to deploy.tar.gz ==="
cd "$ROOT"
tar -czf deploy.tar.gz -C deploy_package .

echo ""
echo "=== SELESAI ==="
echo "File siap: unb/deploy.tar.gz ($(du -sh deploy.tar.gz | cut -f1))"
echo ""
echo "Langkah upload ke Niagahoster:"
echo "  1. Download file deploy.tar.gz dari Replit"
echo "  2. Login ke cPanel Niagahoster"
echo "  3. Buka File Manager → masuk ke public_html/deploy_niagahoster/"
echo "  4. Upload deploy.tar.gz lalu Extract di sana"
echo "  5. Buka menu 'Setup Node.js App' → Restart app"
