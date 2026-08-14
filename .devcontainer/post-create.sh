#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

pnpm --dir backend install --frozen-lockfile
pnpm --dir frontend install --frozen-lockfile
