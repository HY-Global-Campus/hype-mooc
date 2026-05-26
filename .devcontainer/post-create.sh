#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

npm run sync-types

npm ci --prefix backend
npm ci --prefix frontend
