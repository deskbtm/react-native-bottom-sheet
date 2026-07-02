/**
 * @module bottom-sheet
 *
 * Bottom sheet for React Native with first-class **presentation** and **push** host modes.
 * Presentation scales and letterboxes the app like iOS sheet modals; push lifts the host
 * behind the sheet with rounded corners and side insets. Also supports modal overlay,
 * snap points, keyboard handling, and scrollable content.
 *
 * @example
 * // App.tsx
 * import { BottomSheetProvider } from '@/components/bottom-sheet';
 *
 * <BottomSheetProvider
 *   mode="presentation"
 *   sheet={{ snapPoints: ['50%'] }}
 *   layout={{ presentation: { cornerRadius: 32 } }}
 *   theme={{ letterboxColor: '#000' }}
 * >
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
export { DEFAULT_LAYOUT_OPTIONS, mergeLayoutOptions } from './mergeLayoutOptions';
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
	BottomSheetLayoutOptions,
	BottomSheetLayoutMotionOptions,
	BottomSheetLayoutPresentationOptions,
	BottomSheetLayoutPushOptions,
	BottomSheetLayoutStackOptions,
	BottomSheetLayoutGesturesOptions,
	BottomSheetLayoutHandleOptions,
	BottomSheetLayoutScrollOptions,
	BottomSheetLayoutDetentsOptions,
	BottomSheetSpringOptions,
	BottomSheetKeyboardBehavior,
	BottomSheetKeyboardBlurBehavior,
} from './types';
