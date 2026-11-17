#!/usr/bin/env bash
# up.sh: start (or reuse) this worktree's dashboard box against a juno backend and print
# `dashboard-web <box_id> <url>`. JUNO_BOX=<juno-api box> (from juno's up.sh) is the backend; nothing is always on.
set -euo pipefail
cd "$(dirname "$0")/../../../.."
: "${JUNO_BOX:?set JUNO_BOX to a juno-api box; start one with up.sh in a GTBitsOfGood/juno checkout}"
box=$(tesser dev --detach dashboard-web | tail -1)
tesser wire "$box" juno-api "$JUNO_BOX" >/dev/null
tesser sync "$box" --restart >/dev/null
tesser wait "$box" --timeout 9m >/dev/null
echo "dashboard-web $box http://${box/_/-}.localhost:3000"
