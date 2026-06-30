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

export function getPushHorizontalInset(progress: number): number {
	'worklet';
	return interpolate(
		progress,
		[0, 1],
		[0, PUSH_HOST_HORIZONTAL_INSET],
		Extrapolation.CLAMP,
	);
}

export function getPushScale(screenWidth: number, progress: number): number {
	'worklet';
	return pushInsetToScale(screenWidth, getPushHorizontalInset(progress));
}

/** Side letterbox after uniform scale: `(screenWidth * (1 - scale)) / 2`. */
export function getPushVisualInset(screenWidth: number, progress: number): number {
	'worklet';
	const scale = getPushScale(screenWidth, progress);
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
): number {
	'worklet';
	const visualInset = getPushVisualInset(screenWidth, progress);
	const sheetHeight = Math.max(0, screenHeight - sheetTopY);
	return sheetHeight + visualInset;
}

/** Host push layout from sheet position — single worklet snapshot, no progress SharedValue. */
export function getPushHostPushUpFromSheetTopY(
	screenWidth: number,
	screenHeight: number,
	sheetTopY: number,
	openY: number,
): number {
	'worklet';
	const progress = getPushLayoutProgress(sheetTopY, openY, screenHeight);
	return getPushHostPushUp(screenWidth, screenHeight, sheetTopY, progress);
}

export function getBottomSheetCornerRadius(progress: number): number {
	'worklet';
	return interpolate(
		progress,
		[0, 1],
		[0, BOTTOM_SHEET_CORNER_RADIUS],
		Extrapolation.CLAMP,
	);
}

/** Scale from bottom center — host stays pinned while shrinking. */
export const PUSH_TRANSFORM_ORIGIN = 'bottom' as const;
