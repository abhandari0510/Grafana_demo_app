#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 5 ]]; then
  echo "Usage: $0 <rds_host> <rds_port> <db_name> <db_user> <db_password>"
  exit 1
fi

export SERVER_PORT="${SERVER_PORT:-8080}"
export DB_HOST="$1"
export DB_PORT="$2"
export DB_NAME="$3"
export DB_USER="$4"
export DB_PASSWORD="$5"
export DB_USE_SSL="${DB_USE_SSL:-true}"
export DB_REQUIRE_SSL="${DB_REQUIRE_SSL:-true}"
export DB_VERIFY_SERVER_CERTIFICATE="${DB_VERIFY_SERVER_CERTIFICATE:-false}"
export DB_ALLOW_PUBLIC_KEY_RETRIEVAL="${DB_ALLOW_PUBLIC_KEY_RETRIEVAL:-false}"

echo "RDS environment variables exported."
