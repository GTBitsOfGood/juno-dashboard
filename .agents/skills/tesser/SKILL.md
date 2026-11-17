---
name: tesser
description: Run juno-dashboard's checks and dev server on tesser boxes, sign in as your own dev user, and make test projects. Use for any typecheck, lint, build, test, running page or signed-in check in juno-dashboard, or when a dashboard-web box misbehaves.
---

# tesser

For tesser itself, `tesser --help`. Pick the cheapest path that proves your task.

| service | manifest | port | shared instance | what it is |
| ------- | -------- | ---- | --------------- | ---------- |
| dashboard-web | `dashboard-web.toml` | 3000 | pinned | Next.js dashboard (`bun dev`) |
| juno-api | in GTBitsOfGood/juno | 8888 | pinned | the juno backend; the dashboard reaches it on `localhost:8888` |

## Waiting
Run every command below in the foreground with your tool's timeout raised to 10 minutes
(`timeout: 600000`). If one times out, `tesser wait <box> --timeout 9m`; never background it and poll.

## Focused checks
On the worktree's workbench (starts from the snapshot: bun 1.4.2 + `bun install --frozen-lockfile`):
- `tesser exec -- bash -lc 'export PATH=$HOME/.bun/bin:$PATH; bunx tsc --noEmit'`
- `tesser exec -- bash -lc 'export PATH=$HOME/.bun/bin:$PATH; bun lint && bun test:prettier'`
- `tesser exec -- bash -lc 'export PATH=$HOME/.bun/bin:$PATH; bun test'`
- `tesser exec -- bash -lc 'export PATH=$HOME/.bun/bin:$PATH; bun run build'`
After a lockfile change, prefix with `bun install --frozen-lockfile &&`.

## Up
`bash .agents/skills/tesser/scripts/up.sh` starts (or reuses) this worktree's dashboard-web box against
the shared juno-api and prints `dashboard-web <box_id> <url>`. Next answers within seconds; a route's
first compile takes ~3 s. To test against a juno change, start juno-api from a juno worktree and run
`JUNO_BOX=<that box> bash .agents/skills/tesser/scripts/up.sh`.

## Sign in
`bash .agents/skills/tesser/scripts/login.sh <box_id>` signs in as `dev+<worktree>@example.com`
(password `dev-password`), an ADMIN linked to its own juno project `dev-<worktree>`, created on first call
through juno's API with the seed superadmin (`test-superadmin@test.com` / `test-password`). It prints
`{"cookies":[{"name":"jwt-token",...}],"localStorage":{}}` and writes `.tesser/dashboard-<box_id>.jar`.
Each call is a new juno JWT; set the cookie on `localhost` for a browser from `tesser browser <box_id>`.

## Data
- Your tenant is the juno project `dev-<worktree>`, shown at `/projects`.
- `bash .agents/skills/tesser/scripts/create.sh <box_id> '<name>'` makes one more project linked to your
  user and prints the URL where its name shows. Names are unique across the juno instance: add a suffix.
- Database: see the juno repo's tesser skill (`db.sh`).
- Write only in your own projects. Never reseed or reset the shared juno-api.

## Iterate
`src/` hot-reloads after `tesser sync <box>`. A dependency or `.agents/skills/tesser` change needs
`tesser sync <box> --restart`.

## When it breaks
Check one layer at a time: `tesser status <box>`, `tesser logs <box>`, `tesser wire <box>`, then your data.
A missing or unhealthy shared juno-api is not yours to fix: report the box and error.
- `dep :8888 (juno-api) has nothing behind it`: no juno-api instance; `tesser wire <box> juno-api <juno box>` then `tesser sync <box> --restart`.
- `/projects` redirects to `/login`: the JWT is from a different juno-api; run login.sh again.

## Hand-off
Worktree and sha, each box and its role, wires, your dev user, the command, its log and exit code.
`tesser rm` the boxes you made when the task is done.
