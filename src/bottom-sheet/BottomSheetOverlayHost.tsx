import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetStackItem } from './BottomSheetStackItem';
import type { BottomSheetState } from './types';
import type { BottomSheetEngine } from './useBottomSheetEngine';

interface BottomSheetOverlayHostProps {
	engine: BottomSheetEngine;
}

/**
 * Sheet stack, letterbox, and modal scrim — isolated from the app host subtree.
 */
export function BottomSheetOverlayHost({ engine }: BottomSheetOverlayHostProps) {
	const [sheets, setSheets] = useState<BottomSheetState[]>([]);

	useEffect(() => engine.bindSheetState(setSheets), [engine.bindSheetState]);

	const closeFromBackdrop = useCallback(() => {
		engine.dismissTop();
	}, [engine.dismissTop]);

	const topSheet = sheets.length > 0 ? sheets[sheets.length - 1] : null;
	const activeHostMode = topSheet?.options.mode ?? engine.hostMode;
	const isSheetPresented = sheets.length > 0;
	const isPresentationMode = activeHostMode === 'presentation';
	const isPushMode = activeHostMode === 'push';
	const syncHostSheetTopY = isPushMode;

	return (
		<>
			{(isPresentationMode || isPushMode) && isSheetPresented ? (
				<View pointerEvents="box-none" style={styles.letterboxHost}>
					<BottomSheetBackdrop
						style={styles.letterbox}
						progress={engine.bottomProgress}
						letterboxColor={engine.mergedTheme.letterboxColor}
						peakOpacity={engine.mergedTheme.letterboxOpacity}
						onPress={closeFromBackdrop}
					/>
				</View>
			) : null}
			{!isPresentationMode && !isPushMode && isSheetPresented ? (
				<BottomSheetBackdrop
					solid
					style={styles.modalBackdrop}
					progress={engine.bottomProgress}
					letterboxColor={engine.mergedTheme.modalBackdropColor}
					peakOpacity={1}
					onPress={closeFromBackdrop}
				/>
			) : null}
			{sheets.map((entry, index) => (
				<BottomSheetStackItem
					key={entry.id}
					sheet={entry}
					stackIndex={index}
					stackSize={sheets.length}
					hostMode={entry.options.mode}
					bottomProgress={engine.bottomProgress}
					hostSheetTopY={
						syncHostSheetTopY && index === 0 ? engine.hostSheetTopY : undefined
					}
					pushProgressOpenY={
						syncHostSheetTopY && index === 0 ? engine.pushProgressOpenY : undefined
					}
					pushSheetHeight={
						syncHostSheetTopY && index === 0 ? engine.pushSheetHeight : undefined
					}
					onDismissComplete={engine.handleDismissComplete}
					onDismissHandlerChange={engine.handleDismissHandlerChange}
					onControllerReady={engine.handleControllerReady}
					layout={engine.mergedLayout}
				/>
			))}
		</>
	);
}

const styles = StyleSheet.create({
	letterbox: {
		zIndex: 0,
	},
	letterboxHost: {
		...StyleSheet.absoluteFill,
		zIndex: 0,
	},
	modalBackdrop: {
		...StyleSheet.absoluteFill,
		zIndex: 2,
	},
});
