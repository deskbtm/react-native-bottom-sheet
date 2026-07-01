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
