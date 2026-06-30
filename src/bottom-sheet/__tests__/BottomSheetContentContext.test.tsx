import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import {
	useBottomSheetContent,
	useBottomSheetModalMethods,
} from '../BottomSheetContentContext';

import { renderWithBottomSheetContent } from './testUtils';

describe('useBottomSheetContent', () => {
	function HookProbe() {
		const { close, expand, collapse, snapToIndex } = useBottomSheetContent();
		const modalMethods = useBottomSheetModalMethods();

		return (
			<Text
				testID="hook-probe"
				onPress={() => {
					close();
					expand();
					collapse();
					snapToIndex(1);
					modalMethods.dismiss();
				}}
			>
				Probe
			</Text>
		);
	}

	test('exposes controller actions', async () => {
		const context = {
			close: jest.fn(),
			expand: jest.fn(),
			collapse: jest.fn(),
			snapToIndex: jest.fn(),
		};

		await renderWithBottomSheetContent(<HookProbe />, context);

		await fireEvent.press(screen.getByTestId('hook-probe'));

		expect(context.close).toHaveBeenCalledTimes(2);
		expect(context.expand).toHaveBeenCalledTimes(1);
		expect(context.collapse).toHaveBeenCalledTimes(1);
		expect(context.snapToIndex).toHaveBeenCalledWith(1);
	});

	test('throws outside sheet content', async () => {
		function OutsideHookProbe() {
			useBottomSheetContent();
			return null;
		}

		await expect(render(<OutsideHookProbe />)).rejects.toThrow(
			'Sheet compound components must be rendered inside BottomSheetModal or present() content.',
		);
	});
});
