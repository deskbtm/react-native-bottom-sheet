import { useAnimatedKeyboard } from 'react-native-keyboard-controller';
import { useDerivedValue } from 'react-native-reanimated';

import type { BottomSheetKeyboardBehavior } from './types';

export function useBottomSheetKeyboard(
	behavior: BottomSheetKeyboardBehavior,
	enabled: boolean,
) {
	const keyboard = useAnimatedKeyboard();

	const keyboardOffset = useDerivedValue(() => {
		if (!enabled) {
			return 0;
		}

		const keyboardHeight = keyboard.height.value;

		switch (behavior) {
			case 'interactive':
			case 'fillParent':
				// Keyboard height is already screen-bottom anchored; do not add safe-area inset
				// or the sheet floats above the keyboard.
				return keyboardHeight;
			case 'extend':
			default:
				return 0;
		}
	});

	return {
		keyboardHeight: keyboard.height,
		keyboardOffset,
	};
}
