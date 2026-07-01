import { Button, Text } from '@react-navigation/elements';
import { useRef } from 'react';
import {
	Pressable,
	RefreshControl,
	Text as RNText,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
	BottomSheetView,
	useBottomSheet,
	useBottomSheetContent,
	type BottomSheetModalRef,
} from '@deskbtm-rn/bottom-sheet';

const LIST_DEMO_DATA = Array.from({ length: 30 }, (_, index) => `Item ${index + 1}`);

function SheetScrollDemo() {
	const { close, expand, collapse } = useBottomSheetContent();

	return (
		<BottomSheetScrollView
			contentContainerStyle={styles.sheetInner}
			refreshControl={
				<RefreshControl refreshing={false} onRefresh={() => console.log('refresh')} />
			}
		>
			<RNText style={styles.sheetTitle}>Scrollable Sheet</RNText>
			<RNText style={styles.sheetSubtitle}>
				FlatList, ScrollView, pull-to-refresh, and keyboard-aware TextInput are supported.
			</RNText>
			<BottomSheetTextInput
				placeholder="BottomSheetTextInput"
				style={styles.input}
				accessibilityLabel="Sheet text input"
			/>
			<View style={styles.rowActions}>
				<Pressable style={styles.secondaryButton} onPress={collapse}>
					<RNText style={styles.secondaryButtonText}>Collapse</RNText>
				</Pressable>
				<Pressable style={styles.secondaryButton} onPress={expand}>
					<RNText style={styles.secondaryButtonText}>Expand</RNText>
				</Pressable>
			</View>
			{Array.from({ length: 20 }, (_, index) => (
				<View key={index} style={styles.sheetRow}>
					<RNText>Scroll row {index + 1}</RNText>
				</View>
			))}
			<Pressable style={styles.closeButton} onPress={close}>
				<RNText style={styles.closeButtonText}>Close Sheet</RNText>
			</Pressable>
		</BottomSheetScrollView>
	);
}

function SheetListDemo() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetFlatList
			data={LIST_DEMO_DATA}
			keyExtractor={(item) => item}
			contentContainerStyle={styles.sheetInner}
			renderItem={({ item }) => (
				<View style={styles.sheetRow}>
					<RNText>{item}</RNText>
				</View>
			)}
			ListHeaderComponent={
				<View style={styles.listHeader}>
					<RNText style={styles.sheetTitle}>FlatList Sheet</RNText>
					<RNText style={styles.sheetSubtitle}>
						Scroll the list, then drag the handle to resize or dismiss.
					</RNText>
				</View>
			}
			ListFooterComponent={
				<Pressable style={styles.closeButton} onPress={close}>
					<RNText style={styles.closeButtonText}>Close Sheet</RNText>
				</Pressable>
			}
		/>
	);
}

function StackedSheetInner() {
	const { close } = useBottomSheetContent();
	const { presentedSheetCount, dismissAll } = useBottomSheet();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<RNText style={styles.sheetTitle}>Stacked sheet #{presentedSheetCount}</RNText>
			<RNText style={styles.sheetSubtitle}>Swipe down or tap to close this level.</RNText>
			<Pressable style={styles.closeButton} onPress={close}>
				<RNText style={styles.closeButtonText}>Close top</RNText>
			</Pressable>
			<Pressable style={styles.secondaryButton} onPress={dismissAll}>
				<RNText style={styles.secondaryButtonText}>Dismiss all</RNText>
			</Pressable>
		</BottomSheetView>
	);
}

function StackedSheetDemo() {
	const { present, presentedSheetCount } = useBottomSheet();
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<RNText style={styles.sheetTitle}>Stacked sheets (iOS cards)</RNText>
			<RNText style={styles.sheetSubtitle}>
				Depth: {presentedSheetCount}. Push another sheet — the one below shrinks and peeks
				behind.
			</RNText>
			<Pressable
				style={styles.demoButton}
				onPress={() =>
					present(<StackedSheetInner />, {
						snapPoints: ['35%', '70%'],
						index: 0,
					})
				}
			>
				<RNText style={styles.demoButtonText}>Push stacked sheet</RNText>
			</Pressable>
			<Pressable style={styles.closeButton} onPress={close}>
				<RNText style={styles.closeButtonText}>Close</RNText>
			</Pressable>
		</BottomSheetView>
	);
}

function PushSheetDemo() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<RNText style={styles.sheetTitle}>Push layout</RNText>
			<RNText style={styles.sheetSubtitle}>
				Host screen and sheet get rounded corners with a gap between them.
			</RNText>
			<Pressable style={styles.closeButton} onPress={close}>
				<RNText style={styles.closeButtonText}>Close Sheet</RNText>
			</Pressable>
		</BottomSheetView>
	);
}

function MaskDemo() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<RNText style={styles.sheetTitle}>Sheet mask</RNText>
			<RNText style={styles.sheetSubtitle}>
				Mask sits above the sheet body only. Sheet content here stays tappable.
			</RNText>
			<Pressable style={styles.closeButton} onPress={close}>
				<RNText style={styles.closeButtonText}>Close Sheet</RNText>
			</Pressable>
		</BottomSheetView>
	);
}

