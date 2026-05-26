#!/usr/bin/env bash
set -euo pipefail

cd /workspace

npm run sync-types

(cd backend && npm ci)
(cd frontend && npm ci)
