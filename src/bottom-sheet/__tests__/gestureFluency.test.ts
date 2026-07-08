import {
	extractAllUseAnimatedStyleBodies,
	extractGestureHandlerBodies,
	extractUseAnimatedStyleBody,
	findForbiddenTokens,
	readModuleSource,
} from './gestureFluencyInvariants';

const FORBIDDEN_UI_THREAD_BRIDGE = ['scheduleOnRN', 'runOnJS'] as const;

const FORBIDDEN_BUNDLE_MODE_CAPTURE = [
	'controller.',
	'handlePanGesture',
	'contentPanGesture',
	'sheetDragGesture',
	'Gesture.Pan',
] as const;

const FORBIDDEN_REACT_IN_WORKLET = [
	'useState',
	'useReducer',
	'useContext',
	'useSyncExternalStore',
	'useEffect',
	'useLayoutEffect',
] as const;

function expectAnimatedStyleBodiesClean(sourcePath: string): void {
	const source = readModuleSource(sourcePath);
	const bodies = extractAllUseAnimatedStyleBodies(source);

	expect(bodies.length).toBeGreaterThan(0);

	for (const body of bodies) {
		expect(findForbiddenTokens(body, FORBIDDEN_UI_THREAD_BRIDGE)).toEqual([]);
		expect(findForbiddenTokens(body, FORBIDDEN_REACT_IN_WORKLET)).toEqual([]);
		expect(findForbiddenTokens(body, FORBIDDEN_BUNDLE_MODE_CAPTURE)).toEqual([]);
	}
}

describe('gesture fluency invariants', () => {
	const controllerSource = readModuleSource('useBottomSheetController.ts');
	const hostSource = readModuleSource('BottomSheetHost.tsx');

	test('pan onUpdate handlers stay on the UI thread (no scheduleOnRN)', () => {
		const onUpdateBodies = extractGestureHandlerBodies(controllerSource, 'onUpdate');

		expect(onUpdateBodies.length).toBeGreaterThanOrEqual(2);

		for (const body of onUpdateBodies) {
			expect(findForbiddenTokens(body, FORBIDDEN_UI_THREAD_BRIDGE)).toEqual([]);
			expect(body).toContain('applySheetDragUpdate');
		}
	});

	test('pan onEnd handlers may bridge to JS for dismiss and detent callbacks', () => {
		const onEndBodies = extractGestureHandlerBodies(controllerSource, 'onEnd');

		expect(onEndBodies.length).toBeGreaterThanOrEqual(2);
		expect(onEndBodies.some((body) => body.includes('scheduleOnRN'))).toBe(true);
		expect(onEndBodies.some((body) => body.includes('resolveSheetPanEnd'))).toBe(true);
	});

	test('BottomSheetHost animated style reads SharedValues only (no React hooks / JS bridge)', () => {
		const animatedStyleBody = extractUseAnimatedStyleBody(hostSource);

		expect(findForbiddenTokens(animatedStyleBody, FORBIDDEN_UI_THREAD_BRIDGE)).toEqual(
			[],
		);
		expect(findForbiddenTokens(animatedStyleBody, FORBIDDEN_REACT_IN_WORKLET)).toEqual(
			[],
		);
		expect(animatedStyleBody.includes('.value')).toBe(true);
		expect(animatedStyleBody).toContain('scalars.');
	});

	test('push sheet animated styles stay on the UI thread', () => {
		expectAnimatedStyleBodiesClean('usePushSheetStyle.ts');
	});

	test('stack card animated style stays on the UI thread', () => {
		expectAnimatedStyleBodiesClean('useStackCardStyle.ts');
	});

	test('overlay animated styles stay on the UI thread', () => {
		expectAnimatedStyleBodiesClean('BottomSheetOverlay.tsx');
	});

	test('backdrop animated style stays on the UI thread', () => {
		expectAnimatedStyleBodiesClean('BottomSheetBackdrop.tsx');
	});

	test('mask animated style stays on the UI thread', () => {
		expectAnimatedStyleBodiesClean('BottomSheetMask.tsx');
	});
});
