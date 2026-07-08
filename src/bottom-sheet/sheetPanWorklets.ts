import {
	Extrapolation,
	interpolate,
	withSpring,
	type SharedValue,
} from 'react-native-reanimated';

import {
	findNearestDetentIndex,
	getDetentTranslateY,
	getPushClosedTopY,
	getPushDetentTopY,
	getPushOpenTopY,
} from './detents';
import { PUSH_DIRECTION_JS, type PushDirectionJs } from './pushDirection';
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
	pushDirection: PushDirectionJs,
): void {
	'worklet';
	const nextY = dragStartY + translationY;

	if (pushDirection === PUSH_DIRECTION_JS.top) {
		const closedY = getPushClosedTopY(pushDirection, screenHeight, topInset);
		const maxY = getPushOpenTopY(pushDirection, screenHeight, topInset);
		sheetTranslateY.value = Math.min(Math.max(nextY, closedY), maxY);
	} else {
		const minY = getDetentTranslateY('full', screenHeight, topInset, detents);
		sheetTranslateY.value = Math.max(nextY, minY);
	}

	const openY = getPushDetentTopY(
		effectiveSnapPoints[activeDetentIndex.value],
		pushDirection,
		screenHeight,
		topInset,
		detents,
	);
	if (isPushLayout && pushProgressOpenY) {
		pushProgressOpenY.value = openY;
	} else {
		const closedY = getPushClosedTopY(pushDirection, screenHeight, topInset);
		progress.value = interpolate(
			sheetTranslateY.value,
			[closedY, openY],
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
	pushDirection: PushDirectionJs,
): SheetPanEndResult {
	'worklet';
	const isTopPush = pushDirection === PUSH_DIRECTION_JS.top;
	const openY = getPushDetentTopY(
		effectiveSnapPoints[currentIndex],
		pushDirection,
		screenHeight,
		topInset,
		detents,
	);

	if (isTopPush) {
		const dismissY = openY - dismissDragThreshold;
		if (
			enablePanDownToClose &&
			(currentY < dismissY || velocityY < -dismissVelocityThreshold)
		) {
			return { kind: 'dismiss', targetIndex: currentIndex, targetY: currentY };
		}

		if (
			velocityY > detentVelocityThreshold &&
			currentIndex < effectiveSnapPoints.length - 1
		) {
			const nextIndex = currentIndex + 1;
			return {
				kind: 'snap',
				targetIndex: nextIndex,
				targetY: getPushDetentTopY(
					effectiveSnapPoints[nextIndex],
					pushDirection,
					screenHeight,
					topInset,
					detents,
				),
			};
		}

		if (velocityY < -detentVelocityThreshold && currentIndex > 0) {
			const prevIndex = currentIndex - 1;
			return {
				kind: 'snap',
				targetIndex: prevIndex,
				targetY: getPushDetentTopY(
					effectiveSnapPoints[prevIndex],
					pushDirection,
					screenHeight,
					topInset,
					detents,
				),
			};
		}

		return {
			kind: 'snap',
			targetIndex: currentIndex,
			targetY: openY,
		};
	}

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
