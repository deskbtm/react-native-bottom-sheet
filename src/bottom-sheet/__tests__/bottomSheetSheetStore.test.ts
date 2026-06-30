import {
	createBottomSheetSheetStore,
	type BottomSheetSheetSnapshot,
} from '../bottomSheetSheetStore';

function createPresentedSnapshot(
	overrides: Partial<BottomSheetSheetSnapshot> = {},
): BottomSheetSheetSnapshot {
	return {
		isPresented: true,
		presentedSheetCount: 1,
		topSheetId: 'sheet-1',
		topSheetController: {
			close: jest.fn(),
			snapToIndex: jest.fn(),
			snapToPosition: jest.fn(),
			expand: jest.fn(),
			collapse: jest.fn(),
		},
		...overrides,
	};
}

describe('createBottomSheetSheetStore', () => {
	test('starts with an empty snapshot', () => {
		const store = createBottomSheetSheetStore();

		expect(store.getSnapshot()).toEqual({
			isPresented: false,
			presentedSheetCount: 0,
			topSheetId: null,
			topSheetController: null,
		});
	});

	test('notifies subscribers when snapshot changes', () => {
		const store = createBottomSheetSheetStore();
		const listener = jest.fn();

		store.subscribe(listener);
		store.setSnapshot(createPresentedSnapshot());

		expect(listener).toHaveBeenCalledTimes(1);
		expect(store.getSnapshot().topSheetId).toBe('sheet-1');
	});

	test('does not notify when snapshot is unchanged', () => {
		const store = createBottomSheetSheetStore();
		const listener = jest.fn();
		const snapshot = createPresentedSnapshot();

		store.setSnapshot(snapshot);
		store.subscribe(listener);
		store.setSnapshot({ ...snapshot });

		expect(listener).not.toHaveBeenCalled();
	});

	test('unsubscribes listeners', () => {
		const store = createBottomSheetSheetStore();
		const listener = jest.fn();

		const unsubscribe = store.subscribe(listener);
		unsubscribe();
		store.setSnapshot(createPresentedSnapshot());

		expect(listener).not.toHaveBeenCalled();
	});
});
