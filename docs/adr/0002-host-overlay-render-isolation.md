# Host / overlay render isolation

The library splits the React tree into a **Host subtree** (app content inside `BottomSheetHost`) and an **Overlay subtree** (sheet stack, backdrop, letterbox). Sheet presentation must not re-render the Host subtree; only the Overlay subtree and `useBottomSheet()` subscribers may update when sheets open or close. Host transforms stay on Reanimated SharedValues so presentation/push motion does not require React commits on the app layer.

Provider-level changes — `theme` prop updates and screen dimension changes — may re-render the Host subtree because letterbox and root background colors are dynamic. `layout` remains mount-static (see ADR-0001) and is not a reason to re-render on every sheet operation.

## Considered Options

- **Single Context for host + sheet** — rejected; sheet content renders in the overlay layer, not under the same Provider child tree; merging contexts would break stack semantics or force app-wide re-renders.
- **Zero React updates on present/dismiss** — rejected; `useBottomSheet()` intentionally subscribes to stack snapshots via `useSyncExternalStore`.
- **Split HostShell props instead of passing `engine`** — implemented; HostShell receives SharedValues and layout scalars so `memo` is not invalidated by unrelated `engine` identity changes (e.g. theme updates that only affect overlay colors).

## Consequences

- `BottomSheetHostShell` stays `memo`’d and must not subscribe to sheet stack state.
- Overlay content context values must be referentially stable across parent re-renders when controller fields are unchanged.
- OverlayHost binds sheet state once via a stable `bindSheetState` callback, not via the whole `engine` object identity.
- **Protected host content** (no `useBottomSheet()` subscription) must not re-render on sheet lifecycle; this is enforced by `BottomSheetProvider.test.tsx` (presentation, push, modal, stack, dismissAll) and documented in `CONTEXT.md`.
- **Allowed re-renders:** `useBottomSheet()` subscribers; theme and screen-dimension changes (see negative tests in `BottomSheetProvider.test.tsx`).
- Example app: Demos tab badge + Debug tab panel (`__DEV__`) for manual verification.
- **Gesture fluency (Track B):** pan `onUpdate` handlers in `useBottomSheetController` must not call `scheduleOnRN`; host transforms in `BottomSheetHost` use `useAnimatedStyle` with SharedValues only. Enforced by `gestureFluency.test.tsx` (static source invariants). Debug tab includes a manual drag checklist (`__DEV__`).
- **Sheet scroll (Track C):** `contentPanGesture` fails when `scrollOffset > scroll.offsetEpsilon`; `handlePanGesture` ignores scroll offset. Library scrollables (`BottomSheetScrollables.tsx`) write `scrollOffset` via `useAnimatedScrollHandler`. Raw RN scroll views are out of contract. Enforced by `sheetScrollFluency.test.tsx` and `useBottomSheetKeyboard.test.tsx`. Debug tab includes scroll/keyboard checklist (`__DEV__`). `BottomSheetFlashList` aliases FlatList until native FlashList is adopted.
- **Multi-sheet stack (Track D):** bottom stack item drives `bottomProgress` / `hostSheetTopY`; buried items use local `stackedProgress`. `BottomSheetOverlayHost` maps all sheets (no unmount-on-bury). Protected host content stays stable at depth 3+ (`BottomSheetProvider.test.tsx`). Enforced by `sheetStackFluency.test.tsx`. No stack depth cap in Phase 1 — document memory cost of mounted overlays.

## Non-goals (Track E)

- App cold-start / time-to-interactive budgets for the host app
- Bundle-size CI gates for `@deskbtm/react-native-bottom-sheet`
- expo-observe / Instruments frame-rate metrics in this repo
- Native `@shopify/flash-list` wiring (`BottomSheetFlashList` remains a FlatList alias until adopted)
- General example-app jank profiling beyond the Debug tab checklists
