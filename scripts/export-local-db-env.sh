#!/usr/bin/env bash
set -euo pipefail

export SERVER_PORT="${SERVER_PORT:-8080}"
export DB_HOST="${DB_HOST:-localhost}"
export DB_PORT="${DB_PORT:-3306}"
export DB_NAME="${DB_NAME:-demo_app}"
export DB_USER="${DB_USER:-demo_user}"
export DB_PASSWORD="${DB_PASSWORD:-demo_password}"
export DB_USE_SSL="${DB_USE_SSL:-false}"
export DB_REQUIRE_SSL="${DB_REQUIRE_SSL:-false}"
export DB_VERIFY_SERVER_CERTIFICATE="${DB_VERIFY_SERVER_CERTIFICATE:-false}"
export DB_ALLOW_PUBLIC_KEY_RETRIEVAL="${DB_ALLOW_PUBLIC_KEY_RETRIEVAL:-true}"

echo "Local DB environment variables exported."
