# Releasing

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions, changelogs, and npm publishes for `@deskbtm/react-native-bottom-sheet`.

## Day-to-day (contributors)

User-facing library changes should include a changeset in the PR:

```bash
pnpm changeset
```

Pick `patch`, `minor`, or `major`, write a short summary, and commit the generated file under `.changeset/`.

Skip changesets for docs-only, test-only, or example-only changes that do not affect the published package.

## Maintainer flow

### 1. Accumulate changesets on `main`

Each merged PR with a changeset adds a version bump proposal. No manual `package.json` or `CHANGELOG.md` edits are required.

### 2. Version PR (automated)

On every push to `main`, the [Release workflow](../.github/workflows/release.yml) runs `changesets/action`:

- If pending changesets exist → opens **Version Packages** PR (`chore(release): version packages`)
- That PR bumps `package.json`, updates `CHANGELOG.md`, and removes consumed changeset files

Review and merge the version PR.

### 3. Publish (automated)

When the version PR lands on `main`, the same workflow runs `pnpm release`:

1. `pnpm validate` (fmt, lint, test, build)
2. `changeset publish` → npm (`--provenance` via `publishConfig`)

### One-time setup

1. Create an npm access token with **Publish** scope for `@deskbtm`.
2. Add `NPM_TOKEN` to GitHub repository secrets (**Settings → Secrets → Actions**).
3. `GITHUB_TOKEN` is provided by Actions (used to open the version PR).

### Manual fallback

```bash
pnpm changeset version   # bump version + changelog locally
pnpm release             # validate + publish
git push --follow-tags
```

## Semver

Changesets maps bump types to [Semantic Versioning](https://semver.org/):

| Bump  | When                              |
| ----- | --------------------------------- |
| patch | Bug fixes, backward compatible    |
| minor | New features, backward compatible |
| major | Breaking API or behavior changes  |

## Post-release

Verify on npm:

```bash
npm view @deskbtm/react-native-bottom-sheet version
```

GitHub Releases are created automatically by `changeset publish` when tags are pushed.

## Example app

The `example/` workspace package is private and ignored by Changesets. It is not published to npm.

CI uploads the example Android APK on every `main` push and PR. Native example builds are not part of the release workflow.
