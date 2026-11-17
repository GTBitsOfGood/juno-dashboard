#!/usr/bin/env bash
# Bun into ~/.bun (survives snapshots), then a frozen install; both no-ops when already done.
set -euo pipefail
cd "$(dirname "$0")/../../../.."
BUN_VERSION=1.4.2
if [ "$("$HOME/.bun/bin/bun" --version 2>/dev/null)" != "$BUN_VERSION" ]; then
  curl -fsSL https://bun.sh/install | bash -s "bun-v$BUN_VERSION" >/dev/null
fi
export PATH="$HOME/.bun/bin:$PATH"
bun install --frozen-lockfile
