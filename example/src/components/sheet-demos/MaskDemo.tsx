import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import {
	BottomSheetView,
	useBottomSheetContent,
} from '@deskbtm/react-native-bottom-sheet';

import { sheetDemoStyles as styles } from './sheetDemoStyles';

function MaskDemoInner() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<Text style={styles.sheetTitle}>Sheet mask</Text>
			<Text style={styles.sheetSubtitle}>
				Mask sits above the sheet body only. Sheet content here stays tappable.
			</Text>
			<Pressable style={styles.closeButton} onPress={close}>
				<Text style={styles.closeButtonText}>Close Sheet</Text>
			</Pressable>
		</BottomSheetView>
	);
}

export const MaskDemo = memo(MaskDemoInner);
