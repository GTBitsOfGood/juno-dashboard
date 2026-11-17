# Temporary vendored juno-sdk

`juno-sdk` on npm is stuck at 0.0.11 (no access to the gtbitsofgood npm account).
juno-sdk main has unpublished work we need:

- [juno-sdk#79](https://github.com/GTBitsOfGood/juno-sdk/pull/79) credentials param on paginated analytics event queries
- [juno-sdk#81](https://github.com/GTBitsOfGood/juno-sdk/pull/81) email senders/domains
- [juno-sdk#88](https://github.com/GTBitsOfGood/juno-sdk/pull/88) file providers by config id
- [juno-sdk#85](https://github.com/GTBitsOfGood/juno-sdk/pull/85) `*API` wrappers renamed to `*Client` (old names kept as deprecated aliases)

This tarball is an `npm pack` of juno-sdk at
`c176a0a6b3d7c2c9dfb133f5b5feb5473ed2715a` (current `main` as of 2026-11-17, after #88 merged).
The SDK's `build/` output is gitignored and there is no install-time build script, so a
git dependency would not work on Netlify or a fresh local `bun install`.

## Revert once 0.0.12+ is on npm

1. In `package.json`, change the `juno-sdk` dependency back to `"^0.0.12"` (or the published version).
2. Run `bun install`.
3. Delete this `vendor/` directory.
