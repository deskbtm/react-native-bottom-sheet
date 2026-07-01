# Bottom Sheet

React Native bottom sheet library with iOS-style presentation, push layout, and modal overlay modes.

## Language

**Sheet options**:
Per-sheet behavior when a sheet opens — snap points, keyboard handling, pan gestures, and per-sheet theme overrides. Type: `BottomSheetOptions`. Passed as the `sheet` prop on `BottomSheetProvider`; same shape passed to each `present()` call.
_Avoid_: defaultOptions

**Layout options**:
Provider-wide physical parameters passed as the `layout` prop on `BottomSheetProvider`. Grouped as `motion`, `presentation`, `push`, `stack`, `gestures`, `handle`, `scroll`, and `detents`. Defaults come from `constants.ts` via `DEFAULT_LAYOUT_OPTIONS`. Partial values are deep-merged with defaults. Read once at Provider mount; not updated if the prop changes later.
_Avoid_: config, constants, engine options

**Theme**:
Color and opacity values for the sheet panel, letterbox, scrim, and handle. Passed as the `theme` prop on `BottomSheetProvider`; updates when the prop changes (e.g. light/dark mode). Can also be overridden per sheet via sheet options.
_Avoid_: styling, appearance config

**DEFAULT_LAYOUT_OPTIONS**:
The fully merged default layout configuration object, built from `constants.ts`. Exported for documentation and typing; consumers override via the `layout` prop with deep partial merge.
_Avoid_: constants, DEFAULT_CONFIG

**Host subtree**:
The app content rendered inside `BottomSheetHost` — navigation screens and other provider children. It must not re-render when sheets open or close; only provider-level changes (such as theme or screen dimensions) may update it.
_Avoid_: app tree, children, host layer

**Overlay subtree**:
The sheet stack, backdrop, and letterbox rendered beside the host. It updates when sheets are presented or dismissed.
_Avoid_: overlay layer, modal tree
