# Releasing

This document describes how maintainers publish a new version of `@deskbtm/react-native-bottom-sheet`.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** — breaking API or behavior changes
- **MINOR** — new features, backward compatible
- **PATCH** — bug fixes, backward compatible

## Pre-release checklist

1. Ensure `main` is green (CI passing).
2. Run locally:

   ```bash
   pnpm validate
   pnpm validate:example
   ```

3. Update `CHANGELOG.md`:
   - Move items from **Unreleased** into a new `[X.Y.Z] - YYYY-MM-DD` section.
   - Update comparison links at the bottom.
4. Bump `"version"` in root `package.json`.
5. Open a PR titled `chore(release): vX.Y.Z` with CHANGELOG + version bump only.
6. Merge after review.

## Publish to npm

### One-time setup

1. Create an npm access token with **Publish** scope for `@deskbtm`.
2. Add `NPM_TOKEN` to GitHub repository secrets (**Settings → Secrets → Actions**).

### Automated (recommended)

1. Create a GitHub Release from tag `vX.Y.Z` (must match `package.json` version).
2. The [Release workflow](./.github/workflows/release.yml) runs:
   - `pnpm validate`
   - `pnpm build`
   - `npm publish --access public`

### Manual fallback

```bash
pnpm validate
pnpm build
npm publish --access public
git tag vX.Y.Z
git push origin vX.Y.Z
```

## Post-release

1. Add a new empty **Unreleased** section at the top of `CHANGELOG.md` (if not already present).
2. Verify the package on npm: `npm view @deskbtm/react-native-bottom-sheet version`.

## Example app artifacts

CI uploads the example web export as a workflow artifact on every `main` push and PR. To deploy a hosted demo, download the `example-web` artifact from a green CI run or run:

```bash
pnpm validate:example
# output: example/dist/
```

Native example builds (iOS/Android) are not automated in CI — use EAS Build locally when needed.
