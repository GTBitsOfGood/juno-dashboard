#!/usr/bin/env bash
# JUNO_API_KEY comes from .example.env (a stand-in) unless `tesser env set` gives a real one.
set -euo pipefail
cd "$(dirname "$0")/../../../.."
export PATH="$HOME/.bun/bin:$PATH"
export JUNO_BASE_URL="http://localhost:8888"
exec bun run dev -p 3000
