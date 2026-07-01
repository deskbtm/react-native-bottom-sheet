import { memo } from 'react';
import { Pressable, Text } from 'react-native';

import {
	BottomSheetTextInput,
	BottomSheetView,
	useBottomSheetContent,
} from '@deskbtm-rn/bottom-sheet';

import { sheetDemoStyles as styles } from './sheetDemoStyles';

function DynamicSheetDemoInner() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<Text style={styles.sheetTitle}>Dynamic Sizing</Text>
			<Text style={styles.sheetSubtitle}>
				This sheet grows with its content when `enableDynamicSizing` is enabled.
			</Text>
			<BottomSheetTextInput
				placeholder="Type to grow content"
				style={styles.input}
				multiline
				accessibilityLabel="Dynamic sheet text input"
			/>
			<Pressable style={styles.closeButton} onPress={close}>
				<Text style={styles.closeButtonText}>Close Sheet</Text>
			</Pressable>
		</BottomSheetView>
	);
}

export const DynamicSheetDemo = memo(DynamicSheetDemoInner);
