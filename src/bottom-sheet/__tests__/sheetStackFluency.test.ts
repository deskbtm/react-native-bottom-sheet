import { readModuleSource } from './gestureFluencyInvariants';

describe('multi-sheet stack invariants', () => {
	const stackItemSource = readModuleSource('BottomSheetStackItem.tsx');
	const overlayHostSource = readModuleSource('BottomSheetOverlayHost.tsx');

	test('bottom sheet drives shared host progress; buried sheets use local progress', () => {
		expect(stackItemSource).toContain(
			'stackIndex === 0 ? bottomProgress : stackedProgress',
		);
		expect(stackItemSource).toContain('const stackedProgress = useSharedValue(0)');
	});

	test('stack card styling applies only in presentation-on-presentation stacks', () => {
		expect(stackItemSource).toContain("hostMode === 'presentation'");
		expect(stackItemSource).toContain("sheet.options.mode === 'presentation'");
		expect(stackItemSource).toContain('enableStackCardStyle={usePresentationStack}');
		expect(stackItemSource).toContain('stackSize - 1 - stackIndex');
	});

	test('push host sync is wired only to the bottom stack item', () => {
		expect(overlayHostSource).toContain(
			'syncHostSheetTopY && index === 0 ? engine.hostSheetTopY',
		);
		expect(overlayHostSource).toContain(
			'syncHostSheetTopY && index === 0 ? engine.pushProgressOpenY',
		);
	});

	test('overlay host renders every sheet in the stack', () => {
		expect(overlayHostSource).toContain('sheets.map(');
		expect(overlayHostSource.includes('sheets.slice(')).toBe(false);
	});
});
