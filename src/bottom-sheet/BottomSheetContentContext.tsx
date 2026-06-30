import { createContext, useContext } from 'react';

import type { BottomSheetContentContextValue } from './types';

export const BottomSheetContentContext =
	createContext<BottomSheetContentContextValue | null>(null);

/**
 * Sheet content context — gesture, scroll offset, and close/expand helpers.
 *
 * Only use inside `BottomSheetModal` children or content passed to `present()`.
 * Prefer this over reaching into provider internals.
 *
 * @example
 * function SheetFooter() {
 *   const { close, collapse, expand } = useBottomSheetContent();
 *   return (
 *     <View>
 *       <Button onPress={collapse} title="Collapse" />
 *       <Button onPress={close} title="Done" />
 *     </View>
 *   );
 * }
 */
export function useBottomSheetContent(): BottomSheetContentContextValue {
	const context = useContext(BottomSheetContentContext);
	if (!context) {
		throw new Error(
			'Sheet compound components must be rendered inside BottomSheetModal or present() content.',
		);
	}
	return context;
}

/** Same actions as `BottomSheetModalRef`, for use inside sheet content without a ref. */
export function useBottomSheetModalMethods() {
	const { snapToIndex, close, expand, collapse } = useBottomSheetContent();

	return {
		snapToIndex,
		close,
		expand,
		collapse,
		dismiss: close,
		forceClose: close,
	};
}

/** Gorhom-compatible alias. */
export const useBottomSheetModal = useBottomSheetModalMethods;
