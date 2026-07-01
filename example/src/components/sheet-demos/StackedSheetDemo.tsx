import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import {
	BottomSheetView,
	useBottomSheet,
	useBottomSheetContent,
} from '@deskbtm-rn/bottom-sheet';

import { sheetDemoStyles as styles } from './sheetDemoStyles';

function StackedSheetInner() {
	const { close } = useBottomSheetContent();
	const { presentedSheetCount, dismissAll } = useBottomSheet();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<Text style={styles.sheetTitle}>Stacked sheet #{presentedSheetCount}</Text>
			<Text style={styles.sheetSubtitle}>Swipe down or tap to close this level.</Text>
			<Pressable style={styles.closeButton} onPress={close}>
				<Text style={styles.closeButtonText}>Close top</Text>
			</Pressable>
			<Pressable style={styles.secondaryButton} onPress={dismissAll}>
				<Text style={styles.secondaryButtonText}>Dismiss all</Text>
			</Pressable>
		</BottomSheetView>
	);
}

function StackedSheetDemoInner() {
	const { present, presentedSheetCount } = useBottomSheet();
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<Text style={styles.sheetTitle}>Stacked sheets (iOS cards)</Text>
			<Text style={styles.sheetSubtitle}>
				Depth: {presentedSheetCount}. Push another sheet — the one below shrinks and peeks
				behind.
			</Text>
			<Pressable
				style={styles.demoButton}
				onPress={() =>
					present(<StackedSheetInner />, {
						snapPoints: ['35%', '70%'],
						index: 0,
					})
				}
			>
				<Text style={styles.demoButtonText}>Push stacked sheet</Text>
			</Pressable>
			<Pressable style={styles.closeButton} onPress={close}>
				<Text style={styles.closeButtonText}>Close</Text>
			</Pressable>
		</BottomSheetView>
	);
}

export const StackedSheetDemo = memo(StackedSheetDemoInner);
