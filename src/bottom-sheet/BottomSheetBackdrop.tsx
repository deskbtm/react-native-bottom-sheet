import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
	interpolate,
	useAnimatedStyle,
	type SharedValue,
} from 'react-native-reanimated';

interface BottomSheetBackdropProps {
	progress: SharedValue<number>;
	letterboxColor: string;
	/** Opacity when the sheet is fully presented (`1` = solid letterbox). */
	peakOpacity: number;
	/**
	 * When true, letterbox stays solid while mounted (not tied to sheet detent progress).
	 * Use for the provider layer; overlay scrim keeps progress-linked opacity.
	 */
	solid?: boolean;
	onPress: () => void;
	accessibilityLabel?: string;
	style?: StyleProp<ViewStyle>;
}

export function BottomSheetBackdrop({
	progress,
	letterboxColor,
	peakOpacity,
	solid = false,
	onPress,
	accessibilityLabel = 'Close bottom sheet',
	style,
}: BottomSheetBackdropProps) {
	const animatedStyle = useAnimatedStyle(() => ({
		opacity: solid ? peakOpacity : interpolate(progress.value, [0, 1], [0, peakOpacity]),
	}));

	return (
		<Animated.View
			style={[styles.backdrop, { backgroundColor: letterboxColor }, style, animatedStyle]}
		>
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
	backdrop: {
		...StyleSheet.absoluteFill,
	},
});
