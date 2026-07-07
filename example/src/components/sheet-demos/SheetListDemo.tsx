import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
	BottomSheetFlatList,
	useBottomSheetContent,
} from '@deskbtm/react-native-bottom-sheet';

import { sheetDemoStyles as styles } from './sheetDemoStyles';

const LIST_DEMO_DATA = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);

function SheetListDemoInner() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetFlatList
			data={LIST_DEMO_DATA}
			keyExtractor={(item) => item}
			contentContainerStyle={styles.sheetInner}
			renderItem={({ item }) => (
				<View style={styles.sheetRow}>
					<Text>{item}</Text>
				</View>
			)}
			ListHeaderComponent={
				<View style={styles.listHeader}>
					<Text style={styles.sheetTitle}>FlatList Sheet</Text>
					<Text style={styles.sheetSubtitle}>
						Scroll the list, then drag the handle to resize or dismiss.
					</Text>
				</View>
			}
			ListFooterComponent={
				<Pressable style={styles.closeButton} onPress={close}>
					<Text style={styles.closeButtonText}>Close Sheet</Text>
				</Pressable>
			}
		/>
	);
}

export const SheetListDemo = memo(SheetListDemoInner);
