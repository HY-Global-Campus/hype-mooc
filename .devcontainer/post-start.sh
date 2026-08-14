#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_DIR="${ROOT}/.devcontainer/.run"
mkdir -p "$PID_DIR"

stop_pid() {
  local name=$1
  local file="${PID_DIR}/${name}.pid"
  if [[ -f "$file" ]]; then
    kill "$(cat "$file")" 2>/dev/null || true
    rm -f "$file"
  fi
}

wait_for_db() {
  for _ in $(seq 1 60); do
    if (echo >/dev/tcp/db/5432) 2>/dev/null; then
      return 0
    fi
    sleep 1
  done
  echo "PostgreSQL is not reachable at db:5432" >&2
  return 1
}

ensure_socat() {
  if command -v socat >/dev/null 2>&1; then
    return 0
  fi
  sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq socat
}

start_service() {
  local name=$1
  shift
  stop_pid "$name"
  (
    cd "$ROOT"
    exec "$@"
  ) >>"${PID_DIR}/${name}.log" 2>&1 &
  echo $! >"${PID_DIR}/${name}.pid"
  echo "Started ${name} (pid $(cat "${PID_DIR}/${name}.pid"), log ${PID_DIR}/${name}.log)"
}

wait_for_db

export DATABASE_URL="${DATABASE_URL:-postgres://user:password@db:5432/mydatabase}"
export JWT_SECRET="${JWT_SECRET:-developmentsecret}"
export NODE_ENV=development
export DEV_AUTH_BYPASS=true
export VITE_DEV_AUTH_BYPASS=true
export GCAI_URL="${GCAI_URL:-http://127.0.0.1:1}"
export GCAI_TOKEN="${GCAI_TOKEN:-dev}"
export OIDC_CLIENT_ID="${OIDC_CLIENT_ID:-dev}"
export OIDC_CLIENT_SECRET="${OIDC_CLIENT_SECRET:-}"
export PORT=8080

start_service backend pnpm --dir backend run dev
start_service frontend pnpm --dir frontend run dev --host 0.0.0.0 --port 5173 --strictPort

ensure_socat
stop_pid postgres-forward
socat TCP-LISTEN:5432,fork,reuseaddr TCP:db:5432 >>"${PID_DIR}/postgres-forward.log" 2>&1 &
echo $! >"${PID_DIR}/postgres-forward.pid"
echo "Started postgres-forward (pid $(cat "${PID_DIR}/postgres-forward.pid"))"
