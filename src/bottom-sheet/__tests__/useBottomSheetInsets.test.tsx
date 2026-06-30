import { Platform, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import {
	getEffectiveSheetBottomInset,
	useBottomSheetInsets,
} from '../useBottomSheetInsets';

const mockUseSafeAreaInsets = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
	useSafeAreaInsets: () => mockUseSafeAreaInsets(),
}));

describe('getEffectiveSheetBottomInset', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('trusts reported inset when it is large enough', () => {
		expect(getEffectiveSheetBottomInset(34)).toBe(34);
	});

	test('uses Android nav bar fallback when inset is too small', () => {
		jest.replaceProperty(Platform, 'OS', 'android');

		expect(getEffectiveSheetBottomInset(0)).toBe(48);
	});

	test('uses iOS home indicator fallback when inset is too small', () => {
		jest.replaceProperty(Platform, 'OS', 'ios');

		expect(getEffectiveSheetBottomInset(0)).toBe(34);
	});
});

describe('useBottomSheetInsets', () => {
	beforeEach(() => {
		jest.replaceProperty(Platform, 'OS', 'ios');
		mockUseSafeAreaInsets.mockReturnValue({
			top: 59,
			left: 0,
			right: 0,
			bottom: 0,
		});
	});

	test('returns safe area edges with an effective bottom inset', async () => {
		function InsetsProbe() {
			const insets = useBottomSheetInsets();

			return (
				<Text testID="insets">
					{insets.top},{insets.left},{insets.right},{insets.bottom}
				</Text>
			);
		}

		await render(<InsetsProbe />);

		expect(screen.getByTestId('insets')).toHaveTextContent('59,0,0,34');
	});
});
