import {
	BOTTOM_SHEET_CORNER_RADIUS,
	PUSH_HOST_HORIZONTAL_INSET,
} from '../constants';
import {
	getBottomSheetCornerRadius,
	getPushHostPushUp,
	getPushHostPushUpFromSheetTopY,
	getPushHorizontalInset,
	getPushLayoutProgress,
	getPushScale,
	getPushVisualInset,
} from '../pushLayout';

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const OPEN_Y = 422;

describe('getPushLayoutProgress', () => {
	test('returns 0 when sheet is fully dismissed', () => {
		expect(getPushLayoutProgress(SCREEN_HEIGHT, OPEN_Y, SCREEN_HEIGHT)).toBe(0);
	});

	test('returns 0 when openY is at screen bottom', () => {
		expect(getPushLayoutProgress(400, SCREEN_HEIGHT, SCREEN_HEIGHT)).toBe(0);
	});

	test('returns 1 when sheet is fully open', () => {
		expect(getPushLayoutProgress(OPEN_Y, OPEN_Y, SCREEN_HEIGHT)).toBe(1);
	});

	test('interpolates between dismissed and open positions', () => {
		const midY = (SCREEN_HEIGHT + OPEN_Y) / 2;
		const progress = getPushLayoutProgress(midY, OPEN_Y, SCREEN_HEIGHT);

		expect(progress).toBeGreaterThan(0);
		expect(progress).toBeLessThan(1);
	});
});

describe('getPushHorizontalInset', () => {
	test('returns 0 at progress 0 and target inset at progress 1', () => {
		expect(getPushHorizontalInset(0)).toBe(0);
		expect(getPushHorizontalInset(1)).toBe(PUSH_HOST_HORIZONTAL_INSET);
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

describe('getPushHostPushUpFromSheetTopY', () => {
	test('matches getPushHostPushUp for the same progress snapshot', () => {
		const sheetTopY = 500;
		const fromTopY = getPushHostPushUpFromSheetTopY(
			SCREEN_WIDTH,
			SCREEN_HEIGHT,
			sheetTopY,
			OPEN_Y,
		);
		const progress = getPushLayoutProgress(sheetTopY, OPEN_Y, SCREEN_HEIGHT);
		const direct = getPushHostPushUp(SCREEN_WIDTH, SCREEN_HEIGHT, sheetTopY, progress);

		expect(fromTopY).toBeCloseTo(direct);
	});
});

describe('getBottomSheetCornerRadius', () => {
	test('returns 0 when progress is 0', () => {
		expect(getBottomSheetCornerRadius(0)).toBe(0);
	});

	test('returns full corner radius at progress 1', () => {
		expect(getBottomSheetCornerRadius(1)).toBe(BOTTOM_SHEET_CORNER_RADIUS);
	});
});
