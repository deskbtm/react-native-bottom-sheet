import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from 'react-native-reanimated';

import {
	getPresentationHostTopInset,
	PRESENTATION_HOST_SCALE,
	PRESENTATION_TRANSFORM_ORIGIN,
} from './constants';
import { HOST_LAYOUT_MODE, type HostLayoutMode } from './hostLayoutMode';
import {
	getBottomSheetCornerRadius,
	getPushHostPushUpFromSheetTopY,
	getPushLayoutProgress,
	getPushScale,
	PUSH_TRANSFORM_ORIGIN,
} from './pushLayout';

interface BottomSheetHostProps {
	children: ReactNode;
	/** Numeric layout mode updated on the UI thread — avoids React re-renders on sheet open. */
	hostLayoutMode: SharedValue<HostLayoutMode>;
	progress: SharedValue<number>;
	sheetTopY: SharedValue<number>;
	/** Push open detent Y — host derives progress inline to avoid reaction timing jitter. */
	pushProgressOpenY?: SharedValue<number>;
	screenHeight: number;
	screenWidth: number;
	style?: StyleProp<ViewStyle>;
}

/**
 * Single host wrapper for all layout modes — avoids swapping children between push / presentation.
 */
export function BottomSheetHost({
	children,
	hostLayoutMode,
	progress,
	sheetTopY,
	pushProgressOpenY,
	screenHeight,
	screenWidth,
	style,
}: BottomSheetHostProps) {
	const animatedStyle = useAnimatedStyle(() => {
		const mode = hostLayoutMode.value;

		if (mode === HOST_LAYOUT_MODE.push && pushProgressOpenY) {
			const topY = sheetTopY.value;
			const openY = pushProgressOpenY.value;
			const pushProgress = getPushLayoutProgress(topY, openY, screenHeight);
			const radius = getBottomSheetCornerRadius(pushProgress);
			const pushUp = getPushHostPushUpFromSheetTopY(
				screenWidth,
				screenHeight,
				topY,
				openY,
			);

			return {
				borderBottomLeftRadius: radius,
				borderBottomRightRadius: radius,
				transformOrigin: PUSH_TRANSFORM_ORIGIN,
				transform: [
					{ translateY: -pushUp },
					{ scale: getPushScale(screenWidth, pushProgress) },
				],
			};
		}

		if (mode === HOST_LAYOUT_MODE.presentation) {
			return {
				transformOrigin: PRESENTATION_TRANSFORM_ORIGIN,
				transform: [
					{
						scale: interpolate(progress.value, [0, 1], [1, PRESENTATION_HOST_SCALE]),
					},
					{
						translateY: interpolate(
							progress.value,
							[0, 1],
							[0, getPresentationHostTopInset(screenWidth)],
						),
					},
				],
				borderRadius: getBottomSheetCornerRadius(progress.value),
			};
		}

		return {};
	});

	return (
		<Animated.View style={[styles.host, style, animatedStyle]}>{children}</Animated.View>
	);
}

const styles = StyleSheet.create({
	host: {
		flex: 1,
		overflow: 'hidden',
	},
});
