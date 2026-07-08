import { BOTTOM_SHEET_CORNER_RADIUS, PUSH_HOST_HORIZONTAL_INSET } from '../constants';
import { getDetentTranslateY, getPushClosedTopY, getPushDetentTopY } from '../detents';
import { PUSH_DIRECTION_JS } from '../pushDirection';
import {
	getBottomSheetCornerRadius,
	getPushHorizontalInset,
	getPushHostCornerRadiusStyle,
	getPushHostOffset,
	getPushHostOffsetFromSheetTopY,
	getPushHostPushUp,
	getPushHostPushUpFromSheetTopY,
	getPushLayoutProgress,
	getPushScale,
	getPushSheetCornerRadiusStyle,
	getPushTransformOrigin,
	getPushVisualInset,
} from '../pushLayout';

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const TOP_INSET = 59;
const OPEN_Y = 422;

describe('getPushLayoutProgress', () => {
	test('returns 0 when bottom push sheet is fully dismissed', () => {
		expect(
			getPushLayoutProgress(
				SCREEN_HEIGHT,
				OPEN_Y,
				SCREEN_HEIGHT,
				PUSH_DIRECTION_JS.bottom,
				TOP_INSET,
			),
		).toBe(0);
	});

	test('returns 0 when bottom push openY is at screen bottom', () => {
		expect(
			getPushLayoutProgress(
				400,
				SCREEN_HEIGHT,
				SCREEN_HEIGHT,
				PUSH_DIRECTION_JS.bottom,
				TOP_INSET,
			),
		).toBe(0);
	});

	test('returns 1 when bottom push sheet is fully open', () => {
		expect(
			getPushLayoutProgress(
				OPEN_Y,
				OPEN_Y,
				SCREEN_HEIGHT,
				PUSH_DIRECTION_JS.bottom,
				TOP_INSET,
			),
		).toBe(1);
	});

	test('interpolates bottom push between dismissed and open positions', () => {
		const midY = (SCREEN_HEIGHT + OPEN_Y) / 2;
		const progress = getPushLayoutProgress(
			midY,
			OPEN_Y,
			SCREEN_HEIGHT,
			PUSH_DIRECTION_JS.bottom,
			TOP_INSET,
		);

		expect(progress).toBeGreaterThan(0);
		expect(progress).toBeLessThan(1);
	});

	test('returns 1 when top push sheet is fully open', () => {
		const closedY = getPushClosedTopY(PUSH_DIRECTION_JS.top, SCREEN_HEIGHT, 0);

		expect(getPushLayoutProgress(0, 0, SCREEN_HEIGHT, PUSH_DIRECTION_JS.top, 0)).toBe(1);
		expect(closedY).toBe(-SCREEN_HEIGHT);
	});

	test('returns 0 when top push sheet is fully dismissed', () => {
		const closedY = getPushClosedTopY(PUSH_DIRECTION_JS.top, SCREEN_HEIGHT, 0);

		expect(
			getPushLayoutProgress(closedY, 0, SCREEN_HEIGHT, PUSH_DIRECTION_JS.top, 0),
		).toBe(0);
	});
});

describe('getPushDetentTopY', () => {
	test('uses screen-height detent math for bottom push', () => {
		expect(
			getPushDetentTopY('medium', PUSH_DIRECTION_JS.bottom, SCREEN_HEIGHT, TOP_INSET, {
				medium: 0.5,
				large: 0.9,
				full: 1,
			}),
		).toBe(
			getDetentTranslateY('medium', SCREEN_HEIGHT, TOP_INSET, {
				medium: 0.5,
				large: 0.9,
				full: 1,
			}),
		);
	});

	test('uses immersive top edge for top push detents', () => {
		expect(
			getPushDetentTopY('medium', PUSH_DIRECTION_JS.top, SCREEN_HEIGHT, TOP_INSET, {
				medium: 0.5,
				large: 0.9,
				full: 1,
			}),
		).toBe(0);
	});
});

describe('getPushHorizontalInset', () => {
	test('returns 0 at progress 0 and target inset at progress 1', () => {
		expect(getPushHorizontalInset(0)).toBe(0);
		expect(getPushHorizontalInset(1)).toBe(PUSH_HOST_HORIZONTAL_INSET);
	});

	test('uses custom target inset when provided', () => {
		expect(getPushHorizontalInset(1, 20)).toBe(20);
	});
});

describe('getPushScale', () => {
	test('returns 1 when push progress is 0', () => {
		expect(getPushScale(SCREEN_WIDTH, 0)).toBe(1);
	});

	test('shrinks host at full push progress', () => {
		const scale = getPushScale(SCREEN_WIDTH, 1);
		const expected = (SCREEN_WIDTH - PUSH_HOST_HORIZONTAL_INSET * 2) / SCREEN_WIDTH;

		expect(scale).toBeCloseTo(expected);
	});
});

