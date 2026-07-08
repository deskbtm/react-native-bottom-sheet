import {
	bottomSheetModeToLayoutJs,
	HOST_LAYOUT_MODE,
	resolveHostLayoutMode,
} from '../hostLayoutMode';

describe('host layout mode mapping', () => {
	test('maps each bottom sheet mode to a numeric layout mode', () => {
		expect(bottomSheetModeToLayoutJs('modal')).toBe(HOST_LAYOUT_MODE.modal);
		expect(bottomSheetModeToLayoutJs('presentation')).toBe(HOST_LAYOUT_MODE.presentation);
		expect(bottomSheetModeToLayoutJs('push')).toBe(HOST_LAYOUT_MODE.pushBottom);
	});

	test('resolves push direction into distinct host layout modes', () => {
		expect(resolveHostLayoutMode('push', 'bottom')).toBe(HOST_LAYOUT_MODE.pushBottom);
		expect(resolveHostLayoutMode('push', 'top')).toBe(HOST_LAYOUT_MODE.pushTop);
		expect(resolveHostLayoutMode('modal', 'top')).toBe(HOST_LAYOUT_MODE.modal);
	});
});
