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
The app content rendered inside `BottomSheetHost` — navigation screens, `BottomSheetModal` slots, and other provider children. Render isolation applies only to nodes that do not subscribe to sheet stack state; `useBottomSheet()` callers may re-render on sheet lifecycle.
_Avoid_: app tree, children, host layer

**Protected host content**:
Host subtree nodes that do not call `useBottomSheet()`. Must not re-render on present, dismiss, or dismissAll. Typical example: a navigation screen or list page.
_Avoid_: host screen, app content

**Render isolation boundary**:
The Track A invariant: present, dismiss, and dismissAll must not commit React updates in protected host content. Theme and screen-dimension changes are explicit exceptions. `useBottomSheet()` subscribers (including `BottomSheetModal`) are intentionally excluded.
_Avoid_: perf boundary, lifecycle rule

**Overlay subtree**:
The sheet stack, backdrop, and letterbox rendered beside the host. It updates when sheets are presented or dismissed.
_Avoid_: overlay layer, modal tree

**Render cost**:
The React commit cost of opening or closing sheets — whether the Host subtree re-renders on present/dismiss. Primary performance track for this library (grill session, track A).
_Avoid_: performance, perf, optimization

**Gesture fluency**:
UI-thread motion quality during pan gestures and open/close springs — sheet and host stay in sync without JS-thread work on every frame. Track B scope: drag follow-through, transition springs, and minimizing `scheduleOnRN` during active gestures (scroll handoff is Track C).
_Avoid_: animation perf, smoothness

**UI-thread motion boundary**:
Track B invariant: pan `onUpdate` handlers must not call `scheduleOnRN`; `BottomSheetHost` `useAnimatedStyle` reads SharedValues and mount-static layout scalars only. JS bridges on gesture `onEnd` and spring completion are allowed.
_Avoid_: gesture boundary, worklet rule

**Sheet scroll fluency**:
Track C scope: scroll-to-pan handoff inside sheet content, keyboard avoidance, and list scrolling performance. Phase 1 covers handoff + keyboard + `BottomSheetFlatList`; native FlashList integration is a later phase.
_Avoid_: scroll perf, list performance

**Scroll handoff boundary**:
Track C invariant for library scrollables: when `scrollOffset ≤ offsetEpsilon`, content pan may drag the sheet; when above epsilon, the list scrolls. Handle pan always drags the sheet. Raw RN `ScrollView` is out of contract — use `BottomSheetScrollView` / `FlatList` / `SectionList`.
_Avoid_: scroll-pan rule, gesture handoff

**Stack scaling boundary**:
Track D invariant: host SharedValues (`bottomProgress`, `hostSheetTopY`) are driven by the bottom stack item only; buried sheets use local progress. All sheets stay mounted in the overlay until dismissed. iOS card inset/scale applies when both provider and sheet use `presentation` mode.
_Avoid_: stack perf, multi-sheet rule

**Performance scope**:
The library runtime performance contract covered by grill tracks A–D. Track E records explicit non-goals: app cold-start TTI, bundle-size budgets, expo-observe frame metrics, and consumer-side list virtualization beyond the library scrollables API.
_Avoid_: perf scope, optimization scope

## Performance tracks (grill session)

