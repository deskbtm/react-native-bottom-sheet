# @deskbtm/react-native-bottom-sheet

[![CI](https://github.com/nawbc/bottom-sheet/actions/workflows/ci.yml/badge.svg)](https://github.com/nawbc/bottom-sheet/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@deskbtm/react-native-bottom-sheet)](https://www.npmjs.com/package/@deskbtm/react-native-bottom-sheet)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Gorhom-like bottom sheet for React Native (Expo). Supports iOS-style `presentation` mode, `push` layout, and standard `modal` overlay.

## Platforms

- iOS
- Android
- Web

## Install

```bash
pnpm add @deskbtm/react-native-bottom-sheet
```

Peer dependencies: `expo`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-keyboard-controller`, `react-native-safe-area-context`, `react-native-worklets`.

Wrap your app root. With React Navigation, pass `theme` so each screen gets an opaque `colors.background` — this keeps the host page visible in `presentation` mode (only the letterbox bars are black):

```tsx
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetProvider } from "@deskbtm/react-native-bottom-sheet";

export function App() {
  const theme = useColorScheme() === "dark" ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider preload={false}>
          <BottomSheetProvider mode="presentation" layout={{ presentation: { cornerRadius: 32 } }}>
            <Navigation theme={theme} />
          </BottomSheetProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

Without a navigation theme (or an explicit screen background), host views stay transparent and the black letterbox shows through the entire page.

## Development

This repo is an [Expo module](https://docs.expo.dev/modules/overview/) scaffold with an example app.

```bash
cd bottom-sheet
pnpm install

# Start the example app (iOS / Android / Web)
# Metro resolves `react-native` → `src/index.ts`; no build step for local dev.
cd example
pnpm start
pnpm ios      # or pnpm android / pnpm web
```

Run `pnpm build` before publishing or when you need `build/` types for non-Metro tooling. `prepublishOnly` runs the build automatically on `npm publish`.

From the module root you can also use:

```bash
pnpm open:ios
pnpm open:android
```

## Native module

Android package: `com.deskbtm.rn.bottomsheet` (Java package names cannot contain hyphens).

iOS module: `BottomSheetModule`.

The UI is implemented in TypeScript; native stubs exist for Expo autolinking on all platforms including web.

## Architecture

Sheet state lives in the **overlay subtree** (stack, backdrop, letterbox). **Protected host content** — screens that do not call `useBottomSheet()` — must not re-render on `present`, `dismiss`, or `dismissAll`. Host motion uses Reanimated SharedValues on the UI thread. Components that subscribe via `useBottomSheet()` (including `BottomSheetModal` slots) may re-render when the stack changes.

Theme and screen-dimension updates may re-render the host. See [ADR-0002](./docs/adr/0002-host-overlay-render-isolation.md) for rationale and regression tests.

The example app has two tabs: **Demos** (feature showcase by API category) and **Debug** (manual performance verification for tracks A–D, `__DEV__` only). A **Protected host renders** badge appears on the Demos tab in development.

## Performance

Runtime guarantees for this library are grouped into tracks A–D (see `CONTEXT.md`). CI runs the regression suites listed in `performanceTracks.test.ts`.

| Track | Focus                                                        | Regression tests                                                |
| ----- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| **A** | Protected host content must not re-render on sheet lifecycle | `BottomSheetProvider.test.tsx`                                  |
| **B** | Pan/host motion stays on the UI thread during drag           | `gestureFluency.test.ts`                                        |
| **C** | Library scrollables participate in scroll-to-pan handoff     | `sheetScrollFluency.test.ts`, `useBottomSheetKeyboard.test.tsx` |
| **D** | Bottom stack item drives host; all sheets stay mounted       | `sheetStackFluency.test.ts`, `BottomSheetProvider.test.tsx`     |

**Gesture fluency (B):** no `scheduleOnRN` during pan `onUpdate`; host `useAnimatedStyle` reads SharedValues only.

**Sheet scroll (C):** use `BottomSheetScrollView`, `BottomSheetFlatList`, or `BottomSheetSectionList` — raw RN scroll views are not supported. Handle pan always drags the sheet; content pan yields when `scrollOffset > offsetEpsilon`. Pair `BottomSheetTextInput` with `keyboardBehavior: 'interactive'`.

**Multi-sheet stack (D):** each `present()` mounts another overlay item; host motion follows the bottom sheet. Presentation stacks get iOS card inset/scale on buried sheets.

**Out of scope (Track E):** app cold-start / TTI budgets, bundle-size CI gates, expo-observe frame metrics, native `@shopify/flash-list` integration, and general example-app profiling. Address those in the host app, not this package.

## Tests

```bash
pnpm test          # watch mode locally
pnpm test:ci       # single run (CI)
pnpm validate      # lint + test:ci + build
pnpm validate:example  # example typecheck + web export
```

CI runs on every push and pull request to `main`. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CHANGELOG.md](./CHANGELOG.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Release process for maintainers: [RELEASING.md](./RELEASING.md).
