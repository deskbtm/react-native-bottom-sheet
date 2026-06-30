# @deskbtm-rn/bottom-sheet

Gorhom-like bottom sheet for React Native (Expo). Supports iOS-style `presentation` mode, `push` layout, and standard `modal` overlay.

## Platforms

- iOS
- Android
- Web

## Install

```bash
pnpm add @deskbtm-rn/bottom-sheet
```

Peer dependencies: `expo`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-keyboard-controller`, `react-native-safe-area-context`, `react-native-worklets`.

Wrap your app root:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetProvider, useBottomSheet } from "@deskbtm-rn/bottom-sheet";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider preload={false}>
          <BottomSheetProvider mode="presentation">{/* your app */}</BottomSheetProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

## Development

This repo is an [Expo module](https://docs.expo.dev/modules/overview/) scaffold with an example app.

```bash
cd bottom-sheet
pnpm install
pnpm build

# Start the example app (iOS / Android / Web)
cd example
pnpm start
pnpm ios      # or pnpm android / pnpm web
```

From the module root you can also use:

```bash
pnpm open:ios
pnpm open:android
```

## Native module

Android package: `com.deskbtm.rn.bottomsheet` (Java package names cannot contain hyphens).

iOS module: `BottomSheetModule`.

The UI is implemented in TypeScript; native stubs exist for Expo autolinking on all platforms including web.

## Tests

```bash
pnpm test
```
