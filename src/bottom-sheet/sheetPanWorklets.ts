import {
	Extrapolation,
	interpolate,
	withSpring,
	type SharedValue,
} from 'react-native-reanimated';

import { findNearestDetentIndex, getDetentTranslateY } from './detents';
import type {
	BottomSheetDetent,
	BottomSheetLayoutDetentsOptions,
	BottomSheetSpringOptions,
} from './types';

export type SheetPanEndKind = 'dismiss' | 'snap';

export interface SheetPanEndResult {
	kind: SheetPanEndKind;
	targetIndex: number;
	targetY: number;
}

export function applySheetDragUpdate(
	dragStartY: number,
	translationY: number,
	sheetTranslateY: SharedValue<number>,
	progress: SharedValue<number>,
	pushProgressOpenY: SharedValue<number> | null,
	activeDetentIndex: SharedValue<number>,
	effectiveSnapPoints: BottomSheetDetent[],
	screenHeight: number,
	topInset: number,
	detents: BottomSheetLayoutDetentsOptions,
	isPushLayout: boolean,
): void {
	'worklet';
	const nextY = dragStartY + translationY;
	const minY = getDetentTranslateY('full', screenHeight, topInset, detents);
	sheetTranslateY.value = Math.max(nextY, minY);

	const openY = getDetentTranslateY(
		effectiveSnapPoints[activeDetentIndex.value],
		screenHeight,
		topInset,
		detents,
	);
	if (isPushLayout && pushProgressOpenY) {
		pushProgressOpenY.value = openY;
	} else {
		progress.value = interpolate(
			sheetTranslateY.value,
			[screenHeight, openY],
			[0, 1],
			Extrapolation.CLAMP,
		);
	}
}

export function resolveSheetPanEnd(
	currentY: number,
	velocityY: number,
	currentIndex: number,
	effectiveSnapPoints: BottomSheetDetent[],
	screenHeight: number,
	topInset: number,
	detents: BottomSheetLayoutDetentsOptions,
	dismissDragThreshold: number,
	dismissVelocityThreshold: number,
	detentVelocityThreshold: number,
	enablePanDownToClose: boolean,
): SheetPanEndResult {
	'worklet';
	const dismissY =
		getDetentTranslateY(effectiveSnapPoints[0], screenHeight, topInset, detents) +
		dismissDragThreshold;

	if (
		enablePanDownToClose &&
		(currentY > dismissY || velocityY > dismissVelocityThreshold)
	) {
		return { kind: 'dismiss', targetIndex: currentIndex, targetY: currentY };
	}

	if (
		velocityY < -detentVelocityThreshold &&
		currentIndex < effectiveSnapPoints.length - 1
	) {
		const nextIndex = currentIndex + 1;
		return {
			kind: 'snap',
			targetIndex: nextIndex,
			targetY: getDetentTranslateY(
				effectiveSnapPoints[nextIndex],
				screenHeight,
				topInset,
				detents,
			),
		};
	}

	if (velocityY > detentVelocityThreshold && currentIndex > 0) {
		const prevIndex = currentIndex - 1;
		return {
			kind: 'snap',
			targetIndex: prevIndex,
			targetY: getDetentTranslateY(
				effectiveSnapPoints[prevIndex],
				screenHeight,
				topInset,
				detents,
			),
		};
	}

	const nearestIndex = findNearestDetentIndex(
		currentY,
		effectiveSnapPoints,
		screenHeight,
		topInset,
		detents,
	);

	return {
		kind: 'snap',
		targetIndex: nearestIndex,
		targetY: getDetentTranslateY(
			effectiveSnapPoints[nearestIndex],
			screenHeight,
			topInset,
			detents,
		),
	};
}

export function applySheetPanSnap(
	targetIndex: number,
	targetY: number,
	activeDetentIndex: SharedValue<number>,
	animatedIndex: SharedValue<number>,
	sheetTranslateY: SharedValue<number>,
	progress: SharedValue<number>,
	pushProgressOpenY: SharedValue<number> | null,
	isPushLayout: boolean,
	layoutSpring: BottomSheetSpringOptions,
): void {
	'worklet';
	activeDetentIndex.value = targetIndex;
	animatedIndex.value = targetIndex;
	if (isPushLayout && pushProgressOpenY) {
		pushProgressOpenY.value = targetY;
	} else {
		progress.value = withSpring(1, layoutSpring);
	}
	sheetTranslateY.value = withSpring(targetY, layoutSpring);
}
