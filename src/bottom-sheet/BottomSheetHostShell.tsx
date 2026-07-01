import { memo, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { BottomSheetHost } from './BottomSheetHost';
import type { BottomSheetEngine } from './useBottomSheetEngine';

interface BottomSheetHostShellProps {
	engine: BottomSheetEngine;
	children: ReactNode;
}

/**
 * Stable app host — does not subscribe to sheet stack state, so navigation
 * does not re-render when sheets open or close.
 */
function BottomSheetHostShellInner({ engine, children }: BottomSheetHostShellProps) {
	return (
		<BottomSheetHost
			hostLayoutMode={engine.activeHostMode}
			progress={engine.bottomProgress}
			sheetTopY={engine.hostSheetTopY}
			pushProgressOpenY={engine.pushProgressOpenY}
			screenHeight={engine.screenHeight}
			screenWidth={engine.screenWidth}
			layout={engine.mergedLayout}
			style={styles.hostLayer}
		>
			{children}
		</BottomSheetHost>
	);
}

export const BottomSheetHostShell = memo(BottomSheetHostShellInner);

const styles = StyleSheet.create({
	hostLayer: {
		flex: 1,
		zIndex: 1,
	},
});
