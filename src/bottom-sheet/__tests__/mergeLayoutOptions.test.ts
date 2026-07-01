import {
	BOTTOM_SHEET_CORNER_RADIUS,
	DETENT_FRACTIONS,
	DISMISS_DRAG_THRESHOLD,
	PRESENTATION_HOST_SCALE,
	SHEET_SPRING_CONFIG,
} from '../constants';
import { DEFAULT_LAYOUT_OPTIONS, mergeLayoutOptions } from '../mergeLayoutOptions';

describe('DEFAULT_LAYOUT_OPTIONS', () => {
	test('builds presentation defaults from constants.ts', () => {
		expect(DEFAULT_LAYOUT_OPTIONS.presentation.hostScale).toBe(
			PRESENTATION_HOST_SCALE,
		);
		expect(DEFAULT_LAYOUT_OPTIONS.presentation.cornerRadius).toBe(
			BOTTOM_SHEET_CORNER_RADIUS,
		);
	});

	test('builds motion defaults from constants.ts', () => {
		expect(DEFAULT_LAYOUT_OPTIONS.motion.sheetSpring).toEqual(SHEET_SPRING_CONFIG);
	});

	test('builds detent defaults from constants.ts', () => {
		expect(DEFAULT_LAYOUT_OPTIONS.detents).toEqual(DETENT_FRACTIONS);
	});
});

describe('mergeLayoutOptions', () => {
	test('returns defaults when partial is undefined', () => {
		expect(mergeLayoutOptions(undefined)).toEqual(DEFAULT_LAYOUT_OPTIONS);
	});

	test('deep-merges a nested presentation override', () => {
		const merged = mergeLayoutOptions({
			presentation: { cornerRadius: 32 },
		});

		expect(merged.presentation.cornerRadius).toBe(32);
		expect(merged.presentation.hostScale).toBe(
			DEFAULT_LAYOUT_OPTIONS.presentation.hostScale,
		);
	});

	test('deep-merges motion spring fields without replacing the whole spring', () => {
		const merged = mergeLayoutOptions({
			motion: { sheetSpring: { damping: 100 } },
		});

		expect(merged.motion.sheetSpring.damping).toBe(100);
		expect(merged.motion.sheetSpring.stiffness).toBe(
			DEFAULT_LAYOUT_OPTIONS.motion.sheetSpring.stiffness,
		);
	});

	test('deep-merges gesture thresholds independently', () => {
		const merged = mergeLayoutOptions({
			gestures: { dismissDragThreshold: 200 },
		});

		expect(merged.gestures.dismissDragThreshold).toBe(200);
		expect(merged.gestures.dismissDragThreshold).not.toBe(DISMISS_DRAG_THRESHOLD);
		expect(merged.gestures.dismissVelocityThreshold).toBe(
			DEFAULT_LAYOUT_OPTIONS.gestures.dismissVelocityThreshold,
		);
	});

	test('does not mutate DEFAULT_LAYOUT_OPTIONS', () => {
		mergeLayoutOptions({ presentation: { cornerRadius: 99 } });

		expect(DEFAULT_LAYOUT_OPTIONS.presentation.cornerRadius).toBe(
			BOTTOM_SHEET_CORNER_RADIUS,
		);
	});
});
