#!/usr/bin/env bash
set -euo pipefail
 
cd "$(dirname "$0")/../backend"
 
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi
 
OTEL_AGENT_PATH="${OTEL_JAVA_AGENT_PATH:-}"
JAR_PATH="${BACKEND_JAR_PATH:-target/three-tier-backend-1.0.0.jar}"
 
if [[ ! -f "$JAR_PATH" ]]; then
  echo "Backend jar not found at $JAR_PATH"
  echo "Build it first with: mvn clean package -DskipTests"
  exit 1
fi
 
JAVA_CMD=(java)
 
if [[ -n "$OTEL_AGENT_PATH" ]]; then
  if [[ ! -f "$OTEL_AGENT_PATH" ]]; then
    echo "OpenTelemetry agent jar not found at $OTEL_AGENT_PATH"
    exit 1
  fi
 
  JAVA_CMD+=("-javaagent:$OTEL_AGENT_PATH")
fi
 
JAVA_CMD+=(-jar "$JAR_PATH")
exec "${JAVA_CMD[@]}"
