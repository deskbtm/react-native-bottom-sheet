# Provider layout options

`BottomSheetProvider` exposes three second-level props — `sheet`, `layout`, and `theme` — instead of a single `options` wrapper or the removed `defaultOptions` prop. `layout` carries all tunable physical parameters from `constants.ts` (springs, corner radius, host scale, gesture thresholds, detent fractions), grouped as `motion`, `presentation`, `push`, `stack`, `gestures`, `handle`, `scroll`, and `detents`. Partial `layout` values are deep-merged with `DEFAULT_LAYOUT_OPTIONS`.

`theme` is dynamic: prop changes (e.g. light/dark mode) apply immediately. `layout` is static: merged once at Provider mount so worklets capture stable primitives without SharedValue plumbing for every constant. Per-sheet behavior stays on `BottomSheetOptions` (`present()` / `BottomSheetModal`); layout is never overridable per sheet open because host physics are global.

## Considered Options

- **Top-level `options` object** — rejected; user preferred flat second-level props (`sheet` / `layout` / `theme`).
- **Runtime-mutable `layout`** — rejected; theme alone needs live updates; static layout keeps worklet integration simple.
- **`defaultOptions` deprecated alias** — rejected; breaking rename to `sheet` with no alias.

## Consequences

- Public exports: `BottomSheetLayoutOptions`, grouped sub-types, `DEFAULT_LAYOUT_OPTIONS`, `mergeLayoutOptions`. Raw `constants.ts` symbols stay internal.
- Engine, host, controller, and push/stack hooks read `mergedLayout` from the Provider instead of importing constants directly.
