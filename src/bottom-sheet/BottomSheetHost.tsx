import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from 'react-native-reanimated';

import { getPresentationHostTopInset, PRESENTATION_TRANSFORM_ORIGIN } from './constants';
import { HOST_LAYOUT_MODE, type HostLayoutMode } from './hostLayoutMode';
import { DEFAULT_LAYOUT_OPTIONS } from './mergeLayoutOptions';
import {
	getBottomSheetCornerRadius,
	getPushHostPushUpFromSheetTopY,
	getPushLayoutProgress,
	getPushScale,
	PUSH_TRANSFORM_ORIGIN,
} from './pushLayout';
import type { BottomSheetLayoutOptions } from './types';

interface BottomSheetHostProps {
	children: ReactNode;
	hostLayoutMode: SharedValue<HostLayoutMode>;
	progress: SharedValue<number>;
	sheetTopY: SharedValue<number>;
	pushProgressOpenY?: SharedValue<number>;
	screenHeight: number;
	screenWidth: number;
	layout?: BottomSheetLayoutOptions;
	style?: StyleProp<ViewStyle>;
	testID?: string;
}

export function BottomSheetHost({
	children,
	hostLayoutMode,
	progress,
	sheetTopY,
	pushProgressOpenY,
	screenHeight,
	screenWidth,
	layout = DEFAULT_LAYOUT_OPTIONS,
	style,
	testID,
}: BottomSheetHostProps) {
	const { presentation, push } = layout;

	const animatedStyle = useAnimatedStyle(() => {
		const mode = hostLayoutMode.value;

		if (mode === HOST_LAYOUT_MODE.push && pushProgressOpenY) {
			const topY = sheetTopY.value;
			const openY = pushProgressOpenY.value;
			const pushProgress = getPushLayoutProgress(topY, openY, screenHeight);
			const radius = getBottomSheetCornerRadius(pushProgress, presentation.cornerRadius);
			const pushUp = getPushHostPushUpFromSheetTopY(
				screenWidth,
				screenHeight,
				topY,
				openY,
				push.hostHorizontalInset,
			);

			return {
				borderBottomLeftRadius: radius,
				borderBottomRightRadius: radius,
				transformOrigin: PUSH_TRANSFORM_ORIGIN,
				transform: [
					{ translateY: -pushUp },
					{ scale: getPushScale(screenWidth, pushProgress, push.hostHorizontalInset) },
				],
			};
		}

		if (mode === HOST_LAYOUT_MODE.presentation) {
			return {
				transformOrigin: PRESENTATION_TRANSFORM_ORIGIN,
				transform: [
					{
						scale: interpolate(progress.value, [0, 1], [1, presentation.hostScale]),
					},
					{
						translateY: interpolate(
							progress.value,
							[0, 1],
							[
								0,
								getPresentationHostTopInset(
									screenWidth,
									presentation.hostScale,
									presentation.hostTopInsetMin,
								),
							],
						),
					},
				],
				borderRadius: getBottomSheetCornerRadius(
					progress.value,
					presentation.cornerRadius,
				),
			};
		}

		return {};
	});

	return (
		<Animated.View testID={testID} style={[styles.host, style, animatedStyle]}>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	host: {
		flex: 1,
		overflow: 'hidden',
	},
});
