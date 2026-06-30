import {
	getBottomSheetScrollBottomPadding,
	getPresentationHostTopInset,
	PRESENTATION_HOST_SCALE,
	PRESENTATION_HOST_TOP_INSET_MIN,
	PUSH_HOST_HORIZONTAL_INSET,
	pushInsetToScale,
	SHEET_SCROLL_END_EXTRA,
} from '../constants';

describe('getPresentationHostTopInset', () => {
	test('uses side letterbox on wide screens', () => {
		const screenWidth = 1200;
		const sideLetterbox = (screenWidth * (1 - PRESENTATION_HOST_SCALE)) / 2;

		expect(getPresentationHostTopInset(screenWidth)).toBe(sideLetterbox);
		expect(sideLetterbox).toBeGreaterThan(PRESENTATION_HOST_TOP_INSET_MIN);
	});

	test('enforces minimum top inset on narrow screens', () => {
		expect(getPresentationHostTopInset(320)).toBe(PRESENTATION_HOST_TOP_INSET_MIN);
	});
});

describe('pushInsetToScale', () => {
	test('returns 1 when screen width is zero', () => {
		expect(pushInsetToScale(0, PUSH_HOST_HORIZONTAL_INSET)).toBe(1);
	});

	test('shrinks uniformly based on horizontal inset', () => {
		const screenWidth = 390;
		const expected = (screenWidth - PUSH_HOST_HORIZONTAL_INSET * 2) / screenWidth;

		expect(pushInsetToScale(screenWidth, PUSH_HOST_HORIZONTAL_INSET)).toBeCloseTo(
			expected,
		);
	});

	test('never returns negative scale', () => {
		expect(pushInsetToScale(10, 100)).toBe(0);
	});
});

describe('getBottomSheetScrollBottomPadding', () => {
	test('adds scroll end extra to bottom inset', () => {
		expect(getBottomSheetScrollBottomPadding(34)).toBe(34 + SHEET_SCROLL_END_EXTRA);
	});
});
