import { useRef } from 'react';
import {
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
    SafeAreaProvider,
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetProvider,
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

function SheetListDemo() {
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

function StackedSheetDemo() {
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

function PushSheetDemo() {
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

function MaskDemo() {
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

function DynamicSheetDemo() {
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

function DemoScreen() {
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
				<Text style={styles.heading}>@deskbtm-rn/bottom-sheet</Text>
				<Text style={styles.description}>
					iOS-style sheet presentation with gorhom-like API on iOS, Android, and Web.
				</Text>

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

export default function App() {
	return (
		<GestureHandlerRootView style={styles.root}>
			<SafeAreaProvider>
				<KeyboardProvider preload={false}>
					<BottomSheetProvider mode="presentation">
						<DemoScreen />
					</BottomSheetProvider>
				</KeyboardProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
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
