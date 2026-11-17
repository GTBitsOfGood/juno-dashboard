# Sourced helper: call the juno gateway that a dashboard box reaches on its localhost:8888 dep.
# jcall <box> <METHOD> <path> [json] [extra curl args...]; seed superadmin creds by default.
JUNO_SA_EMAIL=test-superadmin@test.com JUNO_SA_PASSWORD=test-password
jcall() {
  local box=$1 method=$2 path=$3 body=${4:-}
  shift 4 2>/dev/null || shift $#
  tesser ssh "$box" -- curl -sS --fail-with-body -X "$method" "http://localhost:8888$path" -H 'Content-Type: application/json' \
    -H "X-User-Email: ${JEMAIL:-$JUNO_SA_EMAIL}" -H "X-User-Password: ${JPASS:-$JUNO_SA_PASSWORD}" \
    ${body:+-d "$body"} "$@"
}
