import { useSharedValue, type SharedValue } from 'react-native-reanimated';

import { BottomSheetOverlay } from './BottomSheetOverlay';
import type {
	BottomSheetControllerApi,
	BottomSheetLayoutOptions,
	BottomSheetMode,
	BottomSheetState,
} from './types';

interface BottomSheetStackItemProps {
	sheet: BottomSheetState;
	stackIndex: number;
	stackSize: number;
	hostMode: BottomSheetMode;
	/** Shared progress for the bottom sheet (drives app scale + letterbox). */
	bottomProgress: SharedValue<number>;
	/** Top edge of the bottom sheet; drives host push layout. */
	hostSheetTopY?: SharedValue<number>;
	pushProgressOpenY?: SharedValue<number>;
	onDismissComplete: (id: string) => void;
	onDismissHandlerChange: (id: string, handler: (() => void) | undefined) => void;
	onControllerReady: (
		id: string,
		controller: BottomSheetControllerApi | undefined,
	) => void;
	layout: BottomSheetLayoutOptions;
}

export function BottomSheetStackItem({
	sheet,
	stackIndex,
	stackSize,
	hostMode,
	bottomProgress,
	hostSheetTopY,
	pushProgressOpenY,
	onDismissComplete,
	onDismissHandlerChange,
	onControllerReady,
	layout,
}: BottomSheetStackItemProps) {
	const stackedProgress = useSharedValue(0);
	const isTop = stackIndex === stackSize - 1;
	const progress = stackIndex === 0 ? bottomProgress : stackedProgress;
	const usePresentationStack =
		hostMode === 'presentation' && sheet.options.mode === 'presentation';
	const depthFromTop = usePresentationStack ? stackSize - 1 - stackIndex : 0;

	return (
		<BottomSheetOverlay
			sheet={sheet}
			progress={progress}
			hostSheetTopY={hostSheetTopY}
			pushProgressOpenY={pushProgressOpenY}
			stackIndex={stackIndex}
			stackSize={stackSize}
			depthFromTop={depthFromTop}
			enableStackCardStyle={usePresentationStack}
			isTop={isTop}
			showBackdrop={false}
			onDismissComplete={() => onDismissComplete(sheet.id)}
			onDismissHandlerChange={(handler) => onDismissHandlerChange(sheet.id, handler)}
			onControllerReady={(controller) => onControllerReady(sheet.id, controller)}
			layout={layout}
		/>
	);
}
