#!/usr/bin/env bash
# login.sh <dashboard_box_id> [name]: sign in to the dashboard as dev+<name>@example.com (default name:
# this worktree's folder), an ADMIN linked to its own juno project dev-<name>, both created on first call.
# Prints {"cookies":[...],"localStorage":{}} and writes a curl jar to .tesser/dashboard-<box>.jar.
set -euo pipefail
cd "$(dirname "$0")/../../../.."
box=${1:?usage: login.sh <dashboard_box_id> [name]}
name=$(echo "${2:-$(basename "$PWD")}" | tr -c 'a-zA-Z0-9\n' '-' | tr 'A-Z' 'a-z')
email="dev+$name@example.com" pass=dev-password project="dev-$name"
. "$(dirname "$0")/juno.sh"

jcall "$box" POST /user "{\"email\":\"$email\",\"name\":\"$name\",\"password\":\"$pass\"}" >/dev/null 2>&1 || true
jcall "$box" POST /user/type "{\"email\":\"$email\",\"type\":\"ADMIN\"}" >/dev/null
jcall "$box" POST /project "{\"name\":\"$project\"}" >/dev/null 2>&1 || true
mint() { JEMAIL=$email JPASS=$pass jcall "$box" POST /auth/user/jwt "" | jq -r '.token // empty'; }
token=$(mint)
[ -n "$token" ] || { echo "login.sh: juno gave no JWT for $email" >&2; exit 1; }
uid=$(tesser ssh "$box" -- curl -sS --fail-with-body http://localhost:8888/auth/test-auth -H "Authorization: Bearer $token" |
  jq -r '.user.id | if type=="object" then .low else . end')
jcall "$box" PUT "/user/id/$uid/project" "{\"name\":\"$project\"}" >/dev/null
token=$(mint)  # a fresh session for the caller, after the link
mkdir -p .tesser
printf 'localhost\tFALSE\t/\tFALSE\t0\tjwt-token\t%s\n' "$token" > ".tesser/dashboard-$box.jar"
jq -nc --arg t "$token" '{cookies:[{name:"jwt-token",value:$t}],localStorage:{}}'
