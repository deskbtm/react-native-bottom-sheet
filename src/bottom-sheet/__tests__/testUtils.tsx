import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { Gesture } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';

import { BottomSheetContentContext } from '../BottomSheetContentContext';
import type { BottomSheetContentContextValue } from '../types';

export function createSharedValue<T>(initial: T): SharedValue<T> {
	const state = { value: initial };

	return {
		get value() {
			return state.value;
		},
		set value(next: T) {
			state.value = next;
		},
		get() {
			return state.value;
		},
		set(next: T | ((current: T) => T)) {
			state.value =
				typeof next === 'function' ? (next as (current: T) => T)(state.value) : next;
		},
		addListener: jest.fn(),
		removeListener: jest.fn(),
		modify: jest.fn((modifier: (value: T) => unknown, _forceUpdate?: boolean) =>
			modifier(state.value),
		),
	} as SharedValue<T>;
}

export function createBottomSheetContentContextValue(
	overrides: Partial<BottomSheetContentContextValue> = {},
): BottomSheetContentContextValue {
	return {
		animatedIndex: createSharedValue(0),
		animatedPosition: createSharedValue(0),
		scrollOffset: createSharedValue(0),
		snapToIndex: jest.fn(),
		close: jest.fn(),
		expand: jest.fn(),
		collapse: jest.fn(),
		enableContentPanningGesture: false,
		enableDynamicSizing: false,
		bottomInset: 34,
		onContentLayout: jest.fn(),
		sheetDragGesture: Gesture.Native(),
		...overrides,
	};
}

export async function renderWithBottomSheetContent(
	ui: ReactElement,
	contextOverrides: Partial<BottomSheetContentContextValue> = {},
) {
	const contextValue = createBottomSheetContentContextValue(contextOverrides);

	return render(
		<BottomSheetContentContext.Provider value={contextValue}>
			{ui}
		</BottomSheetContentContext.Provider>,
	);
}
