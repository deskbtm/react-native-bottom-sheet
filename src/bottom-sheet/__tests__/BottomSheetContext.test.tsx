import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import {
	BottomSheetActionsContext,
	BottomSheetSheetStoreContext,
	useBottomSheet,
} from '../BottomSheetContext';
import { createBottomSheetSheetStore } from '../bottomSheetSheetStore';

describe('useBottomSheet', () => {
	const sheetStore = createBottomSheetSheetStore();
	const actions = {
		mode: 'presentation' as const,
		present: jest.fn(() => 'sheet-test'),
		dismiss: jest.fn(),
		dismissAll: jest.fn(),
	};

	function SheetProbe() {
		const sheet = useBottomSheet();

		return (
			<Text testID="sheet-state">
				{sheet.mode}:{sheet.presentedSheetCount}:{sheet.isPresented ? 'yes' : 'no'}
			</Text>
		);
	}

	test('merges actions with sheet store snapshot', async () => {
		sheetStore.setSnapshot({
			isPresented: true,
			presentedSheetCount: 2,
			topSheetId: 'sheet-a',
			topSheetController: null,
		});

		await render(
			<BottomSheetActionsContext.Provider value={actions}>
				<BottomSheetSheetStoreContext.Provider value={sheetStore}>
					<SheetProbe />
				</BottomSheetSheetStoreContext.Provider>
			</BottomSheetActionsContext.Provider>,
		);

		expect(screen.getByTestId('sheet-state')).toHaveTextContent('presentation:2:yes');
	});

	test('throws outside BottomSheetProvider contexts', async () => {
		function OutsideProbe() {
			useBottomSheet();
			return null;
		}

		await expect(render(<OutsideProbe />)).rejects.toThrow(
			'useBottomSheet must be used within BottomSheetProvider',
		);
	});
});
