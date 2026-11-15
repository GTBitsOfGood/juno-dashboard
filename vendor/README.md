# Temporary vendored juno-sdk

`juno-sdk` on npm is stuck at 0.0.11 (no access to the gtbitsofgood npm account).
juno-sdk main has unpublished work we need:

- [juno-sdk#79](https://github.com/GTBitsOfGood/juno-sdk/pull/79) credentials param on paginated analytics event queries
- [juno-sdk#81](https://github.com/GTBitsOfGood/juno-sdk/pull/81) email senders/domains

This tarball is an `npm pack` of juno-sdk at
`cab346c54f67481092c46edcdd5493b03e5f4e75` (current `main` as of 2026-11-12).
The SDK's `build/` output is gitignored and there is no install-time build script, so a
git dependency would not work on Netlify or a fresh local `bun install`.

## Revert once 0.0.12+ is on npm

1. In `package.json`, change the `juno-sdk` dependency back to `"^0.0.12"` (or the published version).
2. Run `bun install`.
3. Delete this `vendor/` directory.
