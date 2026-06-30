import type { GestureType } from 'react-native-gesture-handler';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Host presentation style for bottom sheets.
 *
 * - `presentation` — iOS-style: scales the app behind the sheet, letterbox, stacked card peek.
 * - `modal` — standard overlay: app stays full size, dimmed scrim, flat stacked sheets.
 * - `push` — translates the entire app upward by the sheet height with rounded corners and a gap; no scale.
 */
export type BottomSheetMode = 'presentation' | 'modal' | 'push';

/** Built-in snap heights: 50%, 90%, and full screen. */
export type BottomSheetDetentPreset = 'medium' | 'large' | 'full';

/** Preset, screen-height fraction (0-1), or percentage string such as `50%`. */
export type BottomSheetDetent = BottomSheetDetentPreset | number | `${number}%`;

/** Gorhom-compatible alias for {@link BottomSheetDetent}. */
export type SnapPoint = BottomSheetDetent;

/** How the sheet resizes when the software keyboard appears. */
export type BottomSheetKeyboardBehavior = 'interactive' | 'fillParent' | 'extend';

/** Whether the sheet restores its pre-keyboard snap after the keyboard hides. */
export type BottomSheetKeyboardBlurBehavior = 'none' | 'restore';

export interface BottomSheetTheme {
	/** Background color of the sheet panel. */
	sheetBackgroundColor?: string;
	/** Solid color for letterbox bars behind the scaled app (`presentation` mode). */
	letterboxColor?: string;
	/**
	 * Provider root background. Keep `transparent` so route transitions never flash black.
	 */
	hostBackgroundColor?: string;
	/** Letterbox opacity at full presentation (`1` = solid bars). */
	letterboxOpacity?: number;
	/** Color of the drag handle at the top of the sheet. */
	handleColor?: string;
	/** Default scrim fill above the sheet. Default `transparent`. */
	scrimColor?: string;
	/** Full-screen dim behind sheets in `modal` mode. */
	modalBackdropColor?: string;
}

/** Options for `present()` and `BottomSheetModal`. See module docs in `index.ts`. */
export interface BottomSheetOptions {
	/** Host mode override; falls back to `BottomSheetProvider` `mode`. */
	mode?: BottomSheetMode;
	snapPoints?: BottomSheetDetent[];
	index?: number;
	enableDynamicSizing?: boolean;
	enablePanDownToClose?: boolean;
	dismissOnScrimPress?: boolean;
	scrimColor?: string;
	enableContentPanningGesture?: boolean;
	keyboardBehavior?: BottomSheetKeyboardBehavior;
	keyboardBlurBehavior?: BottomSheetKeyboardBlurBehavior;
	showHandle?: boolean;
	onDismiss?: () => void;
	onChange?: (index: number) => void;
	onAnimate?: (fromIndex: number, toIndex: number) => void;
	theme?: BottomSheetTheme;
	sheetStyle?: StyleProp<ViewStyle>;
	accessibilityLabel?: string;
	/**
	 * Stable id for a `BottomSheetModal` instance.
	 * @internal Set by `BottomSheetModal`; omit for imperative `present()`.
	 */
	sheetId?: string;
}

/** Fully merged options used internally after provider defaults and resolution. */
export interface ResolvedBottomSheetOptions {
	mode: BottomSheetMode;
	snapPoints: BottomSheetDetent[];
	index: number;
	enableDynamicSizing: boolean;
	enablePanDownToClose: boolean;
	dismissOnScrimPress: boolean;
	scrimColor: string;
	enableContentPanningGesture: boolean;
	keyboardBehavior: BottomSheetKeyboardBehavior;
	keyboardBlurBehavior: BottomSheetKeyboardBlurBehavior;
	showHandle: boolean;
	onDismiss?: () => void;
	onChange?: (index: number) => void;
	onAnimate?: (fromIndex: number, toIndex: number) => void;
	theme: Required<BottomSheetTheme>;
	sheetStyle?: StyleProp<ViewStyle>;
	accessibilityLabel: string;
}

/** Imperative control methods shared by refs and the top-sheet controller. */
export interface BottomSheetControllerApi {
	close: () => void;
	snapToIndex: (index: number) => void;
	snapToPosition: (position: number) => void;
	expand: () => void;
	collapse: () => void;
}

/** Ref API for `BottomSheetModal`. */
export interface BottomSheetModalRef extends BottomSheetControllerApi {
	present: () => void;
	dismiss: () => void;
	forceClose: () => void;
	dismissAll: () => void;
}

/** Context value exposed inside sheet content via `useBottomSheetContent()`. */
export interface BottomSheetContentContextValue {
	animatedIndex: SharedValue<number>;
	animatedPosition: SharedValue<number>;
	scrollOffset: SharedValue<number>;
	snapToIndex: (index: number) => void;
	close: () => void;
	expand: () => void;
	collapse: () => void;
	enableContentPanningGesture: boolean;
	enableDynamicSizing: boolean;
	bottomInset: number;
	onContentLayout: (height: number) => void;
	/** @internal Coordinated with scrollables for drag-to-dismiss. */
	sheetDragGesture: GestureType;
}

/** Value returned by `useBottomSheet()` at the app root. */
export interface BottomSheetContextValue {
	mode: BottomSheetMode;
	present: (content: ReactNode, options?: BottomSheetOptions) => string;
	dismiss: (sheetId?: string) => void;
	dismissAll: () => void;
	isPresented: boolean;
	presentedSheetCount: number;
	topSheetId: string | null;
	topSheetController: BottomSheetControllerApi | null;
}

export interface BottomSheetState {
	id: string;
	content: ReactNode;
	options: ResolvedBottomSheetOptions;
}

/** Props for `BottomSheetProvider`. */
export interface BottomSheetProviderProps {
	children: ReactNode;
	/**
	 * Default host mode for all sheets. Per-sheet override via `BottomSheetOptions.mode`.
	 * @default 'presentation'
	 */
	mode?: BottomSheetMode;
	defaultOptions?: BottomSheetOptions;
	theme?: BottomSheetTheme;
}

/** Props for declarative `BottomSheetModal`. */
export interface BottomSheetModalProps extends BottomSheetOptions {
	children: ReactNode;
	sheetId?: string;
}

export interface RegisteredBottomSheetModal {
	id: string;
	renderContent: () => ReactNode;
	options: ResolvedBottomSheetOptions;
}
