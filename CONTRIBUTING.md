# Contributing

Thanks for your interest in contributing to `@deskbtm/react-native-bottom-sheet`.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 LTS (see `.node-version`)
- [pnpm](https://pnpm.io/) 9.x (see `packageManager` in `package.json`)

## Setup

```bash
git clone https://github.com/deskbtm/react-native-bottom-sheet.git
cd bottom-sheet
pnpm install
```

## Development workflow

| Task                                      | Command                 |
| ----------------------------------------- | ----------------------- |
| Run unit tests (watch)                    | `pnpm test`             |
| Run unit tests (CI mode)                  | `pnpm test:ci`          |
| Lint module + example                     | `pnpm lint`             |
| Build `build/` output                     | `pnpm build`            |
| Full local validation                     | `pnpm validate`         |
| Start example app                         | `pnpm example`          |
| Validate example (typecheck + web export) | `pnpm validate:example` |

The example app lives in `example/`. Metro resolves the module from `src/` during local dev — no build step required for day-to-day work.

Run `pnpm build` before publishing or when you need compiled types in `build/`.

## Project layout

| Path                          | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| `src/bottom-sheet/`           | Library source                                  |
| `src/bottom-sheet/__tests__/` | Unit tests (next to source)                     |
| `example/`                    | Demo app (Demos + Debug tabs)                   |
| `docs/adr/`                   | Architecture decision records                   |
| `CONTEXT.md`                  | Domain glossary and performance track decisions |

See [ADR-0002](./docs/adr/0002-host-overlay-render-isolation.md) before changing host/overlay render behavior.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(bottom-sheet): add keyboard-aware push layout
fix(android): use icon.png for adaptive icon foreground
test: add stack fluency regression
docs: update CHANGELOG for v0.1.0
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`, `ci`, `build`.

## Pull requests

1. Fork and create a feature branch from `main`.
2. Make focused changes — one logical change per PR when possible.
3. Add or update unit tests for non-trivial logic changes.
4. Run `pnpm validate` and `pnpm validate:example` before opening the PR.
5. Update `CHANGELOG.md` under **Unreleased** for user-facing changes.
6. Fill out the PR template.

CI must pass before merge. See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

## Reporting issues

Use the [bug report template](https://github.com/deskbtm/react-native-bottom-sheet/issues/new?template=bug_report.yml) and include:

- Expo SDK / React Native versions
- Platform (iOS, Android, Web)
- Minimal reproduction steps
- Expected vs actual behavior

## Releases

Maintainers: see [RELEASING.md](./RELEASING.md).
