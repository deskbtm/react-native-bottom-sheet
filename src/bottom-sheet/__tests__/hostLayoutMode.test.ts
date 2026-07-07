import { bottomSheetModeToLayoutJs, HOST_LAYOUT_MODE } from '../hostLayoutMode';

describe('bottomSheetModeToLayoutJs', () => {
	test('maps each bottom sheet mode to a numeric layout mode', () => {
		expect(bottomSheetModeToLayoutJs('modal')).toBe(HOST_LAYOUT_MODE.modal);
		expect(bottomSheetModeToLayoutJs('presentation')).toBe(HOST_LAYOUT_MODE.presentation);
		expect(bottomSheetModeToLayoutJs('push')).toBe(HOST_LAYOUT_MODE.push);
	});
});
