#!/usr/bin/env bash
# create.sh <dashboard_box_id> <name> [login name]: create a juno project <name> linked to your dev user,
# and print the dashboard URL that shows it. Project names are unique across the whole juno instance.
set -euo pipefail
cd "$(dirname "$0")/../../../.."
box=${1:?usage: create.sh <dashboard_box_id> <name>} proj=${2:?usage: create.sh <dashboard_box_id> <name>}
name=$(echo "${3:-$(basename "$PWD")}" | tr -c 'a-zA-Z0-9\n' '-' | tr 'A-Z' 'a-z')
. "$(dirname "$0")/juno.sh"
id=$(jcall "$box" POST /project "{\"name\":\"$proj\"}" | jq -r '.id | if type=="object" then .low else . end')
[ -n "$id" ] && [ "$id" != null ] || { echo "create.sh: project $proj was not created" >&2; exit 1; }
tok=$(JEMAIL="dev+$name@example.com" JPASS=dev-password jcall "$box" POST /auth/user/jwt "" | jq -r '.token // empty')
[ -n "$tok" ] || { echo "create.sh: run login.sh first" >&2; exit 1; }
uid=$(tesser ssh "$box" -- curl -sS http://localhost:8888/auth/test-auth -H "Authorization: Bearer $tok" |
  jq -r '.user.id | if type=="object" then .low else . end')
jcall "$box" PUT "/user/id/$uid/project" "{\"id\":$id}" >/dev/null
echo "http://${box/_/-}.localhost:3000/projects"
