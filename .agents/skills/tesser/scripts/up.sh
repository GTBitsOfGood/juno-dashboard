#!/usr/bin/env bash
# up.sh: start (or reuse) this worktree's dashboard box against a juno backend and print
# `dashboard-web <box_id> <url>`. JUNO_BOX=<juno-api box> picks the backend; otherwise the shared juno-api.
set -euo pipefail
cd "$(dirname "$0")/../../../.."
box=$(tesser dev --detach dashboard-web | tail -1)
if [ -n "${JUNO_BOX:-}" ]; then tesser wire "$box" juno-api "$JUNO_BOX" >/dev/null; tesser sync "$box" --restart >/dev/null; fi
tesser wait "$box" --timeout 9m >/dev/null
echo "dashboard-web $box http://${box/_/-}.localhost:3000"
