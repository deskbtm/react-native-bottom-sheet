import { DETENT_FRACTIONS } from './constants';
import type { BottomSheetDetent, BottomSheetLayoutDetentsOptions } from './types';

function resolveDetentFraction(
	detent: BottomSheetDetent,
	fractions: BottomSheetLayoutDetentsOptions = DETENT_FRACTIONS,
): number {
	'worklet';
	if (typeof detent === 'number') {
		return Math.min(1, Math.max(0, detent));
	}
	if (typeof detent === 'string') {
		return Math.min(1, Math.max(0, Number.parseFloat(detent) / 100));
	}
	return fractions[detent];
}

export function getDetentHeight(
	detent: BottomSheetDetent,
	screenHeight: number,
	topInset: number,
	fractions: BottomSheetLayoutDetentsOptions = DETENT_FRACTIONS,
): number {
	'worklet';
	if (detent === 'full') {
		return screenHeight - topInset;
	}
	return screenHeight * resolveDetentFraction(detent, fractions);
}

export function getDetentTranslateY(
	detent: BottomSheetDetent,
	screenHeight: number,
	topInset: number,
	fractions: BottomSheetLayoutDetentsOptions = DETENT_FRACTIONS,
): number {
	'worklet';
	return screenHeight - getDetentHeight(detent, screenHeight, topInset, fractions);
}

export function findNearestDetentIndex(
	translateY: number,
	detents: BottomSheetDetent[],
	screenHeight: number,
	topInset: number,
	fractions: BottomSheetLayoutDetentsOptions = DETENT_FRACTIONS,
): number {
	'worklet';
	let nearestIndex = 0;
	let minDistance = Number.MAX_VALUE;

	for (let index = 0; index < detents.length; index += 1) {
		const targetY = getDetentTranslateY(
			detents[index],
			screenHeight,
			topInset,
			fractions,
		);
		const distance = Math.abs(translateY - targetY);
		if (distance < minDistance) {
			minDistance = distance;
			nearestIndex = index;
		}
	}

	return nearestIndex;
}

export function findDetentIndex(
	detents: BottomSheetDetent[],
	detent: BottomSheetDetent,
): number {
	const index = detents.indexOf(detent);
	return index >= 0 ? index : 0;
}

export function clampIndex(index: number, detentCount: number): number {
	if (detentCount <= 0) {
		return 0;
	}
	return Math.min(Math.max(index, 0), detentCount - 1);
}

export function buildDynamicSheetHeight(
	contentHeight: number,
	screenHeight: number,
	topInset: number,
	bottomInset: number,
	handleHeight: number,
): number {
	const totalHeight = contentHeight + handleHeight + bottomInset;
	const maxHeight = screenHeight - topInset;
	return Math.min(totalHeight, maxHeight);
}

export function getTranslateYFromSheetHeight(
	sheetHeight: number,
	screenHeight: number,
): number {
	'worklet';
	return screenHeight - sheetHeight;
}

export function buildDynamicSnapPoint(
	contentHeight: number,
	screenHeight: number,
	topInset: number,
	bottomInset: number,
	handleHeight: number,
): BottomSheetDetent {
	const clampedHeight = buildDynamicSheetHeight(
		contentHeight,
		screenHeight,
		topInset,
		bottomInset,
		handleHeight,
	);
	return clampedHeight / screenHeight;
}

export function mergeSnapPoints(
	snapPoints: BottomSheetDetent[],
	dynamicSnapPoint: BottomSheetDetent | null,
	enableDynamicSizing: boolean,
): BottomSheetDetent[] {
	if (!enableDynamicSizing) {
		return snapPoints.length > 0 ? snapPoints : ['medium'];
	}

	if (dynamicSnapPoint == null) {
		return snapPoints;
	}

	if (snapPoints.length === 0) {
		return [dynamicSnapPoint];
	}

	return [...snapPoints, dynamicSnapPoint];
}
