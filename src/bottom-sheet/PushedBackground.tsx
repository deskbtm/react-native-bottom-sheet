import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import {
	getBottomSheetCornerRadius,
	getPushHostPushUp,
	getPushScale,
	PUSH_TRANSFORM_ORIGIN,
} from './pushLayout';

interface PushedBackgroundProps {
	children: ReactNode;
	sheetTopY: SharedValue<number>;
	progress: SharedValue<number>;
	screenHeight: number;
	screenWidth: number;
	style?: StyleProp<ViewStyle>;
}

/**
 * Push layout: host scales down uniformly and translates up with the sheet.
 * Scale is GPU-only (no layout reflow). Bottom-anchored so the card sits above the sheet.
 */
export function PushedBackground({
	children,
	sheetTopY,
	progress,
	screenHeight,
	screenWidth,
	style,
}: PushedBackgroundProps) {
	const animatedStyle = useAnimatedStyle(() => {
		const scale = getPushScale(screenWidth, progress.value);
		const radius = getBottomSheetCornerRadius(progress.value);
		const pushUp = getPushHostPushUp(
			screenWidth,
			screenHeight,
			sheetTopY.value,
			progress.value,
		);

		return {
			borderBottomLeftRadius: radius,
			borderBottomRightRadius: radius,
			transformOrigin: PUSH_TRANSFORM_ORIGIN,
			transform: [{ translateY: -pushUp }, { scale }],
		};
	});

	return (
		<Animated.View style={[styles.pushedScreen, style, animatedStyle]}>
			{children}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	pushedScreen: {
		flex: 1,
		overflow: 'hidden',
	},
});
