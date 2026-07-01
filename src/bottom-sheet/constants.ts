import type { BottomSheetSpringOptions, BottomSheetTheme } from './types';

export const SHEET_SPRING_CONFIG: BottomSheetSpringOptions = {
	damping: 500,
	stiffness: 1000,
	mass: 3,
};

/** Softer spring for push layout — host + sheet driven by one `sheetTranslateY` motion. */
export const PUSH_LAYOUT_SPRING_CONFIG: BottomSheetSpringOptions = {
	damping: 32,
	stiffness: 320,
	mass: 0.85,
};

/** iOS-style presentation host scale (push mode uses {@link PUSH_HOST_HORIZONTAL_INSET} instead). */
export const PRESENTATION_HOST_SCALE = 0.92;
/** Shared corner radius for host + sheet in presentation and push modes. */
export const BOTTOM_SHEET_CORNER_RADIUS = 24;
/** Pin the top edge so scale shrinks sides + bottom; top gap comes from {@link getPresentationHostTopInset}. */
export const PRESENTATION_TRANSFORM_ORIGIN = 'top' as const;
/** Minimum top letterbox — avoids flush-to-status-bar while staying below center-scaled gap (~40px). */
export const PRESENTATION_HOST_TOP_INSET_MIN = 46;

/** Top letterbox aligned with side inset from scale; push layout ignores this. */
export function getPresentationHostTopInset(
	screenWidth: number,
	presentationHostScale: number = PRESENTATION_HOST_SCALE,
	presentationHostTopInsetMin: number = PRESENTATION_HOST_TOP_INSET_MIN,
): number {
	'worklet';
	const sideLetterbox = (screenWidth * (1 - presentationHostScale)) / 2;
	return Math.max(sideLetterbox, presentationHostTopInsetMin);
}

/** Horizontal inset target for host/sheet sides in `push` mode (drives scale + gap math). */
export const PUSH_HOST_HORIZONTAL_INSET = 16;

/** Maps horizontal inset to uniform scale so layout size stays unchanged (GPU-only shrink). */
export function pushInsetToScale(screenWidth: number, inset: number): number {
	'worklet';
	if (screenWidth <= 0) {
		return 1;
	}
	return Math.max(0, (screenWidth - inset * 2) / screenWidth);
}

/** Per-level uniform scale for buried sheets (bottom-anchored). */
export const STACK_CARD_SCALE_PER_LEVEL = 0.96;
/** Horizontal inset per stack level — buried sheets become narrower; top sheet stays full width. */
export const STACK_HORIZONTAL_INSET_PER_LEVEL = 10;
/** Move buried sheets up so the handle peeks behind the top card. */
export const STACK_CARD_OFFSET_Y_PER_LEVEL = -8;
export const STACK_CARD_RADIUS_BONUS_PER_LEVEL = 4;

export const DISMISS_DRAG_THRESHOLD = 120;
export const DISMISS_VELOCITY_THRESHOLD = 800;
export const DETENT_VELOCITY_THRESHOLD = 500;

export const HANDLE_HEIGHT = 25;
export const HIDDEN_HANDLE_HEIGHT = 20;

/** Extra space below the last scroll item so it clears the home indicator / nav bar. */
export const SHEET_SCROLL_END_EXTRA = 24;

/** Extra scroll end inset below sheet content (safe area + breathing room). */
export function getBottomSheetScrollBottomPadding(
	bottomInset: number,
	endExtra: number = SHEET_SCROLL_END_EXTRA,
): number {
	'worklet';
	return bottomInset + endExtra;
}

export const SCROLL_OFFSET_EPSILON = 1;
export const SHEET_ACTIVATION_OFFSET = 8;

export const DETENT_FRACTIONS = {
	medium: 0.5,
	large: 0.9,
	full: 1,
} as const;

export const DEFAULT_THEME: Required<BottomSheetTheme> = {
	sheetBackgroundColor: '#fff',
	letterboxColor: '#000',
	hostBackgroundColor: 'transparent',
	letterboxOpacity: 1,
	handleColor: '#D1D1D6',
	scrimColor: 'transparent',
	modalBackdropColor: 'rgba(0,0,0,0.45)',
};

export const DEFAULT_ACCESSIBILITY_LABEL = 'Bottom sheet';
