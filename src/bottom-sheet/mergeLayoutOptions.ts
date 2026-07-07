import {
	BOTTOM_SHEET_CORNER_RADIUS,
	DETENT_FRACTIONS,
	DETENT_VELOCITY_THRESHOLD,
	DISMISS_DRAG_THRESHOLD,
	DISMISS_VELOCITY_THRESHOLD,
	HANDLE_HEIGHT,
	HIDDEN_HANDLE_HEIGHT,
	PRESENTATION_HOST_SCALE,
	PRESENTATION_HOST_TOP_INSET_MIN,
	PUSH_HOST_HORIZONTAL_INSET,
	PUSH_LAYOUT_SPRING_CONFIG,
	SCROLL_OFFSET_EPSILON,
	SHEET_ACTIVATION_OFFSET,
	SHEET_SCROLL_END_EXTRA,
	SHEET_SPRING_CONFIG,
	STACK_CARD_OFFSET_Y_PER_LEVEL,
	STACK_CARD_RADIUS_BONUS_PER_LEVEL,
	STACK_CARD_SCALE_PER_LEVEL,
	STACK_HORIZONTAL_INSET_PER_LEVEL,
} from './constants';
import type { BottomSheetLayoutOptions, BottomSheetSpringOptions } from './types';

export const DEFAULT_LAYOUT_OPTIONS: BottomSheetLayoutOptions = {
	motion: {
		sheetSpring: SHEET_SPRING_CONFIG,
		pushLayoutSpring: PUSH_LAYOUT_SPRING_CONFIG,
	},
	presentation: {
		hostScale: PRESENTATION_HOST_SCALE,
		cornerRadius: BOTTOM_SHEET_CORNER_RADIUS,
		hostTopInsetMin: PRESENTATION_HOST_TOP_INSET_MIN,
	},
	push: {
		hostHorizontalInset: PUSH_HOST_HORIZONTAL_INSET,
	},
	stack: {
		scalePerLevel: STACK_CARD_SCALE_PER_LEVEL,
		horizontalInsetPerLevel: STACK_HORIZONTAL_INSET_PER_LEVEL,
		offsetYPerLevel: STACK_CARD_OFFSET_Y_PER_LEVEL,
		radiusBonusPerLevel: STACK_CARD_RADIUS_BONUS_PER_LEVEL,
	},
	gestures: {
		dismissDragThreshold: DISMISS_DRAG_THRESHOLD,
		dismissVelocityThreshold: DISMISS_VELOCITY_THRESHOLD,
		detentVelocityThreshold: DETENT_VELOCITY_THRESHOLD,
		activationOffset: SHEET_ACTIVATION_OFFSET,
	},
	handle: {
		height: HANDLE_HEIGHT,
		hiddenHeight: HIDDEN_HANDLE_HEIGHT,
	},
	scroll: {
		endExtra: SHEET_SCROLL_END_EXTRA,
		offsetEpsilon: SCROLL_OFFSET_EPSILON,
	},
	detents: { ...DETENT_FRACTIONS },
};

function mergeSpringOptions(
	base: BottomSheetSpringOptions,
	override?: Partial<BottomSheetSpringOptions>,
): BottomSheetSpringOptions {
	return override ? { ...base, ...override } : base;
}

export function mergeLayoutOptions(
	partial?: Partial<BottomSheetLayoutOptions>,
): BottomSheetLayoutOptions {
	if (!partial) {
		return DEFAULT_LAYOUT_OPTIONS;
	}

	return {
		motion: {
			sheetSpring: mergeSpringOptions(
				DEFAULT_LAYOUT_OPTIONS.motion.sheetSpring,
				partial.motion?.sheetSpring,
			),
			pushLayoutSpring: mergeSpringOptions(
				DEFAULT_LAYOUT_OPTIONS.motion.pushLayoutSpring,
				partial.motion?.pushLayoutSpring,
			),
		},
		presentation: {
			...DEFAULT_LAYOUT_OPTIONS.presentation,
			...partial.presentation,
		},
		push: {
			...DEFAULT_LAYOUT_OPTIONS.push,
			...partial.push,
		},
		stack: {
			...DEFAULT_LAYOUT_OPTIONS.stack,
			...partial.stack,
		},
		gestures: {
			...DEFAULT_LAYOUT_OPTIONS.gestures,
			...partial.gestures,
		},
		handle: {
			...DEFAULT_LAYOUT_OPTIONS.handle,
			...partial.handle,
		},
		scroll: {
			...DEFAULT_LAYOUT_OPTIONS.scroll,
			...partial.scroll,
		},
		detents: {
			...DEFAULT_LAYOUT_OPTIONS.detents,
			...partial.detents,
		},
	};
}
