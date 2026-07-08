/**
 * @module bottom-sheet
 *
 * Bottom sheet for React Native with first-class **presentation** and **push** host modes.
 * Presentation scales and letterboxes the app like iOS sheet modals; push moves the host
 * behind the sheet (bottom-up by default, or top-down via `pushDirection: 'top'`).
 * Also supports modal overlay, snap points, keyboard handling, and scrollable content.
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

export {
	useBottomSheetContent,
	useBottomSheetModal,
	useBottomSheetModalMethods,
} from './BottomSheetContentContext';
export { useBottomSheet } from './BottomSheetContext';
export { BottomSheetModal } from './BottomSheetModal';
export { BottomSheetProvider } from './BottomSheetProvider';
export {
	BottomSheetFlashList,
	BottomSheetFlatList,
	BottomSheetScrollView,
	BottomSheetSectionList,
	BottomSheetTextInput,
	BottomSheetView,
} from './BottomSheetScrollables';
export { DEFAULT_LAYOUT_OPTIONS, mergeLayoutOptions } from './mergeLayoutOptions';
export type {
	BottomSheetContentContextValue,
	BottomSheetContextValue,
	BottomSheetControllerApi,
	BottomSheetDetent,
	BottomSheetDetentPreset,
	BottomSheetKeyboardBehavior,
	BottomSheetKeyboardBlurBehavior,
	BottomSheetLayoutDetentsOptions,
	BottomSheetLayoutGesturesOptions,
	BottomSheetLayoutHandleOptions,
	BottomSheetLayoutMotionOptions,
	BottomSheetLayoutOptions,
	BottomSheetLayoutPresentationOptions,
	BottomSheetLayoutPushOptions,
	BottomSheetLayoutScrollOptions,
	BottomSheetLayoutStackOptions,
	BottomSheetModalProps,
	BottomSheetModalRef,
	BottomSheetMode,
	BottomSheetOptions,
	BottomSheetProviderProps,
	BottomSheetSpringOptions,
	BottomSheetTheme,
	PushDirection,
	SnapPoint,
} from './types';
