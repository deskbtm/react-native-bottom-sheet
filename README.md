# @deskbtm/react-native-bottom-sheet

[![CI](https://github.com/deskbtm/react-native-bottom-sheet/actions/workflows/ci.yml/badge.svg)](https://github.com/deskbtm/react-native-bottom-sheet/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@deskbtm/react-native-bottom-sheet)](https://www.npmjs.com/package/@deskbtm/react-native-bottom-sheet)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

React Native bottom sheet built around two first-class host layouts: **presentation** scales and letterboxes the app like an iOS sheet modal, and **push** lifts the entire host behind the sheet with rounded corners and side insets. Also supports **modal** overlay, snap points, keyboard handling, and scroll-to-pan handoff.

**Platforms:** iOS · Android · Web

https://github.com/user-attachments/assets/88fd0a40-5407-4715-8aed-8ec8fe6c9d23

## Features

- **Presentation mode** — iOS-style host scale + letterbox; stacked card peek when multiple sheets open
- **Push mode** — custom host lift layout: app slides up behind the sheet with matched corner radius and horizontal inset
- **Modal mode** — classic dimmed scrim overlay; app stays full size
- **Imperative & declarative APIs** — `useBottomSheet().present()` and `BottomSheetModal`
- **Snap points** — presets (`medium`, `large`, `full`), percentages (`'50%'`), or fractions
- **Scroll handoff** — `BottomSheetScrollView`, `BottomSheetFlatList`, `BottomSheetSectionList`
- **Keyboard-aware** — `BottomSheetTextInput` + `keyboardBehavior: 'interactive'`
- **Multi-sheet stack** — iOS card stacking in presentation mode
- **Dynamic sizing** — `enableDynamicSizing` for content-driven height

## Table of contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
  - [Imperative `present()`](#imperative-present)
  - [Declarative `BottomSheetModal`](#declarative-bottomsheetmodal)
  - [Presentation modes](#presentation-modes)
  - [Scrollable content](#scrollable-content)
  - [Keyboard](#keyboard)
  - [Stacking sheets](#stacking-sheets)
  - [Sheet content & navigation theme](#sheet-content--navigation-theme)
- [API reference](#api-reference)
- [Example app](#example-app)
- [Architecture & performance](#architecture--performance)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

### From npm

```bash
npm install @deskbtm/react-native-bottom-sheet
# or
pnpm add @deskbtm/react-native-bottom-sheet
# or
yarn add @deskbtm/react-native-bottom-sheet
```

### From GitHub

Install a branch, tag, or commit directly from the repository. The `prepare` script compiles TypeScript during install (npm installs devDependencies for git dependencies by default).

```bash
npm install github:deskbtm/react-native-bottom-sheet
# pin a ref
npm install github:deskbtm/react-native-bottom-sheet#main
npm install github:deskbtm/react-native-bottom-sheet#v0.0.1

pnpm add github:deskbtm/react-native-bottom-sheet
yarn add github:deskbtm/react-native-bottom-sheet
```

Use the `git+https://` form if your Git is configured to rewrite HTTPS URLs to SSH:

```bash
npm install "git+https://github.com/deskbtm/react-native-bottom-sheet.git#main"
```

Install peer dependencies (Expo projects):

```bash
npx expo install react-native-gesture-handler react-native-reanimated \
  react-native-keyboard-controller react-native-safe-area-context react-native-worklets
```

| Peer dependency                    | Purpose                 |
| ---------------------------------- | ----------------------- |
| `expo`                             | Expo module autolinking |
| `react-native-gesture-handler`     | Pan gestures            |
| `react-native-reanimated`          | UI-thread animations    |
| `react-native-keyboard-controller` | Keyboard avoidance      |
| `react-native-safe-area-context`   | Safe area insets        |
| `react-native-worklets`            | Reanimated worklets     |

**Worklets Babel plugin (Reanimated 4):** Reanimated 4 depends on [`react-native-worklets`](https://docs.swmansion.com/react-native-worklets/). The actual Babel plugin is **`react-native-worklets/plugin`** ([Reanimated getting started](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)); `react-native-reanimated/plugin` is a re-export of the same plugin.

- **Expo (`babel-preset-expo`):** SDK 50+ auto-injects the worklets plugin when `react-native-worklets` is installed — no manual `babel.config.js` entry required for a default setup.
- **React Native Community CLI:** add `'react-native-worklets/plugin'` as the **last** Babel plugin.

The **example app** in this repo enables [Worklets Bundle Mode](https://docs.swmansion.com/react-native-worklets/docs/bundleMode/setup/) (`bundleMode: true` in `example/babel.config.js` + `getBundleModeMetroConfig` in `example/metro.config.js`). After changing Babel/Metro config, clear the cache: `pnpm --filter bottom-sheet-example start -- --reset-cache`.

## Setup

Wrap your app root with the required providers, then add `BottomSheetProvider`:

```tsx
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetProvider } from '@deskbtm/react-native-bottom-sheet';

export function App() {
	const theme = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<KeyboardProvider preload={false}>
					<BottomSheetProvider
						mode="presentation"
						layout={{ presentation: { cornerRadius: 32 } }}
					>
						<Navigation theme={theme} />
					</BottomSheetProvider>
				</KeyboardProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
```

> **React Navigation theme:** Pass `theme` to your navigator so screens get an opaque `colors.background`. In `presentation` mode this keeps the host page visible behind the sheet (only the letterbox bars are black). Without a theme or explicit screen background, host views may appear transparent.

## Usage

### Imperative `present()`

Call `present()` from any component inside `BottomSheetProvider`:

```tsx
import { Pressable, Text, View } from 'react-native';
import { useBottomSheet } from '@deskbtm/react-native-bottom-sheet';

function HomeScreen() {
	const { present, dismiss, dismissAll, isPresented } = useBottomSheet();

	return (
		<View>
			<Pressable
				onPress={() =>
					present(
						<View style={{ padding: 24 }}>
							<Text>Sheet content</Text>
						</View>,
						{
							snapPoints: ['40%', '85%'],
							index: 0,
							enablePanDownToClose: true,
						},
					)
				}
			>
				<Text>Open sheet</Text>
			</Pressable>

			<Pressable onPress={() => dismiss()}>
				<Text>Dismiss top</Text>
			</Pressable>
			<Pressable onPress={() => dismissAll()}>
				<Text>Dismiss all</Text>
			</Pressable>
		</View>
	);
}
```

`present()` returns a sheet id. Pass it to `dismiss(id)` to close a specific sheet.

### Declarative `BottomSheetModal`

Mount once, open with a ref — useful for sheets tied to a screen lifecycle:

```tsx
import { useRef } from 'react';
import { Button } from 'react-native';
import {
	BottomSheetModal,
	BottomSheetScrollView,
	type BottomSheetModalRef,
} from '@deskbtm/react-native-bottom-sheet';

function ProfileScreen() {
	const sheetRef = useRef<BottomSheetModalRef>(null);

	return (
		<>
			<Button title="Edit profile" onPress={() => sheetRef.current?.present()} />

			<BottomSheetModal
				ref={sheetRef}
				sheetId="edit-profile"
				snapPoints={['40%', '90%']}
				index={0}
				keyboardBehavior="interactive"
				onDismiss={() => console.log('closed')}
			>
				<BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
					{/* sheet body */}
				</BottomSheetScrollView>
			</BottomSheetModal>
		</>
	);
}
```

Ref methods: `present`, `dismiss`, `close`, `forceClose`, `dismissAll`, `snapToIndex`, `expand`, `collapse`.

### Presentation modes

Override per sheet with `mode` in options, or set a default on the provider:

| Mode           | Behavior                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `presentation` | iOS-style: host scales down, letterbox bars, stacked card peek                                   |
| `modal`        | Standard overlay with dimmed scrim; host stays full size                                         |
| `push`         | Host-lift layout: sheet pushes the app away with matched corner radius and side inset (default: bottom-up) |

```tsx
// Push mode — host slides up with the sheet (default bottom-up)
present(<PushSheetContent />, {
	mode: 'push',
	snapPoints: ['35%', '70%', 'full'],
	index: 0,
});

// Top-down push — sheet enters from the top; handle renders at the sheet bottom
present(<PushSheetContent />, {
	mode: 'push',
	pushDirection: 'top',
	snapPoints: ['35%', '70%', 'full'],
	index: 0,
});

// Modal mode — flat overlay
present(<ModalContent />, {
	mode: 'modal',
	snapPoints: ['45%'],
	scrimColor: 'rgba(0,0,0,0.45)',
	dismissOnScrimPress: true,
});
```

### Scrollable content

Use library scrollables inside sheets — **raw React Native `ScrollView` / `FlatList` do not participate in scroll-to-pan handoff**:

```tsx
import {
	BottomSheetScrollView,
	BottomSheetFlatList,
	BottomSheetTextInput,
	useBottomSheetContent,
} from '@deskbtm/react-native-bottom-sheet';

function ScrollableSheet() {
	const { close, expand, collapse } = useBottomSheetContent();

	return (
		<BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
			<BottomSheetTextInput
				placeholder="Type here"
				style={{ borderWidth: 1, padding: 12 }}
			/>
			{/* rows… */}
		</BottomSheetScrollView>
	);
}

// Open with content panning enabled
present(<ScrollableSheet />, {
	snapPoints: ['50%', '90%'],
	enableContentPanningGesture: true,
});
```

Available content primitives:

| Export                   | Use for                      |
| ------------------------ | ---------------------------- |
| `BottomSheetView`        | Static layout                |
| `BottomSheetScrollView`  | Scrollable content           |
| `BottomSheetFlatList`    | Long lists                   |
| `BottomSheetSectionList` | Sectioned lists              |
| `BottomSheetFlashList`   | Currently aliases `FlatList` |
| `BottomSheetTextInput`   | Keyboard-aware input         |

Inside sheet content, use `useBottomSheetContent()` for `close`, `expand`, `collapse`, and animated values.

### Keyboard

Pair `BottomSheetTextInput` with interactive keyboard behavior:

```tsx
present(<FormSheet />, {
	snapPoints: ['50%', '90%'],
	keyboardBehavior: 'interactive',
	keyboardBlurBehavior: 'restore',
});
```

| `keyboardBehavior` | Effect                                     |
| ------------------ | ------------------------------------------ |
| `interactive`      | Sheet tracks keyboard while typing         |
| `fillParent`       | Sheet fills available space above keyboard |
| `extend`           | Extends sheet height when keyboard opens   |

### Stacking sheets

Each `present()` pushes another sheet onto the overlay stack. Host motion follows the **bottom** sheet (index 0), including its `pushDirection` when `mode: 'push'`. In `presentation` mode, buried sheets show iOS-style card inset and scale.

```tsx
present(<SheetA />, { snapPoints: ['30%'] });
present(<SheetB />, { snapPoints: ['45%'] });
// dismiss() removes SheetB; SheetA becomes interactive again
```

### Sheet content & navigation theme

Sheet bodies render in the **overlay subtree**, outside `NavigationContainer`. Do **not** use `@react-navigation/elements` (`Text`, `Button`, etc.) inside `present()` content — they require a navigation theme context. Use React Native components instead.

Screens **inside** your navigator can still use navigation UI components normally.

## API reference

### `BottomSheetProvider`

| Prop     | Type                                  | Default          | Description                                            |
| -------- | ------------------------------------- | ---------------- | ------------------------------------------------------ |
| `mode`   | `'presentation' \| 'modal' \| 'push'` | `'presentation'` | Default host mode for all sheets                       |
| `sheet`  | `BottomSheetOptions`                  | —                | Default options merged into every sheet                |
| `layout` | `Partial<BottomSheetLayoutOptions>`   | —                | Motion, gestures, detents, handle (read once at mount) |
| `theme`  | `BottomSheetTheme`                    | —                | Default colors (sheet, letterbox, handle, scrim)       |

### `useBottomSheet()`

| Property / method            | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| `present(content, options?)` | Push sheet content onto the stack; returns sheet id |
| `dismiss(sheetId?)`          | Dismiss top sheet, or a specific id                 |
| `dismissAll()`               | Dismiss entire stack                                |
| `isPresented`                | Whether any sheet is open                           |
| `presentedSheetCount`        | Number of sheets in the stack                       |
| `topSheetController`         | Imperative control for the top sheet                |

### Common `BottomSheetOptions`

| Option                        | Type                                                    | Description                                      |
| ----------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `snapPoints`                  | `('medium' \| 'large' \| 'full' \| number \| string)[]` | Detent heights                                   |
| `index`                       | `number`                                                | Initial snap index                               |
| `mode`                        | `BottomSheetMode`                                       | Override provider default                        |
| `enableDynamicSizing`         | `boolean`                                               | Size sheet to content height                     |
| `enablePanDownToClose`        | `boolean`                                               | Allow drag-to-dismiss                            |
| `enableContentPanningGesture` | `boolean`                                               | Drag sheet from scrollable content at scroll top |
| `dismissOnScrimPress`         | `boolean`                                               | Tap backdrop to dismiss                          |
| `scrimColor`                  | `string`                                                | Backdrop color                                   |
| `keyboardBehavior`            | `'interactive' \| 'fillParent' \| 'extend'`             | Keyboard interaction                             |
| `showHandle`                  | `boolean`                                               | Show drag handle                                 |
| `onDismiss`                   | `() => void`                                            | Called after dismiss animation                   |
| `onChange`                    | `(index: number) => void`                               | Called when snap index changes                   |

Full types are exported from the package entry point.

## Example app

```bash
git clone https://github.com/deskbtm/react-native-bottom-sheet.git
cd bottom-sheet
pnpm install
cd example
pnpm start        # Metro — resolves module from ../src
pnpm ios          # or pnpm android / pnpm web
```

The example has two tabs:

| Tab       | Purpose                                                                           |
| --------- | --------------------------------------------------------------------------------- |
| **Demos** | Feature showcase by API category (`present`, `BottomSheetModal`, modes, backdrop) |
| **Debug** | Manual performance verification (`__DEV__` only)                                  |

## Architecture & performance

Sheet state lives in the **overlay subtree** (stack, backdrop, letterbox). **Protected host content** — screens that do not call `useBottomSheet()` — should not re-render on `present`, `dismiss`, or `dismissAll`. Host motion uses Reanimated SharedValues on the UI thread.

**Worklets:** Provider `layout` is merged once at mount ([ADR-0001](./docs/adr/0001-provider-layout-options.md)); animated code captures flat layout scalars (`workletLayout.ts`), not live nested objects. Pan `onUpdate` handlers stay on the UI thread (no `scheduleOnRN` / `runOnJS`); JS bridges run on gesture `onEnd` and spring completion only (Track B).

| Track | Focus                       | Tests                          |
| ----- | --------------------------- | ------------------------------ |
| **A** | Host render isolation       | `BottomSheetProvider.test.tsx` |
| **B** | UI-thread pan / host motion | `gestureFluency.test.ts`       |
| **C** | Scroll-to-pan handoff       | `sheetScrollFluency.test.ts`   |
| **D** | Multi-sheet stack           | `sheetStackFluency.test.ts`    |

Details: [ADR-0002](./docs/adr/0002-host-overlay-render-isolation.md) · [CONTEXT.md](./CONTEXT.md)

## Development

This repo is an [Expo module](https://docs.expo.dev/modules/overview/) with a workspace example app.

```bash
pnpm test              # unit tests (watch locally)
pnpm test:ci           # single run (CI)
pnpm validate          # lint + test + build
pnpm validate:example  # example typecheck + web export
pnpm build             # compile build/ (runs automatically on publish)
```

From the module root:

```bash
pnpm open:ios
pnpm open:android
```

Native stubs: Android `com.deskbtm.rn.bottomsheet`, iOS `BottomSheetModule`. UI is TypeScript; native code exists for Expo autolinking.

## Contributing

Contributions welcome. Please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md) — setup, commits, PR checklist
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [docs/releasing.md](./docs/releasing.md) — maintainer release process
- [SECURITY.md](./SECURITY.md) — vulnerability reporting

## License

[MIT](./LICENSE) © [nawbc](https://github.com/nawbc)
