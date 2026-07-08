import { memo, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheetHost } from './BottomSheetHost';
import type { HostLayoutMode } from './hostLayoutMode';
import type { BottomSheetLayoutOptions } from './types';

export interface BottomSheetHostShellProps {
	children: ReactNode;
	hostLayoutMode: SharedValue<HostLayoutMode>;
	progress: SharedValue<number>;
	sheetTopY: SharedValue<number>;
	pushProgressOpenY: SharedValue<number>;
	pushSheetHeight: SharedValue<number>;
	screenHeight: number;
	screenWidth: number;
	layout: BottomSheetLayoutOptions;
}

/**
 * Stable app host — does not subscribe to sheet stack state, so navigation
 * does not re-render when sheets open or close.
 */
function BottomSheetHostShellInner({
	children,
	hostLayoutMode,
	progress,
	sheetTopY,
	pushProgressOpenY,
	pushSheetHeight,
	screenHeight,
	screenWidth,
	layout,
}: BottomSheetHostShellProps) {
	const insets = useSafeAreaInsets();

	return (
		<BottomSheetHost
			hostLayoutMode={hostLayoutMode}
			progress={progress}
			sheetTopY={sheetTopY}
			pushProgressOpenY={pushProgressOpenY}
			pushSheetHeight={pushSheetHeight}
			topInset={insets.top}
			screenHeight={screenHeight}
			screenWidth={screenWidth}
			layout={layout}
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
