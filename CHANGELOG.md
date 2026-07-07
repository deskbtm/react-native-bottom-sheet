# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

New versions are managed with [Changesets](https://github.com/changesets/changesets); see [docs/releasing.md](./docs/releasing.md).

## [Unreleased]

### Added

- GitHub Actions CI (lint, test, build, example web export).
- `CONTRIBUTING.md`, `docs/releasing.md`, and issue/PR templates.

### Changed

- Package renamed from `@deskbtm-rn/bottom-sheet` to `@deskbtm/react-native-bottom-sheet`.
- Example app reorganized into **Demos** and **Debug** tabs.
- Example debug hub moved from Settings modal to Debug tab.

## [0.0.1] - 2026-03-29

### Added

- Initial `@deskbtm/react-native-bottom-sheet` Expo module with `presentation`, `push`, and `modal` modes.
- Imperative `present()` API and declarative `BottomSheetModal`.
- Library scrollables (`BottomSheetScrollView`, `BottomSheetFlatList`, `BottomSheetSectionList`).
- Keyboard-aware sheet layout via `react-native-keyboard-controller`.
- Multi-sheet stack with iOS card stacking in presentation mode.
- Performance regression suites for render isolation, gesture fluency, scroll handoff, and stack behavior.
- Example app with categorized demos and dev-only performance debug panel.

[Unreleased]: https://github.com/deskbtm/react-native-bottom-sheet/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/deskbtm/react-native-bottom-sheet/releases/tag/v0.0.1
