import { Extrapolation, interpolate } from 'react-native-reanimated';

import {
	BOTTOM_SHEET_CORNER_RADIUS,
	PUSH_HOST_HORIZONTAL_INSET,
	pushInsetToScale,
} from './constants';

/** Sheet top Y at fully open for the current detent — drives push progress interpolation. */
export function getPushLayoutProgress(
	sheetTopY: number,
	openY: number,
	screenHeight: number,
): number {
	'worklet';
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
	return interpolate(
		progress,
		[0, 1],
		[0, targetInset],
		Extrapolation.CLAMP,
	);
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
 * Host `translateY` so visible gap between host bottom and sheet top equals side inset.
 * Sheet uses top transform origin so its card top aligns with the panel top.
 */
export function getPushHostPushUp(
	screenWidth: number,
	screenHeight: number,
	sheetTopY: number,
	progress: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	const visualInset = getPushVisualInset(screenWidth, progress, targetInset);
	const sheetHeight = Math.max(0, screenHeight - sheetTopY);
	return sheetHeight + visualInset;
}

/** Host push layout from sheet position — single worklet snapshot, no progress SharedValue. */
export function getPushHostPushUpFromSheetTopY(
	screenWidth: number,
	screenHeight: number,
	sheetTopY: number,
	openY: number,
	targetInset: number = PUSH_HOST_HORIZONTAL_INSET,
): number {
	'worklet';
	const progress = getPushLayoutProgress(sheetTopY, openY, screenHeight);
	return getPushHostPushUp(screenWidth, screenHeight, sheetTopY, progress, targetInset);
}

export function getBottomSheetCornerRadius(
	progress: number,
	maxRadius: number = BOTTOM_SHEET_CORNER_RADIUS,
): number {
	'worklet';
	return interpolate(progress, [0, 1], [0, maxRadius], Extrapolation.CLAMP);
}

/** Scale from bottom center — host stays pinned while shrinking. */
export const PUSH_TRANSFORM_ORIGIN = 'bottom' as const;
