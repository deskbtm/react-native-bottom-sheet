import { Button, Text } from '@react-navigation/elements';
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheetModal, useBottomSheet, type BottomSheetModalRef } from '@deskbtm-rn/bottom-sheet';

import {
	DynamicSheetDemo,
	MaskDemo,
	PushSheetDemo,
	SheetListDemo,
	SheetScrollDemo,
	StackedSheetDemo,
	sheetDemoStyles,
} from '@/components/sheet-demos';

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
					style={sheetDemoStyles.demoButton}
					onPress={() =>
						present(<SheetScrollDemo />, {
							snapPoints: ['50%', '90%'],
							index: 0,
							keyboardBehavior: 'interactive',
							enableContentPanningGesture: true,
						})
					}
				>
					<Text style={sheetDemoStyles.demoButtonText}>
						present() + BottomSheetScrollView
					</Text>
				</Pressable>

				<Pressable
					style={sheetDemoStyles.demoButton}
					onPress={() =>
						present(<StackedSheetDemo />, {
							snapPoints: ['45%', '80%'],
							index: 0,
						})
					}
				>
					<Text style={sheetDemoStyles.demoButtonText}>Stacked sheets (iOS cards)</Text>
				</Pressable>

				<Pressable
					style={sheetDemoStyles.demoButton}
					onPress={() => scrollModalRef.current?.present()}
				>
					<Text style={sheetDemoStyles.demoButtonText}>
						BottomSheetModal + ScrollView
					</Text>
				</Pressable>

				<Pressable
					style={sheetDemoStyles.demoButton}
					onPress={() => listModalRef.current?.present()}
				>
					<Text style={sheetDemoStyles.demoButtonText}>BottomSheetModal + FlatList</Text>
				</Pressable>

				<Pressable
					style={sheetDemoStyles.demoButton}
					onPress={() => dynamicModalRef.current?.present()}
				>
					<Text style={sheetDemoStyles.demoButtonText}>Dynamic Sizing Sheet</Text>
				</Pressable>

				<Pressable
					style={sheetDemoStyles.demoButton}
					onPress={() =>
						present(<PushSheetDemo />, {
							mode: 'push',
							snapPoints: ['35%', '70%', 'full'],
							index: 0,
						})
					}
				>
					<Text style={sheetDemoStyles.demoButtonText}>Push mode (screen slides up)</Text>
				</Pressable>

				<Pressable
					style={sheetDemoStyles.demoButton}
					onPress={() =>
						present(<MaskDemo />, {
							snapPoints: ['40%'],
							index: 0,
							dismissOnScrimPress: false,
						})
					}
				>
					<Text style={sheetDemoStyles.demoButtonText}>dismissOnScrimPress: false</Text>
				</Pressable>

				<Pressable
					style={sheetDemoStyles.demoButton}
					onPress={() =>
						present(<MaskDemo />, {
							snapPoints: ['40%'],
							index: 0,
							scrimColor: 'rgba(0,0,0,0.45)',
						})
					}
				>
					<Text style={sheetDemoStyles.demoButtonText}>scrimColor dimmed</Text>
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
});
