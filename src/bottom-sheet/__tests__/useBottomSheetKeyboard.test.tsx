import { render } from '@testing-library/react-native';
import { useAnimatedKeyboard } from 'react-native-keyboard-controller';

import { useBottomSheetKeyboard } from '../useBottomSheetKeyboard';

import { createSharedValue } from './testUtils';

jest.mock('react-native-keyboard-controller', () => ({
	useAnimatedKeyboard: jest.fn(),
}));

const mockUseAnimatedKeyboard = jest.mocked(useAnimatedKeyboard);

describe('useBottomSheetKeyboard', () => {
	beforeEach(() => {
		mockUseAnimatedKeyboard.mockReturnValue({
			height: createSharedValue(280),
		} as ReturnType<typeof useAnimatedKeyboard>);
	});

	function KeyboardProbe({
		behavior,
		enabled,
		resultRef,
	}: {
		behavior: 'interactive' | 'fillParent' | 'extend';
		enabled: boolean;
		resultRef: { current: { keyboardHeight: number; keyboardOffset: number } | null };
	}) {
		const { keyboardHeight, keyboardOffset } = useBottomSheetKeyboard(behavior, enabled);
		resultRef.current = {
			keyboardHeight: keyboardHeight.value,
			keyboardOffset: keyboardOffset.value,
		};

		return null;
	}

	test('returns keyboard height as offset for interactive behavior', async () => {
		const resultRef: {
			current: { keyboardHeight: number; keyboardOffset: number } | null;
		} = { current: null };

		await render(<KeyboardProbe behavior="interactive" enabled resultRef={resultRef} />);

		expect(resultRef.current?.keyboardHeight).toBe(280);
		expect(resultRef.current?.keyboardOffset).toBe(280);
	});

	test('returns keyboard height as offset for fillParent behavior', async () => {
		const resultRef: {
			current: { keyboardHeight: number; keyboardOffset: number } | null;
		} = { current: null };

		await render(<KeyboardProbe behavior="fillParent" enabled resultRef={resultRef} />);

		expect(resultRef.current?.keyboardOffset).toBe(280);
	});

	test('returns zero offset for extend behavior', async () => {
		const resultRef: {
			current: { keyboardHeight: number; keyboardOffset: number } | null;
		} = { current: null };

		await render(<KeyboardProbe behavior="extend" enabled resultRef={resultRef} />);

		expect(resultRef.current?.keyboardHeight).toBe(280);
		expect(resultRef.current?.keyboardOffset).toBe(0);
	});

	test('returns zero offset when keyboard handling is disabled', async () => {
		const resultRef: {
			current: { keyboardHeight: number; keyboardOffset: number } | null;
		} = { current: null };

		await render(
			<KeyboardProbe behavior="interactive" enabled={false} resultRef={resultRef} />,
		);

		expect(resultRef.current?.keyboardOffset).toBe(0);
	});
});
