import { useEffect } from 'react';
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	type SharedValue,
} from 'react-native-reanimated';

import { DEFAULT_LAYOUT_OPTIONS } from './mergeLayoutOptions';
import type { BottomSheetLayoutOptions } from './types';
import { pickWorkletLayoutScalars } from './workletLayout';

/**
 * iOS stacked sheets: buried cards are narrower (horizontal inset + scale from bottom).
 * The top card stays full width so it reads wider than the sheet behind it.
 */
export function useStackCardStyle(
	depthFromTop: number,
	sheetTopY: SharedValue<number>,
	screenHeight: number,
	enabled = true,
	layout: BottomSheetLayoutOptions = DEFAULT_LAYOUT_OPTIONS,
) {
	const scalars = pickWorkletLayoutScalars(layout);
	const animatedDepth = useSharedValue(depthFromTop);

	useEffect(() => {
		animatedDepth.value = withSpring(depthFromTop, layout.motion.sheetSpring);
	}, [animatedDepth, depthFromTop, layout.motion.sheetSpring]);

	return useAnimatedStyle(() => {
		if (!enabled) {
			return {
				marginHorizontal: 0,
				borderTopLeftRadius: scalars.presentationCornerRadius,
				borderTopRightRadius: scalars.presentationCornerRadius,
				transform: [{ translateY: 0 }, { scale: 1 }],
			};
		}

		const depth = animatedDepth.value;
		const borderRadius =
			scalars.presentationCornerRadius +
			Math.max(0, depth) * scalars.stackRadiusBonusPerLevel;

		if (depth <= 0) {
			return {
				marginHorizontal: 0,
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
				transform: [{ translateY: 0 }, { scale: 1 }],
			};
		}

		const scale = scalars.stackScalePerLevel ** depth;
		const horizontalInset = scalars.stackHorizontalInsetPerLevel * depth;
		const sheetHeight = Math.max(screenHeight - sheetTopY.value, 0);
		// Pin scale transform to the bottom edge (like UISheetPresentationController).
		const bottomAnchorY = (sheetHeight * (1 - scale)) / 2;
		const peekY = scalars.stackOffsetYPerLevel * depth;

		return {
			marginHorizontal: horizontalInset,
			borderTopLeftRadius: borderRadius,
			borderTopRightRadius: borderRadius,
			transform: [{ translateY: bottomAnchorY + peekY }, { scale }],
		};
	});
}
