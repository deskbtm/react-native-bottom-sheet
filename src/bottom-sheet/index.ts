/**
 * @module bottom-sheet
 *
 * Bottom sheet host with gorhom-like API (snap points, keyboard, scrollables).
 * Supports iOS-style `presentation` mode, `push` layout, and standard `modal` overlay mode.
 *
 * @example
 * // App.tsx
 * import { BottomSheetProvider } from '@/components/bottom-sheet';
 *
 * <BottomSheetProvider mode="presentation" theme={{ sheetBackgroundColor: '#fff' }}>
 *   <Navigation />
 * </BottomSheetProvider>
 *
 * @example
 * const { present, dismiss } = useBottomSheet();
 *
 * present(<BottomSheetScrollView>...</BottomSheetScrollView>, {
 *   snapPoints: ['50%', '90%'],
 *   mode: 'modal',
 * });
 *
 * @example
 * present(<BottomSheetView>...</BottomSheetView>, {
 *   mode: 'push',
 *   snapPoints: ['40%', '85%'],
 * });
 */

export { BottomSheetProvider } from './BottomSheetProvider';
export { useBottomSheet } from './BottomSheetContext';
export {
	useBottomSheetContent,
	useBottomSheetModal,
	useBottomSheetModalMethods,
} from './BottomSheetContentContext';
export { BottomSheetModal } from './BottomSheetModal';
export {
	BottomSheetView,
	BottomSheetScrollView,
	BottomSheetFlatList,
	BottomSheetSectionList,
	BottomSheetFlashList,
	BottomSheetTextInput,
} from './BottomSheetScrollables';
export type {
	BottomSheetMode,
	BottomSheetDetent,
	BottomSheetDetentPreset,
	SnapPoint,
	BottomSheetControllerApi,
	BottomSheetModalRef,
	BottomSheetModalProps,
	BottomSheetContentContextValue,
	BottomSheetContextValue,
	BottomSheetOptions,
	BottomSheetProviderProps,
	BottomSheetTheme,
	BottomSheetKeyboardBehavior,
	BottomSheetKeyboardBlurBehavior,
} from './types';
