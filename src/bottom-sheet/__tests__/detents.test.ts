import {
	buildDynamicSheetHeight,
	buildDynamicSnapPoint,
	clampIndex,
	findDetentIndex,
	findNearestDetentIndex,
	getDetentHeight,
	getDetentTranslateY,
	getTranslateYFromSheetHeight,
	mergeSnapPoints,
} from '../detents';
import type { BottomSheetDetent } from '../types';

const SCREEN_HEIGHT = 800;
const TOP_INSET = 50;

describe('getDetentHeight', () => {
	test('resolves percentage snap points as fractions of screen height', () => {
		expect(getDetentHeight('50%', SCREEN_HEIGHT, TOP_INSET)).toBe(400);
		expect(getDetentHeight('90%', SCREEN_HEIGHT, TOP_INSET)).toBe(720);
	});

	test('resolves numeric snap points as fractions of screen height', () => {
		expect(getDetentHeight(0.5, SCREEN_HEIGHT, TOP_INSET)).toBe(400);
		expect(getDetentHeight(0.9, SCREEN_HEIGHT, TOP_INSET)).toBe(720);
	});

	test('full detent subtracts top inset from screen height', () => {
		expect(getDetentHeight('full', SCREEN_HEIGHT, TOP_INSET)).toBe(750);
	});

	test('accepts numeric fractions and clamps to 0-1', () => {
		expect(getDetentHeight(0.25, SCREEN_HEIGHT, TOP_INSET)).toBe(200);
		expect(getDetentHeight(1.5, SCREEN_HEIGHT, TOP_INSET)).toBe(800);
		expect(getDetentHeight(-0.2, SCREEN_HEIGHT, TOP_INSET)).toBe(0);
	});

	test('accepts percentage strings', () => {
		expect(getDetentHeight('60%', SCREEN_HEIGHT, TOP_INSET)).toBe(480);
	});
});

describe('getDetentTranslateY', () => {
	test('returns screen height minus detent height', () => {
		expect(getDetentTranslateY('50%', SCREEN_HEIGHT, TOP_INSET)).toBe(400);
		expect(getDetentTranslateY('full', SCREEN_HEIGHT, TOP_INSET)).toBe(50);
	});
});

describe('findNearestDetentIndex', () => {
	const detents: BottomSheetDetent[] = ['50%', '90%', 'full'];

	test('picks the closest snap point by translateY', () => {
		expect(findNearestDetentIndex(410, detents, SCREEN_HEIGHT, TOP_INSET)).toBe(0);
		expect(findNearestDetentIndex(52, detents, SCREEN_HEIGHT, TOP_INSET)).toBe(2);
		expect(findNearestDetentIndex(80, detents, SCREEN_HEIGHT, TOP_INSET)).toBe(1);
	});
});

describe('findDetentIndex', () => {
	test('returns index when detent exists in list', () => {
		expect(findDetentIndex(['medium', 'large'], 'large')).toBe(1);
	});

	test('returns 0 when detent is missing', () => {
		expect(findDetentIndex(['medium'], 'full')).toBe(0);
	});
});

describe('clampIndex', () => {
	test('clamps index within detent count bounds', () => {
		expect(clampIndex(2, 3)).toBe(2);
		expect(clampIndex(5, 3)).toBe(2);
		expect(clampIndex(-1, 3)).toBe(0);
	});

	test('returns 0 when there are no detents', () => {
		expect(clampIndex(3, 0)).toBe(0);
	});
});

describe('buildDynamicSheetHeight', () => {
	test('sums content, handle, and bottom inset', () => {
		expect(buildDynamicSheetHeight(200, SCREEN_HEIGHT, TOP_INSET, 34, 25)).toBe(259);
	});

	test('caps height at screen minus top inset', () => {
		expect(buildDynamicSheetHeight(900, SCREEN_HEIGHT, TOP_INSET, 34, 25)).toBe(750);
	});
});

describe('getTranslateYFromSheetHeight', () => {
	test('positions sheet top from height', () => {
		expect(getTranslateYFromSheetHeight(400, SCREEN_HEIGHT)).toBe(400);
	});
});

describe('buildDynamicSnapPoint', () => {
	test('returns height as fraction of screen height', () => {
		expect(buildDynamicSnapPoint(200, SCREEN_HEIGHT, TOP_INSET, 34, 25)).toBeCloseTo(
			259 / SCREEN_HEIGHT,
		);
	});
});

describe('mergeSnapPoints', () => {
	test('returns provided snap points when dynamic sizing is disabled', () => {
		expect(mergeSnapPoints(['large'], null, false)).toEqual(['large']);
	});

	test('falls back to medium when dynamic sizing is disabled and list is empty', () => {
		expect(mergeSnapPoints([], null, false)).toEqual(['medium']);
	});

	test('returns only dynamic snap point when list is empty and dynamic sizing is enabled', () => {
		expect(mergeSnapPoints([], 0.6, true)).toEqual([0.6]);
	});

	test('appends dynamic snap point to existing snap points', () => {
		expect(mergeSnapPoints(['medium'], 0.6, true)).toEqual(['medium', 0.6]);
	});

	test('returns original snap points when dynamic sizing is enabled but point is null', () => {
		expect(mergeSnapPoints(['medium', 'large'], null, true)).toEqual(['medium', 'large']);
	});
});
