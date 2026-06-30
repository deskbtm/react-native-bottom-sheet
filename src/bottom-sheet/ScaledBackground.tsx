import type { ReactNode } from 'react';
import {
	StyleSheet,
	useWindowDimensions,
	type StyleProp,
	type ViewStyle,
} from 'react-native';
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
import { getBottomSheetCornerRadius } from './pushLayout';

interface ScaledBackgroundProps {
	children: ReactNode;
	progress: SharedValue<number>;
	/** When false, avoid clipping so stack transitions are not cut off. */
	clipWhenPresented?: boolean;
	style?: StyleProp<ViewStyle>;
}

export function ScaledBackground({
	children,
	progress,
	clipWhenPresented = false,
	style,
}: ScaledBackgroundProps) {
	const { width: screenWidth } = useWindowDimensions();

	const animatedStyle = useAnimatedStyle(() => ({
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
	}));

	return (
		<Animated.View
			style={[
				styles.scaledScreen,
				clipWhenPresented && styles.scaledScreenClipped,
				style,
				animatedStyle,
			]}
		>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	scaledScreen: {
		flex: 1,
	},
	scaledScreenClipped: {
		overflow: 'hidden',
	},
});
