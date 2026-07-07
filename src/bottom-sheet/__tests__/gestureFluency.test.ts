import {
	extractGestureHandlerBodies,
	extractUseAnimatedStyleBody,
	findForbiddenTokens,
	readModuleSource,
} from './gestureFluencyInvariants';

const FORBIDDEN_UI_THREAD_BRIDGE = ['scheduleOnRN', 'runOnJS'] as const;

const FORBIDDEN_REACT_IN_WORKLET = [
	'useState',
	'useReducer',
	'useContext',
	'useSyncExternalStore',
	'useEffect',
	'useLayoutEffect',
] as const;

describe('gesture fluency invariants', () => {
	const controllerSource = readModuleSource('useBottomSheetController.ts');
	const hostSource = readModuleSource('BottomSheetHost.tsx');

	test('pan onUpdate handlers stay on the UI thread (no scheduleOnRN)', () => {
		const onUpdateBodies = extractGestureHandlerBodies(controllerSource, 'onUpdate');

		expect(onUpdateBodies.length).toBeGreaterThanOrEqual(2);

		for (const body of onUpdateBodies) {
			expect(findForbiddenTokens(body, FORBIDDEN_UI_THREAD_BRIDGE)).toEqual([]);
		}
	});

	test('pan onEnd handlers may bridge to JS for dismiss and detent callbacks', () => {
		const onEndBodies = extractGestureHandlerBodies(controllerSource, 'onEnd');

		expect(onEndBodies.length).toBeGreaterThanOrEqual(2);
		expect(onEndBodies.some((body) => body.includes('scheduleOnRN'))).toBe(true);
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
	});
});
