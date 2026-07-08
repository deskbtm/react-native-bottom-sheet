import { Text } from '@react-navigation/elements';
import { memo, useRef, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
	BottomSheetModal,
	useBottomSheet,
	type BottomSheetModalRef,
} from '@deskbtm/react-native-bottom-sheet';

import {
	HostRenderProbeBadge,
	ProtectedHostRenderMarker,
} from '@/components/HostRenderProbe';
import {
	DynamicSheetDemo,
	MaskDemo,
	PushSheetDemo,
	SheetListDemo,
	SheetScrollDemo,
	StackedSheetDemo,
	sheetDemoStyles,
} from '@/components/sheet-demos';

const DemosHostProbe = memo(function DemosHostProbe() {
	return (
		<View style={styles.probeWrap}>
			<ProtectedHostRenderMarker />
			<HostRenderProbeBadge />
		</View>
	);
});

function DemoSection({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			{description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
			<View style={styles.sectionBody}>{children}</View>
		</View>
	);
}

function DemoButton({ label, onPress }: { label: string; onPress: () => void }) {
	return (
		<Pressable style={sheetDemoStyles.demoButton} onPress={onPress}>
			<Text style={sheetDemoStyles.demoButtonText}>{label}</Text>
		</Pressable>
	);
}

export function Demos() {
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
				<Text style={styles.heading}>Bottom Sheet Demos</Text>
				<Text style={styles.description}>
					Presentation scales the app like iOS sheets; push lifts the host behind the
					sheet. Runs on iOS, Android, and Web.
				</Text>

				<DemosHostProbe />

				<DemoSection
					title="present()"
					description="Imperative API — sheet content renders in the overlay subtree (outside NavigationContainer). Use React Native components inside sheet bodies."
				>
					<DemoButton
						label="ScrollView + keyboard"
						onPress={() =>
							present(<SheetScrollDemo />, {
								snapPoints: ['50%', '90%'],
								index: 0,
								keyboardBehavior: 'interactive',
								enableContentPanningGesture: true,
							})
						}
					/>
					<DemoButton
						label="Stacked sheets (iOS cards)"
						onPress={() =>
							present(<StackedSheetDemo />, {
								snapPoints: ['45%', '80%'],
								index: 0,
							})
						}
					/>
				</DemoSection>

				<DemoSection
					title="BottomSheetModal"
					description="Declarative modal slots — mount once, call ref.present() to show."
				>
					<DemoButton
						label="Modal + ScrollView"
						onPress={() => scrollModalRef.current?.present()}
					/>
					<DemoButton
						label="Modal + FlatList"
						onPress={() => listModalRef.current?.present()}
					/>
					<DemoButton
						label="Dynamic sizing"
						onPress={() => dynamicModalRef.current?.present()}
					/>
				</DemoSection>

				<DemoSection
					title="Presentation modes"
					description="Push slides the host up; modal and presentation use scale/backdrop variants."
				>
					<DemoButton
						label="Push mode"
						onPress={() =>
							present(<PushSheetDemo />, {
								mode: 'push',
								snapPoints: ['35%', '70%', 'full'],
								index: 0,
							})
						}
					/>
					<DemoButton
						label="Push from top"
						onPress={() =>
							present(<PushSheetDemo />, {
								mode: 'push',
								pushDirection: 'top',
								snapPoints: ['35%', '70%', 'full'],
								index: 0,
							})
						}
					/>
				</DemoSection>

				<DemoSection
					title="Backdrop options"
					description="Scrim press and color customization."
				>
					<DemoButton
						label="dismissOnScrimPress: false"
						onPress={() =>
							present(<MaskDemo />, {
								snapPoints: ['40%'],
								index: 0,
								dismissOnScrimPress: false,
							})
						}
					/>
					<DemoButton
						label="Custom scrimColor"
						onPress={() =>
							present(<MaskDemo />, {
								snapPoints: ['40%'],
								index: 0,
								scrimColor: 'rgba(0,0,0,0.45)',
							})
						}
					/>
				</DemoSection>
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
		gap: 20,
		paddingHorizontal: 24,
		paddingTop: 8,
	},
	probeWrap: {
		marginBottom: 4,
	},
	heading: {
		fontSize: 22,
		fontWeight: '700',
	},
	description: {
		opacity: 0.6,
		lineHeight: 20,
	},
	section: {
		gap: 8,
	},
	sectionTitle: {
		fontSize: 17,
		fontWeight: '600',
	},
	sectionDescription: {
		fontSize: 13,
		lineHeight: 18,
		opacity: 0.65,
	},
	sectionBody: {
		gap: 10,
	},
});
