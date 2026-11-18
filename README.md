<div align="center">
  
  <a href="">![GitHub Releases](https://img.shields.io/github/v/release/GTBitsOfGood/juno?include_prereleases&style=for-the-badge)</a>
  <a href="">![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)</a>
  <a href="">![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)</a>
  
</div>
  
<h3 align="center">
  Juno Dashboard
</h3>

<div align="center">
  
[Juno](https://github.com/GTBitsOfGood/juno)'s official microservice dashboard.

</div>

> 📖 Juno's docs live at [juno.bitsofgood.org/docs](https://juno.bitsofgood.org/docs). The dashboard is at [juno.bitsofgood.org](https://juno.bitsofgood.org). The API is at [api.juno.bitsofgood.org](https://api.juno.bitsofgood.org).

# Project Description

This is the dashboard code for easily interacting with [Juno](https://github.com/GTBitsOfGood/juno), [Bits of Good](https://bitsofgood.org/)'s central microservice architecture. See the main repository for more details. 

## Prerequisites

- [Bun](https://bun.sh/docs/installation)

## Getting Started

> ⚠️ **Temporary:** `juno-sdk` is installed from a vendored tarball of [juno-sdk@cab346c](https://github.com/GTBitsOfGood/juno-sdk/commit/cab346c54f67481092c46edcdd5493b03e5f4e75) (see `vendor/`) because 0.0.12+ is not on npm yet. Once it is published, switch the dependency back to the npm version and delete `vendor/`.

Installing all needed packages:

```bash
bun install
```

## Development 

### Running locally

To run locally for development:

```
bun dev
```

The site is served at [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env` in this repository (you can start from `.example.env`). For a local Juno stack:

```
JUNO_BASE_URL=http://localhost:8888
NEXT_PUBLIC_JUNO_BASE_URL=http://localhost:8888
JUNO_API_KEY=
```

`JUNO_BASE_URL` is used by the server-side SDK client (it already defaults to `http://localhost:8888`). `NEXT_PUBLIC_JUNO_BASE_URL` is also read when verifying a login JWT; set both to the same gateway URL.

The Juno Docker stack does not start this dashboard. Start Juno from the [juno](https://github.com/GTBitsOfGood/juno) repo first (see the [local development guide](https://juno.bitsofgood.org/docs/local-development)), then run `bun dev` here.

The local seed superadmin is `test-superadmin@test.com` / `test-password`, with project `test-seed-project`. You can sign in to the dashboard with that account and create an API key under the project's **API Keys** page, or create one from the gateway Swagger at [http://localhost:8888/docs](http://localhost:8888/docs) (`POST /auth/key`). Put that key in `JUNO_API_KEY` if you need the dashboard to call file, email, or analytics routes as the project.

### Components 

This repository uses [shadcn/ui](https://ui.shadcn.com/) for streamlining component development.