function DynamicSheetDemo() {
	const { close } = useBottomSheetContent();

	return (
		<BottomSheetView style={styles.sheetInner}>
			<RNText style={styles.sheetTitle}>Dynamic Sizing</RNText>
			<RNText style={styles.sheetSubtitle}>
				This sheet grows with its content when `enableDynamicSizing` is enabled.
			</RNText>
			<BottomSheetTextInput
				placeholder="Type to grow content"
				style={styles.input}
				multiline
				accessibilityLabel="Dynamic sheet text input"
			/>
			<Pressable style={styles.closeButton} onPress={close}>
				<RNText style={styles.closeButtonText}>Close Sheet</RNText>
			</Pressable>
		</BottomSheetView>
	);
}

export function Home() {
	const { present } = useBottomSheet();
	const insets = useSafeAreaInsets();
	const scrollModalRef = useRef<BottomSheetModalRef>(null);
	const listModalRef = useRef<BottomSheetModalRef>(null);
	const dynamicModalRef = useRef<BottomSheetModalRef>(null);

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingBottom: insets.bottom + 24 },
				]}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<Text style={styles.heading}>Home Screen</Text>
				<Text style={styles.description}>
					iOS-style sheet presentation with gorhom-like API on iOS, Android, and Web.
				</Text>

				<Button screen="Profile" params={{ user: 'jane' }}>
					Go to Profile
				</Button>
				<Button screen="Settings" params={{}}>
					Go to Settings
				</Button>

				<Pressable
					style={styles.demoButton}
					onPress={() =>
						present(<SheetScrollDemo />, {
							snapPoints: ['50%', '90%'],
							index: 0,
							keyboardBehavior: 'interactive',
							enableContentPanningGesture: true,
						})
					}
				>
					<Text style={styles.demoButtonText}>present() + BottomSheetScrollView</Text>
				</Pressable>

				<Pressable
					style={styles.demoButton}
					onPress={() =>
						present(<StackedSheetDemo />, {
							snapPoints: ['45%', '80%'],
							index: 0,
						})
					}
				>
					<Text style={styles.demoButtonText}>Stacked sheets (iOS cards)</Text>
				</Pressable>

				<Pressable
					style={styles.demoButton}
					onPress={() => scrollModalRef.current?.present()}
				>
					<Text style={styles.demoButtonText}>BottomSheetModal + ScrollView</Text>
				</Pressable>

				<Pressable
					style={styles.demoButton}
					onPress={() => listModalRef.current?.present()}
				>
					<Text style={styles.demoButtonText}>BottomSheetModal + FlatList</Text>
				</Pressable>

				<Pressable
					style={styles.demoButton}
					onPress={() => dynamicModalRef.current?.present()}
				>
					<Text style={styles.demoButtonText}>Dynamic Sizing Sheet</Text>
				</Pressable>

				<Pressable
					style={styles.demoButton}
					onPress={() =>
						present(<PushSheetDemo />, {
							mode: 'push',
							snapPoints: ['35%', '70%', 'full'],
							index: 0,
						})
					}
				>
					<Text style={styles.demoButtonText}>Push mode (screen slides up)</Text>
				</Pressable>

				<Pressable
					style={styles.demoButton}
					onPress={() =>
						present(<MaskDemo />, {
							snapPoints: ['40%'],
							index: 0,
							dismissOnScrimPress: false,
						})
					}
				>
					<Text style={styles.demoButtonText}>dismissOnScrimPress: false</Text>
				</Pressable>

				<Pressable
					style={styles.demoButton}
					onPress={() =>
						present(<MaskDemo />, {
							snapPoints: ['40%'],
							index: 0,
							scrimColor: 'rgba(0,0,0,0.45)',
						})
					}
				>
					<Text style={styles.demoButtonText}>scrimColor dimmed</Text>
				</Pressable>
			</ScrollView>

			<BottomSheetModal
				ref={scrollModalRef}
				snapPoints={['40%', '85%']}
				index={0}
				keyboardBehavior="interactive"
			>
				<SheetScrollDemo />
			</BottomSheetModal>

			<BottomSheetModal ref={listModalRef} snapPoints={['35%', '75%', 'full']} index={1}>
				<SheetListDemo />
			</BottomSheetModal>

			<BottomSheetModal
				ref={dynamicModalRef}
				enableDynamicSizing
				snapPoints={[]}
				keyboardBehavior="interactive"
			>
				<DynamicSheetDemo />
			</BottomSheetModal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		alignItems: 'stretch',
		gap: 12,
		paddingHorizontal: 24,
		paddingTop: 8,
	},
	heading: {
		fontSize: 20,
		fontWeight: '600',
	},
	description: {
		textAlign: 'center',
		opacity: 0.6,
		marginBottom: 8,
	},
	demoButton: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 10,
		width: '100%',
		alignItems: 'center',
	},
	demoButtonText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 15,
	},
	sheetInner: {
		padding: 20,
		gap: 12,
	},
	listHeader: {
		gap: 8,
		marginBottom: 8,
	},
	sheetTitle: {
		fontSize: 22,
		fontWeight: '700',
	},
	sheetSubtitle: {
		opacity: 0.6,
		lineHeight: 20,
	},
	sheetRow: {
		padding: 14,
		backgroundColor: '#F2F2F7',
		borderRadius: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#D1D1D6',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		backgroundColor: '#fff',
	},
	rowActions: {
		flexDirection: 'row',
		gap: 10,
	},
	secondaryButton: {
		flex: 1,
		backgroundColor: '#EFEFF4',
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: 'center',
	},
	secondaryButtonText: {
		fontWeight: '600',
	},
	closeButton: {
		marginTop: 8,
		backgroundColor: '#FF3B30',
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
	},
	closeButtonText: {
		color: '#fff',
		fontWeight: '600',
	},
});
