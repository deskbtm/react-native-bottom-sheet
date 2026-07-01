import { render, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';

import { getDetentTranslateY } from '../detents';
import { mergeLayoutOptions } from '../mergeLayoutOptions';
import { resolveBottomSheetOptions } from '../resolveOptions';
import { useBottomSheetController } from '../useBottomSheetController';

import { createSharedValue } from './testUtils';

jest.mock('react-native-keyboard-controller', () => ({
	useAnimatedKeyboard: jest.fn(),
}));

const mockUseAnimatedKeyboard = jest.mocked(useAnimatedKeyboard);

const SCREEN_HEIGHT = 844;
const TOP_INSET = 47;

describe('useBottomSheetController', () => {
	beforeEach(() => {
		mockUseAnimatedKeyboard.mockReturnValue({
			height: createSharedValue(0),
		} as ReturnType<typeof useAnimatedKeyboard>);
	});

	test('snaps to detent position using custom layout.detents fractions', async () => {
		const positionRef: { current: number | null } = { current: null };
		const layout = mergeLayoutOptions({ detents: { medium: 0.6 } });
		const options = resolveBottomSheetOptions({
			snapPoints: ['medium'],
			index: 0,
		});
		const expectedY = getDetentTranslateY(
			'medium',
			SCREEN_HEIGHT,
			TOP_INSET,
			layout.detents,
		);

		function ControllerProbe() {
			const progress = createSharedValue(0);
			const controller = useBottomSheetController({
				options,
				layout,
				progress,
				screenHeight: SCREEN_HEIGHT,
				topInset: TOP_INSET,
				bottomInset: 34,
				onDismissComplete: jest.fn(),
				onDismissHandlerChange: jest.fn(),
				onControllerReady: jest.fn(),
			});

			useEffect(() => {
				positionRef.current = controller.animatedPosition.value;
			}, [controller.animatedPosition.value]);

			return null;
		}

		await render(<ControllerProbe />);

		await waitFor(() => {
			expect(positionRef.current).toBe(expectedY);
		});
	});
});
