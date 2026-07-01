import {
	extractGestureHandlerBodies,
	extractUseMemoBlock,
	readModuleSource,
} from './gestureFluencyInvariants';

describe('sheet scroll fluency invariants', () => {
	const controllerSource = readModuleSource('useBottomSheetController.ts');
	const scrollablesSource = readModuleSource('BottomSheetScrollables.tsx');

	test('content pan fails when scroll offset is above epsilon', () => {
		const contentPanBlock = extractUseMemoBlock(controllerSource, 'contentPanGesture');
		const onTouchesMoveBodies = extractGestureHandlerBodies(contentPanBlock, 'onTouchesMove');

		expect(onTouchesMoveBodies.length).toBeGreaterThanOrEqual(1);

		for (const body of onTouchesMoveBodies) {
			expect(body).toContain('scrollOffset.value');
			expect(body).toContain('scroll.offsetEpsilon');
			expect(body).toContain('state.fail()');
		}
	});

	test('handle pan stays independent of scroll offset', () => {
		const handlePanBlock = extractUseMemoBlock(controllerSource, 'handlePanGesture');

		expect(handlePanBlock.includes('scrollOffset')).toBe(false);
		expect(handlePanBlock.includes('manualActivation')).toBe(false);
	});

	test('library scrollables write scrollOffset from animated scroll handler', () => {
		expect(scrollablesSource).toContain('useAnimatedScrollHandler');
		expect(scrollablesSource).toContain('scrollOffset.value');
		expect(scrollablesSource).toContain('Gesture.Native()');
	});
});
