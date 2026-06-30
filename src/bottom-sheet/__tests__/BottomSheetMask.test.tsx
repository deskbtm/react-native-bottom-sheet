import { fireEvent, render, screen } from '@testing-library/react-native';

import { BottomSheetMask } from '../BottomSheetMask';

import { createSharedValue } from './testUtils';

describe('<BottomSheetMask />', () => {
	test('calls onPress when pressable and the mask is tapped', async () => {
		const onPress = jest.fn();

		await render(
			<BottomSheetMask
				sheetTopY={createSharedValue(120)}
				pressable
				onPress={onPress}
				accessibilityLabel="Dismiss bottom sheet"
			/>,
		);

		await fireEvent.press(screen.getByLabelText('Dismiss bottom sheet'));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test('does not expose a dismiss button when pressable is false', async () => {
		await render(
			<BottomSheetMask
				sheetTopY={createSharedValue(120)}
				pressable={false}
				onPress={jest.fn()}
				accessibilityLabel="Dismiss bottom sheet"
			/>,
		);

		expect(screen.queryByLabelText('Dismiss bottom sheet')).toBeNull();
	});
});
