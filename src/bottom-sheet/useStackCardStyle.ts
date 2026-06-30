import { useEffect } from 'react';
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	type SharedValue,
} from 'react-native-reanimated';

import {
	BOTTOM_SHEET_CORNER_RADIUS,
	SHEET_SPRING_CONFIG,
	STACK_CARD_OFFSET_Y_PER_LEVEL,
	STACK_CARD_RADIUS_BONUS_PER_LEVEL,
	STACK_CARD_SCALE_PER_LEVEL,
	STACK_HORIZONTAL_INSET_PER_LEVEL,
} from './constants';

/**
 * iOS stacked sheets: buried cards are narrower (horizontal inset + scale from bottom).
 * The top card stays full width so it reads wider than the sheet behind it.
 */
export function useStackCardStyle(
	depthFromTop: number,
	sheetTopY: SharedValue<number>,
	screenHeight: number,
	enabled = true,
) {
	const animatedDepth = useSharedValue(depthFromTop);

	useEffect(() => {
		animatedDepth.value = withSpring(depthFromTop, SHEET_SPRING_CONFIG);
	}, [animatedDepth, depthFromTop]);

	return useAnimatedStyle(() => {
		if (!enabled) {
			return {
				marginHorizontal: 0,
				borderTopLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
				borderTopRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
				transform: [{ translateY: 0 }, { scale: 1 }],
			};
		}

		const depth = animatedDepth.value;
		const borderRadius =
			BOTTOM_SHEET_CORNER_RADIUS + Math.max(0, depth) * STACK_CARD_RADIUS_BONUS_PER_LEVEL;

		if (depth <= 0) {
			return {
				marginHorizontal: 0,
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
				transform: [{ translateY: 0 }, { scale: 1 }],
			};
		}

		const scale = STACK_CARD_SCALE_PER_LEVEL ** depth;
		const horizontalInset = STACK_HORIZONTAL_INSET_PER_LEVEL * depth;
		const sheetHeight = Math.max(screenHeight - sheetTopY.value, 0);
		// Pin scale transform to the bottom edge (like UISheetPresentationController).
		const bottomAnchorY = (sheetHeight * (1 - scale)) / 2;
		const peekY = STACK_CARD_OFFSET_Y_PER_LEVEL * depth;

		return {
			marginHorizontal: horizontalInset,
			borderTopLeftRadius: borderRadius,
			borderTopRightRadius: borderRadius,
			transform: [{ translateY: bottomAnchorY + peekY }, { scale }],
		};
	});
}
