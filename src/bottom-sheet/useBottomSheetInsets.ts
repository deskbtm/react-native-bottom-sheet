import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** When reported inset is at least this large, trust it (simulators and notched devices). */
const TRUSTED_BOTTOM_INSET = 16;

/** Edge-to-edge Android often reports 0 while the navigation bar still overlaps content. */
const ANDROID_NAV_BAR_INSET = 48;

/** iOS home-indicator fallback when safe area is not reported. */
const IOS_HOME_INDICATOR_INSET = 34;

/**
 * Bottom inset for sheet layout. Real Android devices frequently report 0 under edge-to-edge
 * while the system nav bar still covers the last pixels of scroll content.
 */
export function getEffectiveSheetBottomInset(bottomInset: number): number {
	if (bottomInset >= TRUSTED_BOTTOM_INSET) {
		return bottomInset;
	}

	if (Platform.OS === 'android') {
		return ANDROID_NAV_BAR_INSET;
	}

	if (Platform.OS === 'ios') {
		return IOS_HOME_INDICATOR_INSET;
	}

	return bottomInset;
}

/** Safe area insets with a reliable bottom value for sheet content and height math. */
export function useBottomSheetInsets() {
	const insets = useSafeAreaInsets();

	return {
		top: insets.top,
		left: insets.left,
		right: insets.right,
		bottom: getEffectiveSheetBottomInset(insets.bottom),
	};
}
