#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy/init-letsencrypt.sh you@example.com
#
# Requirements:
# - docker compose installed
# - DNS A records for minecrox.ktoxz.id.vn and api.ktoxz.id.vn point to this server
# - Ports 80 and 443 open

EMAIL="${1:-}"
if [[ -z "$EMAIL" ]]; then
  echo "Missing email. Usage: $0 you@example.com" >&2
  exit 1
fi

DOMAINS=("minecrox.ktoxz.id.vn" "api.ktoxz.id.vn")
DATA_PATH="$(cd "$(dirname "$0")/.." && pwd)/deploy/certbot"

mkdir -p "$DATA_PATH/conf" "$DATA_PATH/www"

# Create dummy certs so nginx can start before real ones exist.
for domain in "${DOMAINS[@]}"; do
  live_dir="$DATA_PATH/conf/live/$domain"
  mkdir -p "$live_dir"

  if [[ ! -f "$live_dir/fullchain.pem" || ! -f "$live_dir/privkey.pem" ]]; then
    echo "Creating dummy cert for $domain ..."
    docker run --rm \
      -v "$DATA_PATH/conf:/etc/letsencrypt" \
      -v "$DATA_PATH/www:/var/www/certbot" \
      certbot/certbot:latest \
      openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout "/etc/letsencrypt/live/$domain/privkey.pem" \
      -out "/etc/letsencrypt/live/$domain/fullchain.pem" \
      -subj "/CN=$domain"
  fi
done

echo "Starting nginx (and app) ..."
docker compose -f docker-compose.prod.yml up -d --build

# Request real certs via webroot (served by nginx on :80).
for domain in "${DOMAINS[@]}"; do
  echo "Requesting Let's Encrypt certificate for $domain ..."
  docker compose -f docker-compose.prod.yml run --rm \
    --entrypoint "certbot certonly --webroot -w /var/www/certbot --force-renewal -d $domain --email $EMAIL --agree-tos --no-eff-email" \
    certbot

done

echo "Reloading nginx ..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "Done. Certificates installed and nginx reloaded."
