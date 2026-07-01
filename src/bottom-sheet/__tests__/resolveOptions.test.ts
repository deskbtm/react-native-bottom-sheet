import {
	DEFAULT_ACCESSIBILITY_LABEL,
	DEFAULT_THEME,
} from '../constants';
import { resolveBottomSheetOptions } from '../resolveOptions';

describe('resolveBottomSheetOptions', () => {
	test('applies default snap points and index for a bare present()', () => {
		const resolved = resolveBottomSheetOptions(undefined);

		expect(resolved.snapPoints).toEqual(['medium', 'large']);
		expect(resolved.index).toBe(0);
		expect(resolved.mode).toBe('presentation');
		expect(resolved.enableDynamicSizing).toBe(false);
		expect(resolved.enablePanDownToClose).toBe(true);
		expect(resolved.dismissOnScrimPress).toBe(true);
		expect(resolved.enableContentPanningGesture).toBe(false);
		expect(resolved.keyboardBehavior).toBe('interactive');
		expect(resolved.keyboardBlurBehavior).toBe('restore');
		expect(resolved.showHandle).toBe(true);
		expect(resolved.accessibilityLabel).toBe(DEFAULT_ACCESSIBILITY_LABEL);
		expect(resolved.theme).toEqual(DEFAULT_THEME);
	});

	test('merges provider sheet defaults before per-sheet options', () => {
		const resolved = resolveBottomSheetOptions(
			{ snapPoints: ['full'], index: 0, mode: 'push' },
			{
				snapPoints: ['medium'],
				mode: 'modal',
				enablePanDownToClose: false,
			},
		);

		expect(resolved.snapPoints).toEqual(['full']);
		expect(resolved.mode).toBe('push');
		expect(resolved.enablePanDownToClose).toBe(false);
	});

	test('merges theme from provider and sheet options', () => {
		const resolved = resolveBottomSheetOptions(
			{ theme: { handleColor: '#FF0000' } },
			undefined,
			{ sheetBackgroundColor: '#111111' },
		);

		expect(resolved.theme.sheetBackgroundColor).toBe('#111111');
		expect(resolved.theme.handleColor).toBe('#FF0000');
		expect(resolved.theme.letterboxColor).toBe(DEFAULT_THEME.letterboxColor);
	});

	test('uses host mode when neither sheet nor provider specify mode', () => {
		const resolved = resolveBottomSheetOptions(undefined, undefined, undefined, 'modal');

		expect(resolved.mode).toBe('modal');
	});

	test('prefers provider mode over host mode', () => {
		const resolved = resolveBottomSheetOptions(
			undefined,
			{ mode: 'push' },
			undefined,
			'modal',
		);

		expect(resolved.mode).toBe('push');
	});

	test('uses empty snap points for dynamic sizing', () => {
		const resolved = resolveBottomSheetOptions({ enableDynamicSizing: true });

		expect(resolved.snapPoints).toEqual([]);
		expect(resolved.index).toBe(0);
	});

	test('falls back to medium when non-dynamic snap points resolve empty', () => {
		const resolved = resolveBottomSheetOptions({ snapPoints: [] });

		expect(resolved.snapPoints).toEqual(['medium']);
	});

	test('clamps index to available snap points', () => {
		const resolved = resolveBottomSheetOptions({
			snapPoints: ['medium', 'large'],
			index: 99,
		});

		expect(resolved.index).toBe(1);
	});

	test('forwards callbacks and sheet style', () => {
		const onDismiss = jest.fn();
		const onChange = jest.fn();
		const onAnimate = jest.fn();
		const sheetStyle = { backgroundColor: 'red' };

		const resolved = resolveBottomSheetOptions({
			onDismiss,
			onChange,
			onAnimate,
			sheetStyle,
			scrimColor: 'rgba(0,0,0,0.2)',
		});

		expect(resolved.onDismiss).toBe(onDismiss);
		expect(resolved.onChange).toBe(onChange);
		expect(resolved.onAnimate).toBe(onAnimate);
		expect(resolved.sheetStyle).toBe(sheetStyle);
		expect(resolved.scrimColor).toBe('rgba(0,0,0,0.2)');
	});
});
