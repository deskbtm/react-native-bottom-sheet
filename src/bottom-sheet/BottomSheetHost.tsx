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
import { PUSH_DIRECTION_JS } from './pushDirection';
import {
	getBottomSheetCornerRadius,
	getPushHostCornerRadiusStyle,
	getPushHostOffsetFromSheetTopY,
	getPushLayoutProgress,
	getPushScale,
	getPushSheetHeightForDetent,
	getPushTransformOrigin,
} from './pushLayout';
import type { BottomSheetLayoutOptions } from './types';
import { pickWorkletLayoutScalars } from './workletLayout';

interface BottomSheetHostProps {
	children: ReactNode;
	hostLayoutMode: SharedValue<HostLayoutMode>;
	progress: SharedValue<number>;
	sheetTopY: SharedValue<number>;
	pushProgressOpenY?: SharedValue<number>;
	pushSheetHeight?: SharedValue<number>;
	topInset: number;
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
	pushSheetHeight,
	topInset,
	screenHeight,
	screenWidth,
	layout = DEFAULT_LAYOUT_OPTIONS,
	style,
	testID,
}: BottomSheetHostProps) {
	const scalars = pickWorkletLayoutScalars(layout);

	const animatedStyle = useAnimatedStyle(() => {
		const mode = hostLayoutMode.value;

		if (
			(mode === HOST_LAYOUT_MODE.pushBottom || mode === HOST_LAYOUT_MODE.pushTop) &&
			pushProgressOpenY
		) {
			const pushDirectionJs =
				mode === HOST_LAYOUT_MODE.pushTop
					? PUSH_DIRECTION_JS.top
					: PUSH_DIRECTION_JS.bottom;
			const pushLayoutTopInset = pushDirectionJs === PUSH_DIRECTION_JS.top ? 0 : topInset;
			const topY = sheetTopY.value;
			const openY = pushProgressOpenY.value;
			const sheetHeight =
				pushDirectionJs === PUSH_DIRECTION_JS.top
					? (pushSheetHeight?.value ??
						getPushSheetHeightForDetent('medium', screenHeight, 0))
					: Math.max(0, screenHeight - topY);
			const pushProgress = getPushLayoutProgress(
				topY,
				openY,
				screenHeight,
				pushDirectionJs,
				pushLayoutTopInset,
			);
			const hostOffset = getPushHostOffsetFromSheetTopY(
				screenWidth,
				screenHeight,
				topY,
				openY,
				pushDirectionJs,
				pushLayoutTopInset,
				sheetHeight,
				scalars.pushHostHorizontalInset,
			);

			return {
				...getPushHostCornerRadiusStyle(
					pushProgress,
					pushDirectionJs,
					scalars.presentationCornerRadius,
				),
				transformOrigin: getPushTransformOrigin(pushDirectionJs),
				transform: [
					{ translateY: hostOffset },
					{
						scale: getPushScale(
							screenWidth,
							pushProgress,
							scalars.pushHostHorizontalInset,
						),
					},
				],
			};
		}

		if (mode === HOST_LAYOUT_MODE.presentation) {
			const radius = getBottomSheetCornerRadius(
				progress.value,
				scalars.presentationCornerRadius,
			);

			return {
				transformOrigin: PRESENTATION_TRANSFORM_ORIGIN,
				transform: [
					{
						scale: interpolate(
							progress.value,
							[0, 1],
							[1, scalars.presentationHostScale],
						),
					},
					{
						translateY: interpolate(
							progress.value,
							[0, 1],
							[
								0,
								getPresentationHostTopInset(
									screenWidth,
									scalars.presentationHostScale,
									scalars.presentationHostTopInsetMin,
								),
							],
						),
					},
				],
				borderRadius: radius,
				borderTopLeftRadius: radius,
				borderTopRightRadius: radius,
				borderBottomLeftRadius: radius,
				borderBottomRightRadius: radius,
			};
		}

		return {
			borderRadius: 0,
			borderTopLeftRadius: 0,
			borderTopRightRadius: 0,
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
		};
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