| Track     | Focus                                                                       | Status       |
| --------- | --------------------------------------------------------------------------- | ------------ |
| **A**     | React render cost — Host must not re-render on present/dismiss              | **Selected** |
| **A‑Q2**  | Render isolation boundary — sheet lifecycle only; theme/dimensions exempt   | **Selected** |
| **A‑Q3**  | Protected host content only; `useBottomSheet()` subscribers may re-render   | **Selected** |
| **A‑Q4**  | Verification — Jest regression test + example `__DEV__` render probe        | **Selected** |
| **A‑Q5**  | Coverage — all modes + stack/dismissAll + theme re-render negative case     | **Selected** |
| **A‑Q6**  | Done when — Jest green + example probe + ADR/README doc sync                | **Selected** |
| **A‑Q7**  | Example probe — Home badge + Settings detail debug page                     | **Selected** |
| **A‑Q8**  | Implementation order — Jest tests first, then example probe + docs          | **Selected** |
| **A‑Q9**  | Provider tests — full integration; sync dismiss completion via mocks        | **Selected** |
| **A‑Q10** | Doc sync — ADR-0002 consequences + README architecture summary              | **Selected** |
| **B**     | Animation/gesture fluency — drag, open/close springs, minimal JS bridge     | **Selected** |
| **B‑Q1**  | Scope — drag follow-through + open/close + scheduleOnRN minimization (D)    | **Selected** |
| **B‑Q2**  | Verification — static invariant tests + example gesture debug section       | **Selected** |
| **B‑Q3**  | Static invariants — pan onUpdate + Host useAnimatedStyle UI-thread only     | **Selected** |
| **B‑Q4**  | Example UI — Gesture fluency section on Settings debug page                 | **Selected** |
| **B‑Q5**  | Done when — tests green + Settings section + docs; fix if tests fail        | **Selected** |
| **B‑Q6**  | Doc sync — ADR-0002 consequences + README architecture summary              | **Selected** |
| **B‑Q7**  | Implementation order — static invariant Jest first, then Settings + docs    | **Selected** |
| **C**     | Sheet scroll — scroll/pan handoff, keyboard, long lists (phased)            | **Selected** |
| **C‑Q1**  | Scope — A+B+C packaged; FlashList perf deferred to later phase              | **Selected** |
| **C‑Q2**  | Scroll/pan boundary — epsilon handoff + handle always + library scrollables | **Selected** |
| **C‑Q3**  | Verification — unit/static tests + Settings scroll checklist                | **Selected** |
| **C‑Q4**  | Static invariants — handoff + scrollOffset write + handle independent       | **Selected** |
| **C‑Q5**  | Done when — tests green + Settings section + docs; fix if tests fail        | **Selected** |
| **C‑Q6**  | Doc sync — ADR-0002 consequences + README scroll contract                   | **Selected** |
| **C‑Q7**  | Implementation order — static invariant Jest first, then Settings + docs    | **Selected** |
| **D**     | Multi-sheet stack — host sync, mount policy, render isolation at depth      | **Selected** |
| **D‑Q1**  | Scope — bottom drives host + all mounted + Track A holds for N sheets       | **Selected** |
| **D‑Q2**  | No stack depth cap in Phase 1; test depth 3; document memory tradeoff       | **Selected** |
| **D‑Q3**  | Verification — static invariants + Provider 3-stack test + Settings section | **Selected** |
| **D‑Q4**  | Static invariants — StackItem progress + OverlayHost index-0 sync + map all | **Selected** |
| **D‑Q5**  | Done when — tests green + Settings section + docs; fix if tests fail        | **Selected** |
| **D‑Q6**  | Doc sync — ADR-0002 consequences + README stack contract                    | **Selected** |
| **D‑Q7**  | Implementation order — static invariant Jest first, then Settings + docs    | **Selected** |
| **E**     | Performance scope closure — document non-goals; meta test for A–D suites    | **Selected** |
| **E‑Q1**  | Scope — non-goals doc (bundle, TTI, observe, FlashList native, app jank)    | **Selected** |
| **E‑Q2**  | No CI bundle/TTI budgets in Phase 1                                         | **Selected** |
| **E‑Q3**  | README Performance section + track index                                    | **Selected** |
| **E‑Q4**  | Meta test — `performanceTracks.test.ts` guards A–D suite files exist        | **Selected** |
| **E‑Q5**  | Done when — README + CONTEXT + ADR non-goals + Settings index               | **Selected** |
| **E‑Q6**  | Doc sync — ADR-0002 non-goals + README (no new ADR)                         | **Selected** |
| **E‑Q7**  | Implementation order — docs + meta test first                               | **Selected** |
