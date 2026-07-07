describe('createBottomSheetId', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('returns ids with sheet prefix and timestamp', () => {
		const { createBottomSheetId } = require('../createBottomSheetId');

		expect(createBottomSheetId()).toBe('sheet-1-1700000000000');
	});

	test('increments counter for each new id', () => {
		const { createBottomSheetId } = require('../createBottomSheetId');

		expect(createBottomSheetId()).toBe('sheet-1-1700000000000');
		expect(createBottomSheetId()).toBe('sheet-2-1700000000000');
	});
});
