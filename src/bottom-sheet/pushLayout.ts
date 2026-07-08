import { Extrapolation, interpolate } from 'react-native-reanimated';

import {
	BOTTOM_SHEET_CORNER_RADIUS,
	DETENT_FRACTIONS,
	PUSH_HOST_HORIZONTAL_INSET,
	pushInsetToScale,
} from './constants';
import { getDetentHeight } from './detents';
import { PUSH_DIRECTION_JS, type PushDirectionJs } from './pushDirection';
import type { BottomSheetDetent, BottomSheetLayoutDetentsOptions } from './types';

/** Sheet top Y at fully open for the current detent — drives push progress interpolation. */
export function getPushLayoutProgress(
	sheetTopY: number,
	openY: number,
	screenHeight: number,
	pushDirection: PushDirectionJs,
	_topInset: number,
): number {
	'worklet';
	if (pushDirection === PUSH_DIRECTION_JS.top) {
		const closedY = -screenHeight;
		if (openY <= 0.5) {
			return interpolate(sheetTopY, [closedY, openY], [0, 1], Extrapolation.CLAMP);
		}
		return 0;
	}

	if (openY >= screenHeight - 0.5) {
		return 0;
	}
	return interpolate(sheetTopY, [screenHeight, openY], [0, 1], Extrapolation.CLAMP);
}

export function getPushHorizontalInset(
	progress: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	return interpolate(progress, [0, 1], [0, targetInset], Extrapolation.CLAMP);
}

export function getPushScale(
	screenWidth: number,
	progress: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	return pushInsetToScale(screenWidth, getPushHorizontalInset(progress, targetInset));
}

export function getPushVisualInset(
	screenWidth: number,
	progress: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	const scale = getPushScale(screenWidth, progress, targetInset);
	return (screenWidth * (1 - scale)) / 2;
}

/**
 * Visible sheet height for host offset math.
 * Bottom-up: grows as the sheet top moves up.
 * Top-down: grows from the safe-area top as the sheet slides down.
 */
export function getPushVisibleSheetHeight(
	sheetTopY: number,
	screenHeight: number,
	topInset: number,
	pushDirection: PushDirectionJs,
	sheetHeight: number,
): number {
	'worklet';
	if (pushDirection === PUSH_DIRECTION_JS.top) {
		return Math.max(0, Math.min(sheetHeight, sheetTopY + sheetHeight));
	}
	return Math.max(0, screenHeight - sheetTopY);
}

/**
 * Signed host translate offset for push mode.
 * Bottom-up returns a negative value (host moves up).
 * Top-down returns a positive value (host moves down).
 */
export function getPushHostOffset(
	screenWidth: number,
	screenHeight: number,
	sheetTopY: number,
	progress: number,
	pushDirection: PushDirectionJs,
	topInset: number,
	sheetHeight: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	const visualInset = getPushVisualInset(screenWidth, progress, targetInset);
	const visibleHeight = getPushVisibleSheetHeight(
		sheetTopY,
		screenHeight,
		topInset,
		pushDirection,
		sheetHeight,
	);
	const magnitude = visibleHeight + visualInset;
	return pushDirection === PUSH_DIRECTION_JS.top ? magnitude : -magnitude;
}

/** @deprecated Use {@link getPushHostOffset}. */
export function getPushHostPushUp(
	screenWidth: number,
	screenHeight: number,
	sheetTopY: number,
	progress: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	const visualInset = getPushVisualInset(screenWidth, progress, targetInset);
	const sheetPanelHeight = Math.max(0, screenHeight - sheetTopY);
	return sheetPanelHeight + visualInset;
}

/** Host push layout from sheet position — single worklet snapshot, no progress SharedValue. */
export function getPushHostOffsetFromSheetTopY(
	screenWidth: number,
	screenHeight: number,
	sheetTopY: number,
	openY: number,
	pushDirection: PushDirectionJs,
	topInset: number,
	sheetHeight: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	const progress = getPushLayoutProgress(
		sheetTopY,
		openY,
		screenHeight,
		pushDirection,
		topInset,
	);
	return getPushHostOffset(
		screenWidth,
		screenHeight,
		sheetTopY,
		progress,
		pushDirection,
		topInset,
		sheetHeight,
		targetInset,
	);
}

/** @deprecated Use {@link getPushHostOffsetFromSheetTopY}. */
export function getPushHostPushUpFromSheetTopY(
	screenWidth: number,
	screenHeight: number,
	sheetTopY: number,
	openY: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	const progress = getPushLayoutProgress(sheetTopY, openY, screenHeight, 0, 0);
	return getPushHostPushUp(screenWidth, screenHeight, sheetTopY, progress, targetInset);
}

export function getBottomSheetCornerRadius(
	progress: number,
	maxRadius: number = BOTTOM_SHEET_CORNER_RADIUS,
): number {
	'worklet';
	return interpolate(progress, [0, 1], [0, maxRadius], Extrapolation.CLAMP);
}

export function getPushHostCornerRadiusStyle(
	progress: number,
	pushDirection: PushDirectionJs,
	maxRadius: number = BOTTOM_SHEET_CORNER_RADIUS,
): {
	borderBottomLeftRadius?: number;
	borderBottomRightRadius?: number;
	borderTopLeftRadius?: number;
	borderTopRightRadius?: number;
} {
	'worklet';
	const radius = getBottomSheetCornerRadius(progress, maxRadius);
	if (pushDirection === PUSH_DIRECTION_JS.top) {
		return {
			borderTopLeftRadius: radius,
			borderTopRightRadius: radius,
		};
	}
	return {
		borderBottomLeftRadius: radius,
		borderBottomRightRadius: radius,
	};
}

export function getPushSheetCornerRadiusStyle(
	progress: number,
	pushDirection: PushDirectionJs,
	maxRadius: number = BOTTOM_SHEET_CORNER_RADIUS,
): {
	borderBottomLeftRadius?: number;
	borderBottomRightRadius?: number;
	borderTopLeftRadius?: number;
	borderTopRightRadius?: number;
} {
	'worklet';
	const radius = getBottomSheetCornerRadius(progress, maxRadius);
	if (pushDirection === PUSH_DIRECTION_JS.top) {
		return {
			borderBottomLeftRadius: radius,
			borderBottomRightRadius: radius,
		};
	}
	return {
		borderTopLeftRadius: radius,
		borderTopRightRadius: radius,
	};
}

export function getPushTransformOrigin(pushDirection: PushDirectionJs): 'bottom' | 'top' {
	'worklet';
	return pushDirection === PUSH_DIRECTION_JS.top ? 'top' : 'bottom';
}

/** Scale from bottom center — host stays pinned while shrinking. */
export const PUSH_TRANSFORM_ORIGIN = 'bottom' as const;

export const PUSH_TRANSFORM_ORIGIN_TOP = 'top' as const;

export function getPushSheetHeightForDetent(
	detent: BottomSheetDetent,
	screenHeight: number,
	topInset: number,
	fractions: BottomSheetLayoutDetentsOptions = DETENT_FRACTIONS,
): number {
	'worklet';
	return getDetentHeight(detent, screenHeight, topInset, fractions);
}
