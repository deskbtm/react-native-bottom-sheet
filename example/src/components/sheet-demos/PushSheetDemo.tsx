import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import { BottomSheetView, useBottomSheetContent } from '@deskbtm-rn/bottom-sheet';

import { sheetDemoStyles as styles } from './sheetDemoStyles';

function PushSheetDemoInner() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<Text style={styles.sheetTitle}>Push layout</Text>
			<Text style={styles.sheetSubtitle}>
				Host screen and sheet get rounded corners with a gap between them.
			</Text>
			<Pressable style={styles.closeButton} onPress={close}>
				<Text style={styles.closeButtonText}>Close Sheet</Text>
			</Pressable>
		</BottomSheetView>
	);
}

export const PushSheetDemo = memo(PushSheetDemoInner);
