import {
	extractAnimatedScrollHandlerBody,
	extractGestureHandlerBodies,
	extractUseMemoBlock,
	findForbiddenTokens,
	readModuleSource,
} from './gestureFluencyInvariants';

const FORBIDDEN_UI_THREAD_BRIDGE = ['scheduleOnRN', 'runOnJS'] as const;

describe('sheet scroll fluency invariants', () => {
	const controllerSource = readModuleSource('useBottomSheetController.ts');
	const scrollablesSource = readModuleSource('BottomSheetScrollables.tsx');

	test('content pan fails when scroll offset is above epsilon', () => {
		const contentPanBlock = extractUseMemoBlock(controllerSource, 'contentPanGesture');
		const onTouchesMoveBodies = extractGestureHandlerBodies(
			contentPanBlock,
			'onTouchesMove',
		);

		expect(onTouchesMoveBodies.length).toBeGreaterThanOrEqual(1);

		for (const body of onTouchesMoveBodies) {
			expect(body).toContain('scrollOffset.value');
			expect(body).toContain('scrollOffsetEpsilon');
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

	test('scroll handler onScroll stays on the UI thread', () => {
		const onScrollBody = extractAnimatedScrollHandlerBody(scrollablesSource);

		expect(findForbiddenTokens(onScrollBody, FORBIDDEN_UI_THREAD_BRIDGE)).toEqual([]);
		expect(onScrollBody).toContain('scrollOffset.value');
	});
});
