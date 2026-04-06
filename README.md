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

# Project Description

This is the dashboard code for easily interacting with [Juno](https://github.com/GTBitsOfGood/juno), [Bits of Good](https://bitsofgood.org/)'s central microservice architecture. See the main repository for more details.

## Prequisites

- [Bun](https://bun.sh/docs/installation)

## Getting Started

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

### Setting up Environment for File or Email Configurations

In order to be authorized locally for file or email configurations, you must change your `.env` `JUNO_API_KEY`.

First, ensure that you have the `JUNO_BASE_URL=http://localhost:8888`.

Second, you'll need to start juno, then visit `localhost:8888/docs#` in your browser. This should bring you to the juno docs page. You will want to scroll down to `/auth/key` path, and click it and then click 'try it out'.

Now, you should be able to enter API request fields. The username and password should be `test-superadmin@test.com` and `test-password`. For the POST request body,

```json
{
  "description": "string",
  "environment": "string",
  "project": {
    "name": "test-seed-project"
  }
}
```

or if you are using a different project, then replace with that project name.

### Components

This repository uses [shadcn/ui](https://ui.shadcn.com/) for streamlining component development.