describe('getPushVisualInset', () => {
	test('derives side letterbox from scale', () => {
		const scale = getPushScale(SCREEN_WIDTH, 1);
		const visualInset = getPushVisualInset(SCREEN_WIDTH, 1);

		expect(visualInset).toBeCloseTo((SCREEN_WIDTH * (1 - scale)) / 2);
	});
});

describe('getPushHostPushUp', () => {
	test('returns sheet height plus visual inset at full progress', () => {
		const sheetTopY = OPEN_Y;
		const pushUp = getPushHostPushUp(SCREEN_WIDTH, SCREEN_HEIGHT, sheetTopY, 1);
		const sheetHeight = SCREEN_HEIGHT - sheetTopY;
		const visualInset = getPushVisualInset(SCREEN_WIDTH, 1);

		expect(pushUp).toBeCloseTo(sheetHeight + visualInset);
	});
});

describe('getPushHostOffset', () => {
	test('returns negative offset for bottom push', () => {
		const sheetTopY = OPEN_Y;
		const sheetHeight = SCREEN_HEIGHT - sheetTopY;
		const offset = getPushHostOffset(
			SCREEN_WIDTH,
			SCREEN_HEIGHT,
			sheetTopY,
			1,
			PUSH_DIRECTION_JS.bottom,
			TOP_INSET,
			sheetHeight,
		);

		expect(offset).toBeLessThan(0);
	});

	test('returns positive offset for top push', () => {
		const sheetHeight = SCREEN_HEIGHT * 0.35;
		const offset = getPushHostOffset(
			SCREEN_WIDTH,
			SCREEN_HEIGHT,
			0,
			1,
			PUSH_DIRECTION_JS.top,
			0,
			sheetHeight,
		);

		expect(offset).toBeGreaterThan(0);
	});
});

describe('getPushHostPushUpFromSheetTopY', () => {
	test('matches getPushHostPushUp for the same progress snapshot', () => {
		const sheetTopY = 500;
		const fromTopY = getPushHostPushUpFromSheetTopY(
			SCREEN_WIDTH,
			SCREEN_HEIGHT,
			sheetTopY,
			OPEN_Y,
		);
		const progress = getPushLayoutProgress(
			sheetTopY,
			OPEN_Y,
			SCREEN_HEIGHT,
			PUSH_DIRECTION_JS.bottom,
			TOP_INSET,
		);
		const direct = getPushHostPushUp(SCREEN_WIDTH, SCREEN_HEIGHT, sheetTopY, progress);

		expect(fromTopY).toBeCloseTo(direct);
	});
});

describe('getPushHostOffsetFromSheetTopY', () => {
	test('matches getPushHostOffset for top push snapshots', () => {
		const sheetHeight = SCREEN_HEIGHT * 0.35;
		const fromTopY = getPushHostOffsetFromSheetTopY(
			SCREEN_WIDTH,
			SCREEN_HEIGHT,
			0,
			0,
			PUSH_DIRECTION_JS.top,
			0,
			sheetHeight,
		);
		const direct = getPushHostOffset(
			SCREEN_WIDTH,
			SCREEN_HEIGHT,
			0,
			1,
			PUSH_DIRECTION_JS.top,
			0,
			sheetHeight,
		);

		expect(fromTopY).toBeCloseTo(direct);
	});
});

describe('corner radius helpers', () => {
	test('host and sheet use opposite edges per direction', () => {
		expect(getPushHostCornerRadiusStyle(1, PUSH_DIRECTION_JS.bottom)).toEqual({
			borderBottomLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
			borderBottomRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
		});
		expect(getPushSheetCornerRadiusStyle(1, PUSH_DIRECTION_JS.bottom)).toEqual({
			borderTopLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
			borderTopRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
		});
		expect(getPushHostCornerRadiusStyle(1, PUSH_DIRECTION_JS.top)).toEqual({
			borderTopLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
			borderTopRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
		});
		expect(getPushSheetCornerRadiusStyle(1, PUSH_DIRECTION_JS.top)).toEqual({
			borderBottomLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
			borderBottomRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
		});
	});

	test('transform origin flips with direction', () => {
		expect(getPushTransformOrigin(PUSH_DIRECTION_JS.bottom)).toBe('bottom');
		expect(getPushTransformOrigin(PUSH_DIRECTION_JS.top)).toBe('top');
	});
});

describe('getBottomSheetCornerRadius', () => {
	test('returns 0 when progress is 0', () => {
		expect(getBottomSheetCornerRadius(0)).toBe(0);
	});

	test('returns full corner radius at progress 1', () => {
		expect(getBottomSheetCornerRadius(1)).toBe(BOTTOM_SHEET_CORNER_RADIUS);
	});

	test('uses custom max corner radius when provided', () => {
		expect(getBottomSheetCornerRadius(1, 32)).toBe(32);
	});
});
