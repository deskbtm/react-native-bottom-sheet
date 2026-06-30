import { fireEvent, render, screen } from '@testing-library/react-native';

import { BottomSheetBackdrop } from '../BottomSheetBackdrop';

import { createSharedValue } from './testUtils';

describe('<BottomSheetBackdrop />', () => {
	test('calls onPress when the scrim is pressed', async () => {
		const onPress = jest.fn();

		await render(
			<BottomSheetBackdrop
				progress={createSharedValue(1)}
				letterboxColor="#000000"
				peakOpacity={0.45}
				onPress={onPress}
				accessibilityLabel="Dismiss bottom sheet"
			/>,
		);

		await fireEvent.press(screen.getByLabelText('Dismiss bottom sheet'));

		expect(onPress).toHaveBeenCalledTimes(1);
	});

	test('uses the default accessibility label', async () => {
		await render(
			<BottomSheetBackdrop
				progress={createSharedValue(0)}
				letterboxColor="#000000"
				peakOpacity={1}
				onPress={jest.fn()}
			/>,
		);

		expect(screen.getByLabelText('Close bottom sheet')).toBeTruthy();
	});
});
