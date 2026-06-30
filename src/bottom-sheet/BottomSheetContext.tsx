import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';

import type { BottomSheetSheetStore } from './bottomSheetSheetStore';
import type {
	BottomSheetContextValue,
	BottomSheetMode,
	BottomSheetOptions,
} from './types';

interface BottomSheetActionsContextValue {
	mode: BottomSheetMode;
	present: (content: React.ReactNode, options?: BottomSheetOptions) => string;
	dismiss: (sheetId?: string) => void;
	dismissAll: () => void;
}

export const BottomSheetActionsContext =
	createContext<BottomSheetActionsContextValue | null>(null);

export const BottomSheetSheetStoreContext = createContext<BottomSheetSheetStore | null>(
	null,
);

/**
 * Imperative sheet API for the current app tree.
 *
 * @returns `present` / `dismiss` / `dismissAll`, stack info, and `topSheetController`
 *
 * @example
 * const { present, dismiss, dismissAll, presentedSheetCount, topSheetController } =
 *   useBottomSheet();
 *
 * present(<SheetContent />, { snapPoints: ['medium', 'large'], index: 0 });
 * present(<AnotherSheet />, { snapPoints: ['40%'] }); // stacks on top
 * topSheetController?.snapToIndex(1);
 * dismiss(); // closes top sheet only
 * dismissAll();
 */
export function useBottomSheet(): BottomSheetContextValue {
	const actions = useContext(BottomSheetActionsContext);
	const sheetStore = useContext(BottomSheetSheetStoreContext);

	if (!actions || !sheetStore) {
		throw new Error('useBottomSheet must be used within BottomSheetProvider');
	}

	const sheetState = useSyncExternalStore(
		sheetStore.subscribe,
		sheetStore.getSnapshot,
		sheetStore.getSnapshot,
	);

	return useMemo(
		(): BottomSheetContextValue => ({
			...actions,
			...sheetState,
		}),
		[actions, sheetState],
	);
}
