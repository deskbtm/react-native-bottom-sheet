import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';

import { useBottomSheet } from './BottomSheetContext';
import { resolveBottomSheetOptions } from './resolveOptions';
import {
	useBottomSheetInstanceId,
	useBottomSheetModalRegistry,
} from './BottomSheetModalRegistry';
import type { BottomSheetModalProps, BottomSheetModalRef } from './types';

/**
 * Declarative sheet slot. Renders nothing until `ref.present()` is called.
 *
 * Options mirror `BottomSheetOptions` (snapPoints, keyboard, dynamic sizing).
 * Content must use `BottomSheetView` / `BottomSheetScrollView` / `useBottomSheetContent()` — not raw RN scroll views.
 *
 * Multiple `BottomSheetModal` instances can be stacked; each call to `present()` pushes a sheet.
 *
 * @example
 * const sheetRef = useRef<BottomSheetModalRef>(null);
 *
 * <Button onPress={() => sheetRef.current?.present()} title="Open" />
 *
 * <BottomSheetModal
 *   ref={sheetRef}
 *   sheetId="profile-sheet"
 *   snapPoints={['40%', '90%']}
 *   index={0}
 *   onDismiss={() => console.log('dismissed')}
 * >
 *   <ProfileSheetBody />
 * </BottomSheetModal>
 */
export const BottomSheetModal = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(
	function BottomSheetModal(props, ref) {
		const { children, sheetId: sheetIdProp, ...optionProps } = props;
		const id = useBottomSheetInstanceId(sheetIdProp);
		const { register, unregister } = useBottomSheetModalRegistry();
		const { present, dismiss, dismissAll, topSheetId, topSheetController, mode } =
			useBottomSheet();

		const resolvedOptions = useMemo(
			() => resolveBottomSheetOptions(optionProps, undefined, undefined, mode),
			[mode, optionProps],
		);

		const isActive = topSheetId === id;

		useEffect(() => {
			register({
				id,
				renderContent: () => children,
				options: resolvedOptions,
			});
			return () => unregister(id);
		}, [children, id, register, resolvedOptions, unregister]);

		useImperativeHandle(
			ref,
			(): BottomSheetModalRef => ({
				present: () => present(children, { ...optionProps, sheetId: id }),
				dismiss: () => dismiss(id),
				close: () => dismiss(id),
				forceClose: () => dismiss(id),
				dismissAll,
				snapToIndex: (index) => {
					if (isActive && topSheetController) {
						topSheetController.snapToIndex(index);
						return;
					}
					present(children, { ...optionProps, sheetId: id, index });
				},
				snapToPosition: (position) => {
					if (isActive) {
						topSheetController?.snapToPosition(position);
					}
				},
				expand: () => {
					if (isActive && topSheetController) {
						topSheetController.expand();
						return;
					}
					const snapPoints = optionProps.snapPoints ?? ['medium', 'large'];
					present(children, {
						...optionProps,
						sheetId: id,
						index: snapPoints.length - 1,
					});
				},
				collapse: () => {
					if (isActive && topSheetController) {
						topSheetController.collapse();
						return;
					}
					present(children, { ...optionProps, sheetId: id, index: 0 });
				},
			}),
			[
				children,
				dismiss,
				dismissAll,
				id,
				isActive,
				optionProps,
				present,
				topSheetController,
			],
		);

		return null;
	},
);
