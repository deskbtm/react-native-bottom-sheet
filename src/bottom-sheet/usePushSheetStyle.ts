import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { DEFAULT_LAYOUT_OPTIONS } from './mergeLayoutOptions';
import {
	getBottomSheetCornerRadius,
	getPushLayoutProgress,
	getPushScale,
} from './pushLayout';
import type { BottomSheetLayoutOptions } from './types';

/** Sheet uses horizontal scale only — bottom stays flush; side inset matches host. */
export function usePushSheetScaleStyle(
	sheetTopY: SharedValue<number>,
	pushProgressOpenY: SharedValue<number>,
	screenHeight: number,
	screenWidth: number,
	enabled: boolean,
	layout: BottomSheetLayoutOptions = DEFAULT_LAYOUT_OPTIONS,
) {
	return useAnimatedStyle(() => {
		if (!enabled) {
			return {};
		}

		const progress = getPushLayoutProgress(
			sheetTopY.value,
			pushProgressOpenY.value,
			screenHeight,
		);
		const scale = getPushScale(screenWidth, progress, layout.push.hostHorizontalInset);

		return {
			width: screenWidth,
			flex: 1,
			alignSelf: 'center',
			transform: [{ scaleX: scale }],
		};
	});
}

/** Top corner radius for the sheet card in `push` mode (same constant as host). */
export function usePushSheetCardStyle(
	sheetTopY: SharedValue<number>,
	pushProgressOpenY: SharedValue<number>,
	screenHeight: number,
	enabled: boolean,
	layout: BottomSheetLayoutOptions = DEFAULT_LAYOUT_OPTIONS,
) {
	return useAnimatedStyle(() => {
		if (!enabled) {
			return {};
		}

		const progress = getPushLayoutProgress(
			sheetTopY.value,
			pushProgressOpenY.value,
			screenHeight,
		);
		const radius = getBottomSheetCornerRadius(progress, layout.presentation.cornerRadius);

		return {
			flex: 1,
			borderTopLeftRadius: radius,
			borderTopRightRadius: radius,
			overflow: 'hidden',
		};
	});
}
