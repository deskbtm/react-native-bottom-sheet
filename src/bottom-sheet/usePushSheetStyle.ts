import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { DEFAULT_LAYOUT_OPTIONS } from './mergeLayoutOptions';
import { pushDirectionToJs } from './pushDirection';
import {
	getPushLayoutProgress,
	getPushScale,
	getPushSheetCornerRadiusStyle,
	getPushTransformOrigin,
} from './pushLayout';
import type { BottomSheetLayoutOptions, PushDirection } from './types';
import { pickWorkletLayoutScalars } from './workletLayout';

/** Sheet uses horizontal scale only — anchored edge stays flush; side inset matches host. */
export function usePushSheetScaleStyle(
	sheetTopY: SharedValue<number>,
	pushProgressOpenY: SharedValue<number>,
	screenHeight: number,
	screenWidth: number,
	enabled: boolean,
	layout: BottomSheetLayoutOptions = DEFAULT_LAYOUT_OPTIONS,
	pushDirection: PushDirection = 'bottom',
	topInset: number = 0,
) {
	const scalars = pickWorkletLayoutScalars(layout);
	const pushDirectionJs = pushDirectionToJs(pushDirection);

	return useAnimatedStyle(() => {
		if (!enabled) {
			return {};
		}

		const progress = getPushLayoutProgress(
			sheetTopY.value,
			pushProgressOpenY.value,
			screenHeight,
			pushDirectionJs,
			topInset,
		);
		const scale = getPushScale(screenWidth, progress, scalars.pushHostHorizontalInset);

		return {
			width: screenWidth,
			flex: 1,
			alignSelf: 'center',
			transform: [{ scaleX: scale }],
			transformOrigin: getPushTransformOrigin(pushDirectionJs),
		};
	});
}

/** Corner radius for the sheet card in `push` mode (mirrors host edge). */
export function usePushSheetCardStyle(
	sheetTopY: SharedValue<number>,
	pushProgressOpenY: SharedValue<number>,
	screenHeight: number,
	enabled: boolean,
	layout: BottomSheetLayoutOptions = DEFAULT_LAYOUT_OPTIONS,
	pushDirection: PushDirection = 'bottom',
	topInset: number = 0,
) {
	const scalars = pickWorkletLayoutScalars(layout);
	const pushDirectionJs = pushDirectionToJs(pushDirection);

	return useAnimatedStyle(() => {
		if (!enabled) {
			return {};
		}

		const progress = getPushLayoutProgress(
			sheetTopY.value,
			pushProgressOpenY.value,
			screenHeight,
			pushDirectionJs,
			topInset,
		);

		return {
			flex: 1,
			overflow: 'hidden',
			...getPushSheetCornerRadiusStyle(
				progress,
				pushDirectionJs,
				scalars.presentationCornerRadius,
			),
		};
	});
}
