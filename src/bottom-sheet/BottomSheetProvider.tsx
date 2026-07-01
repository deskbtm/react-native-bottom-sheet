import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
	BottomSheetActionsContext,
	BottomSheetSheetStoreContext,
} from './BottomSheetContext';
import { BottomSheetHostShell } from './BottomSheetHostShell';
import { BottomSheetModalRegistryProvider } from './BottomSheetModalRegistry';
import { BottomSheetOverlayHost } from './BottomSheetOverlayHost';
import type { BottomSheetProviderProps } from './types';
import { useBottomSheetEngine } from './useBottomSheetEngine';

/**
 * Host for global bottom sheet presentation.
 *
 * @param mode - `presentation` (iOS-style scaled app), `modal` (dimmed overlay), or `push` (app slides up). Default `presentation`.
 * @param sheet - Merged into every `present()` / `BottomSheetModal` open
 * @param layout - Provider-wide physical parameters (read once at mount)
 * @param theme - Default colors for sheet, letterbox/scrim, and handle
 *
 * @example
 * <BottomSheetProvider mode="presentation" theme={{ sheetBackgroundColor: '#fff' }}>
 *   <Navigation />
 * </BottomSheetProvider>
 */
export function BottomSheetProvider({
	children,
	mode: hostMode = 'presentation',
	sheet,
	layout,
	theme,
}: BottomSheetProviderProps) {
	const engine = useBottomSheetEngine({
		mode: hostMode,
		sheet,
		layout,
		theme,
	});

	const actionsValue = useMemo(
		() => ({
			mode: engine.hostMode,
			present: engine.present,
			dismiss: engine.dismiss,
			dismissAll: engine.dismissAll,
		}),
		[engine.dismiss, engine.dismissAll, engine.hostMode, engine.present],
	);

	return (
		<BottomSheetActionsContext.Provider value={actionsValue}>
			<BottomSheetSheetStoreContext.Provider value={engine.sheetStore}>
				<BottomSheetModalRegistryProvider
					register={engine.register}
					unregister={engine.unregister}
				>
					<View
						style={[
							styles.root,
							{ backgroundColor: engine.mergedTheme.hostBackgroundColor },
						]}
					>
						<BottomSheetHostShell
							hostLayoutMode={engine.activeHostMode}
							progress={engine.bottomProgress}
							sheetTopY={engine.hostSheetTopY}
							pushProgressOpenY={engine.pushProgressOpenY}
							screenHeight={engine.screenHeight}
							screenWidth={engine.screenWidth}
							layout={engine.mergedLayout}
						>
							{children}
						</BottomSheetHostShell>
						<BottomSheetOverlayHost engine={engine} />
					</View>
				</BottomSheetModalRegistryProvider>
			</BottomSheetSheetStoreContext.Provider>
		</BottomSheetActionsContext.Provider>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
