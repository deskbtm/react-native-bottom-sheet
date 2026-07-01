import { memo } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';

import {
	BottomSheetScrollView,
	BottomSheetTextInput,
	useBottomSheetContent,
} from '@deskbtm-rn/bottom-sheet';

import { sheetDemoStyles as styles } from './sheetDemoStyles';

function SheetScrollDemoInner() {
	const { close, expand, collapse } = useBottomSheetContent();

	return (
		<BottomSheetScrollView
			contentContainerStyle={styles.sheetInner}
			refreshControl={
				<RefreshControl refreshing={false} onRefresh={() => console.log('refresh')} />
			}
		>
			<Text style={styles.sheetTitle}>Scrollable Sheet</Text>
			<Text style={styles.sheetSubtitle}>
				FlatList, ScrollView, pull-to-refresh, and keyboard-aware TextInput are supported.
			</Text>
			<BottomSheetTextInput
				placeholder="BottomSheetTextInput"
				style={styles.input}
				accessibilityLabel="Sheet text input"
			/>
			<View style={styles.rowActions}>
				<Pressable style={styles.secondaryButton} onPress={collapse}>
					<Text style={styles.secondaryButtonText}>Collapse</Text>
				</Pressable>
				<Pressable style={styles.secondaryButton} onPress={expand}>
					<Text style={styles.secondaryButtonText}>Expand</Text>
				</Pressable>
			</View>
			{Array.from({ length: 20 }, (_, index) => (
				<View key={index} style={styles.sheetRow}>
					<Text>Scroll row {index + 1}</Text>
				</View>
			))}
			<Pressable style={styles.closeButton} onPress={close}>
				<Text style={styles.closeButtonText}>Close Sheet</Text>
			</Pressable>
		</BottomSheetScrollView>
	);
}

export const SheetScrollDemo = memo(SheetScrollDemoInner);
