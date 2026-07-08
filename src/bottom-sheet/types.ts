import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { GestureType } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';

/**
 * Host presentation style for bottom sheets.
 *
 * - `presentation` — iOS-style: scales the app behind the sheet, letterbox, stacked card peek.
 * - `modal` — standard overlay: app stays full size, dimmed scrim, flat stacked sheets.
 * - `push` — pushes the host away from the sheet (default from bottom; optional top-down via `pushDirection`).
 */
export type BottomSheetMode = 'presentation' | 'modal' | 'push';

/** Which screen edge the sheet pushes from in `push` mode. */
export type PushDirection = 'bottom' | 'top';

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
	/** Push edge override; falls back to Provider `sheet.pushDirection`, then `layout.push.direction`. */
	pushDirection?: PushDirection;
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
	pushDirection: PushDirection;
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

/** Spring parameters for sheet motion. */
export interface BottomSheetSpringOptions {
	damping: number;
	stiffness: number;
	mass: number;
}

/** Provider-wide motion springs. */
export interface BottomSheetLayoutMotionOptions {
	sheetSpring: BottomSheetSpringOptions;
	pushLayoutSpring: BottomSheetSpringOptions;
}

/** iOS-style presentation host scaling and corner radius. */
export interface BottomSheetLayoutPresentationOptions {
	hostScale: number;
	cornerRadius: number;
	hostTopInsetMin: number;
}

/** Push mode horizontal inset between host and sheet. */
export interface BottomSheetLayoutPushOptions {
	hostHorizontalInset: number;
	/** Default push edge for `mode: 'push'` sheets. Overridable per sheet via `pushDirection`. */
	direction: PushDirection;
}

/** Stacked sheet card peek styling per depth level. */
export interface BottomSheetLayoutStackOptions {
	scalePerLevel: number;
	horizontalInsetPerLevel: number;
	offsetYPerLevel: number;
	radiusBonusPerLevel: number;
}

/** Drag and snap gesture thresholds. */
export interface BottomSheetLayoutGesturesOptions {
	dismissDragThreshold: number;
	dismissVelocityThreshold: number;
	detentVelocityThreshold: number;
	activationOffset: number;
}

/** Sheet handle dimensions. */
export interface BottomSheetLayoutHandleOptions {
	height: number;
	hiddenHeight: number;
}

/** Scrollable content insets inside sheets. */
export interface BottomSheetLayoutScrollOptions {
	endExtra: number;
	offsetEpsilon: number;
}

/** Preset detent height fractions for `medium`, `large`, and `full`. */
export interface BottomSheetLayoutDetentsOptions {
	medium: number;
	large: number;
	full: number;
}

/**
 * Provider-wide physical layout parameters.
 * Defaults from `constants.ts`; override via `BottomSheetProvider` `layout` prop.
 */
export interface BottomSheetLayoutOptions {
	motion: BottomSheetLayoutMotionOptions;
	presentation: BottomSheetLayoutPresentationOptions;
	push: BottomSheetLayoutPushOptions;
	stack: BottomSheetLayoutStackOptions;
	gestures: BottomSheetLayoutGesturesOptions;
	handle: BottomSheetLayoutHandleOptions;
	scroll: BottomSheetLayoutScrollOptions;
	detents: BottomSheetLayoutDetentsOptions;
}

/** Props for `BottomSheetProvider`. */
export interface BottomSheetProviderProps {
	children: ReactNode;
	/**
	 * Default host mode for all sheets. Per-sheet override via `BottomSheetOptions.mode`.
	 * @default 'presentation'
	 */
	mode?: BottomSheetMode;
	/** Default options merged into every `present()` / `BottomSheetModal` open. */
	sheet?: BottomSheetOptions;
	/** Provider-wide layout parameters. Read once at mount. */
	layout?: Partial<BottomSheetLayoutOptions>;
	/** Default colors; updates when the prop changes. */
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
