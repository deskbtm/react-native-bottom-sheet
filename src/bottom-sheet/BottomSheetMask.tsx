import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

interface BottomSheetMaskProps {
	/** Sheet top edge in screen coordinates — mask fills `[0, sheetTopY)`. */
	sheetTopY: SharedValue<number>;
	/**
	 * When true, tapping the mask dismisses the sheet.
	 * When false, the mask absorbs taps without dismissing.
	 */
	pressable: boolean;
	onPress: () => void;
	/** Mask fill color. Default `transparent`. */
	color?: string;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
}

/**
 * Region above the sheet card (not the sheet body). Sheet content below stays interactive.
 */
export function BottomSheetMask({
	sheetTopY,
	pressable,
	onPress,
	color = 'transparent',
	accessibilityLabel = 'Close bottom sheet',
	style,
}: BottomSheetMaskProps) {
	const maskLayoutStyle = useAnimatedStyle(() => ({
		height: Math.max(0, sheetTopY.value),
	}));

	const maskVisual = (
		<Animated.View
			pointerEvents="none"
			style={[styles.maskFill, { backgroundColor: color }, maskLayoutStyle, style]}
		/>
	);

	if (!pressable) {
		return (
			<Animated.View style={[styles.maskHitTarget, maskLayoutStyle]} pointerEvents="auto">
				{maskVisual}
			</Animated.View>
		);
	}

	return (
		<Animated.View style={[styles.maskHitTarget, maskLayoutStyle]}>
			{maskVisual}
			<Pressable
				style={StyleSheet.absoluteFill}
				onPress={onPress}
				accessibilityRole="button"
				accessibilityLabel={accessibilityLabel}
			/>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	maskHitTarget: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		overflow: 'hidden',
	},
	maskFill: {
		width: '100%',
	},
});
