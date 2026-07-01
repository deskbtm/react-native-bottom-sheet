import { cleanup, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { PRESENTATION_HOST_SCALE } from '../constants';
import { DEFAULT_LAYOUT_OPTIONS } from '../mergeLayoutOptions';
import type { BottomSheetEngine } from '../useBottomSheetEngine';
import { useBottomSheetEngine } from '../useBottomSheetEngine';

const mockUseWindowDimensions = jest
	.spyOn(require('react-native'), 'useWindowDimensions')
	.mockReturnValue({
		width: 390,
		height: 844,
		scale: 2,
		fontScale: 2,
	});

function EngineHarness({
	engineRef,
}: {
	engineRef: { current: BottomSheetEngine | null };
}) {
	const engine = useBottomSheetEngine({ mode: 'presentation' });
	engineRef.current = engine;

	return null;
}

async function renderEngine(engineRef: { current: BottomSheetEngine | null }) {
	await render(<EngineHarness engineRef={engineRef} />);
}

describe('useBottomSheetEngine', () => {
	afterEach(async () => {
		await cleanup();
	});

	test('uses window dimensions for layout math', async () => {
		const engineRef: { current: BottomSheetEngine | null } = { current: null };

		await renderEngine(engineRef);

		expect(mockUseWindowDimensions).toHaveBeenCalled();
		expect(engineRef.current?.screenWidth).toBe(390);
		expect(engineRef.current?.screenHeight).toBe(844);
	});

	test('merges layout prop with DEFAULT_LAYOUT_OPTIONS at mount', async () => {
		const engineRef: { current: BottomSheetEngine | null } = { current: null };

		function LayoutHarness() {
			const engine = useBottomSheetEngine({
				mode: 'presentation',
				layout: { presentation: { cornerRadius: 32 } },
			});
			engineRef.current = engine;
			return null;
		}

		await render(<LayoutHarness />);

		expect(engineRef.current?.mergedLayout.presentation.cornerRadius).toBe(32);
		expect(engineRef.current?.mergedLayout.presentation.hostScale).toBe(
			PRESENTATION_HOST_SCALE,
		);
		expect(engineRef.current?.mergedLayout.detents).toEqual(
			DEFAULT_LAYOUT_OPTIONS.detents,
		);
	});

	test('merges sheet prop into present() defaults', async () => {
		const engineRef: { current: BottomSheetEngine | null } = { current: null };

		function SheetHarness() {
			const engine = useBottomSheetEngine({
				mode: 'presentation',
				sheet: { snapPoints: ['40%'], enablePanDownToClose: false },
			});
			engineRef.current = engine;
			return null;
		}

		await render(<SheetHarness />);
		engineRef.current!.present(<Text>Sheet</Text>);

		expect(engineRef.current!.sheetsRef.current[0]?.options.snapPoints).toEqual(['40%']);
		expect(engineRef.current!.sheetsRef.current[0]?.options.enablePanDownToClose).toBe(
			false,
		);
	});

	test('present adds a sheet and updates the store snapshot', async () => {
		const engineRef: { current: BottomSheetEngine | null } = { current: null };

		await renderEngine(engineRef);

		let id = '';
		id = engineRef.current!.present(<Text>Sheet</Text>, { snapPoints: ['50%'] });

		expect(id).toMatch(/^sheet-/);
		expect(engineRef.current!.sheetsRef.current).toHaveLength(1);
		expect(engineRef.current!.sheetStore.getSnapshot().isPresented).toBe(true);
		expect(engineRef.current!.sheetStore.getSnapshot().presentedSheetCount).toBe(1);
		expect(engineRef.current!.sheetStore.getSnapshot().topSheetId).toBe(id);
	});

	test('dismiss invokes the registered handler for the top sheet', async () => {
		const engineRef: { current: BottomSheetEngine | null } = { current: null };
		const dismissHandler = jest.fn();

		await renderEngine(engineRef);

		let id = '';
		id = engineRef.current!.present(<Text>Sheet</Text>);
		engineRef.current!.handleDismissHandlerChange(id, dismissHandler);
		engineRef.current!.dismiss();

		expect(dismissHandler).toHaveBeenCalledTimes(1);
	});

	test('handleDismissComplete removes the sheet from the stack', async () => {
		const engineRef: { current: BottomSheetEngine | null } = { current: null };
		const onDismiss = jest.fn();

		await renderEngine(engineRef);

		let id = '';
		id = engineRef.current!.present(<Text>Sheet</Text>, { onDismiss });
		engineRef.current!.handleDismissComplete(id);

		expect(onDismiss).toHaveBeenCalledTimes(1);
		expect(engineRef.current!.sheetsRef.current).toHaveLength(0);
		expect(engineRef.current!.sheetStore.getSnapshot().isPresented).toBe(false);
	});

	test('dismissAll starts closing from the top sheet', async () => {
		const engineRef: { current: BottomSheetEngine | null } = { current: null };
		const topDismissHandler = jest.fn();

		await renderEngine(engineRef);

		let topId = '';
		engineRef.current!.present(<Text>Bottom</Text>);
		topId = engineRef.current!.present(<Text>Top</Text>);
		engineRef.current!.handleDismissHandlerChange(topId, topDismissHandler);
		engineRef.current!.dismissAll();

		expect(topDismissHandler).toHaveBeenCalledTimes(1);
		expect(engineRef.current!.dismissingAllRef.current).toBe(true);
	});
});
