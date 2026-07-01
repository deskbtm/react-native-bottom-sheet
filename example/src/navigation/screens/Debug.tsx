import { Text } from '@react-navigation/elements';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBottomSheet } from '@deskbtm-rn/bottom-sheet';

import {
	HostRenderProbeBadge,
	ProtectedHostRenderMarker,
	useHostRenderProbeActions,
} from '@/components/HostRenderProbe';
import { SheetListDemo, SheetScrollDemo, StackedSheetDemo } from '@/components/sheet-demos';

const DebugHostProbe = memo(function DebugHostProbe() {
	return (
		<View style={styles.probeCard}>
			<ProtectedHostRenderMarker />
			<HostRenderProbeBadge />
			<Text style={styles.probeHint}>
				Count should stay flat when you present, dismiss, or stack sheets. It may increase
				when theme or screen size changes.
			</Text>
		</View>
	);
});

function DebugSheetBody({ title }: { title: string }) {
	return (
		<View style={styles.debugSheetBody}>
			<RNText style={styles.debugSheetTitle}>{title}</RNText>
		</View>
	);
}

export function Debug() {
	const { present, dismiss, dismissAll, isPresented, presentedSheetCount } = useBottomSheet();
	const { reset } = useHostRenderProbeActions();
	const insets = useSafeAreaInsets();

	if (!__DEV__) {
		return (
			<SafeAreaView style={styles.container} edges={['top']}>
				<Text style={styles.unavailable}>Performance debug is available in development builds only.</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container} edges={['top']}>
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={[
					styles.scrollContent,
					{ paddingBottom: insets.bottom + 24 },
				]}
			>
				<Text style={styles.heading}>Performance debug</Text>
				<Text style={styles.description}>
					Manual verification for tracks A–D. Track E (bundle size, cold start, expo-observe)
					is documented as out of scope in the repo README.
				</Text>
				<View style={styles.checklistCard}>
					<Text style={styles.checklistItem}>A — Render isolation</Text>
					<Text style={styles.checklistItem}>B — Gesture fluency</Text>
					<Text style={styles.checklistItem}>C — Sheet scroll + keyboard</Text>
					<Text style={styles.checklistItem}>D — Multi-sheet stack</Text>
				</View>

				<Text style={styles.heading}>Track A — Render isolation</Text>
				<Text style={styles.description}>
					Protected host content should not re-render on sheet lifecycle.
				</Text>

				<DebugHostProbe />

				<Text style={styles.sectionLabel}>Sheet lifecycle</Text>
				<View style={styles.buttonRow}>
					<Pressable
						style={styles.debugButton}
						onPress={() =>
							present(<DebugSheetBody title="Presentation sheet" />, {
								snapPoints: ['40%'],
								index: 0,
							})
						}
					>
						<Text style={styles.debugButtonText}>Present presentation</Text>
					</Pressable>
					<Pressable
						style={styles.debugButton}
						onPress={() =>
							present(<DebugSheetBody title="Push sheet" />, {
								mode: 'push',
								snapPoints: ['35%', '70%'],
								index: 0,
							})
						}
					>
						<Text style={styles.debugButtonText}>Present push</Text>
					</Pressable>
					<Pressable
						style={styles.debugButton}
						onPress={() =>
							present(<DebugSheetBody title="Modal sheet" />, {
								mode: 'modal',
								snapPoints: ['45%'],
								index: 0,
							})
						}
					>
						<Text style={styles.debugButtonText}>Present modal</Text>
					</Pressable>
					<Pressable
						style={styles.debugButton}
						onPress={() => {
							present(<DebugSheetBody title="Bottom stack" />, { snapPoints: ['30%'] });
							present(<DebugSheetBody title="Top stack" />, { snapPoints: ['45%'] });
						}}
					>
						<Text style={styles.debugButtonText}>Stack two sheets</Text>
					</Pressable>
					<Pressable style={styles.debugButton} onPress={() => dismiss()}>
						<Text style={styles.debugButtonText}>Dismiss top</Text>
					</Pressable>
					<Pressable style={styles.debugButton} onPress={() => dismissAll()}>
						<Text style={styles.debugButtonText}>Dismiss all</Text>
					</Pressable>
					<Pressable style={styles.debugButtonSecondary} onPress={() => reset()}>
						<Text style={styles.debugButtonText}>Reset render counter</Text>
					</Pressable>
				</View>

				<Text style={styles.status}>
					Stack: {presentedSheetCount} · {isPresented ? 'sheet open' : 'idle'}
				</Text>

				<Text style={styles.heading}>Track B — Gesture fluency</Text>
				<Text style={styles.description}>
					Pan and host motion should stay on the UI thread. Use the buttons above, then
					manually verify:
				</Text>
				<View style={styles.checklistCard}>
					<Text style={styles.checklistItem}>
						1. Drag the handle slowly — host scales with sheet.
					</Text>
					<Text style={styles.checklistItem}>
						2. Flick up/down across detents — motion springs without stutter.
					</Text>
					<Text style={styles.checklistItem}>
						3. Pan down to dismiss — host returns smoothly with the sheet.
					</Text>
					<Text style={styles.checklistItem}>
						4. Try push mode — host push-up tracks sheet Y while dragging.
					</Text>
				</View>
				<Pressable
					style={styles.debugButton}
					onPress={() =>
						present(<DebugSheetBody title="Gesture fluency" />, {
							mode: 'presentation',
							snapPoints: ['35%', '70%', 'full'],
							index: 1,
							enablePanDownToClose: true,
						})
					}
				>
					<Text style={styles.debugButtonText}>Open multi-detent sheet for drag test</Text>
				</Pressable>

				<Text style={styles.heading}>Track C — Sheet scroll</Text>
				<Text style={styles.description}>
					Use library scrollables only. Raw RN ScrollView does not participate in
					scroll-to-pan handoff.
				</Text>
				<View style={styles.checklistCard}>
					<Text style={styles.checklistItem}>
						1. Open scroll sheet, scroll down, drag content — list scrolls, sheet stays.
					</Text>
					<Text style={styles.checklistItem}>
						2. Scroll back to top, drag down — sheet dismisses or moves with pan.
					</Text>
					<Text style={styles.checklistItem}>
						3. Drag handle while list is scrolled — handle always moves the sheet.
					</Text>
					<Text style={styles.checklistItem}>
						4. Focus TextInput — keyboard lifts sheet (`keyboardBehavior: interactive`).
					</Text>
					<Text style={styles.probeHint}>
						`BottomSheetFlashList` currently aliases FlatList; native FlashList is a later
						phase.
					</Text>
				</View>
				<View style={styles.buttonRow}>
					<Pressable
						style={styles.debugButton}
						onPress={() =>
							present(<SheetScrollDemo />, {
								snapPoints: ['50%', '90%'],
								index: 0,
								keyboardBehavior: 'interactive',
								enableContentPanningGesture: true,
							})
						}
					>
						<Text style={styles.debugButtonText}>Open scroll + keyboard sheet</Text>
					</Pressable>
					<Pressable
						style={styles.debugButton}
						onPress={() =>
							present(<SheetListDemo />, {
								snapPoints: ['35%', '75%', 'full'],
								index: 1,
								enableContentPanningGesture: true,
							})
						}
					>
						<Text style={styles.debugButtonText}>Open FlatList sheet</Text>
					</Pressable>
				</View>

				<Text style={styles.heading}>Track D — Multi-sheet stack</Text>
				<Text style={styles.description}>
					Every presented sheet stays mounted in the overlay. Host motion comes from the
					bottom sheet only; iOS card stacking applies in presentation mode.
				</Text>
				<View style={styles.checklistCard}>
					<Text style={styles.checklistItem}>
						1. Push 3+ stacked sheets — buried cards peek behind the top card.
					</Text>
					<Text style={styles.checklistItem}>
						2. Protected host render count stays flat while stacking (see Track A badge).
					</Text>
					<Text style={styles.checklistItem}>
						3. Dismiss top sheet — stack depth decreases, buried sheet becomes interactive.
					</Text>
					<Text style={styles.probeHint}>
						No stack depth cap in Phase 1; avoid deep stacks with heavy list content.
					</Text>
				</View>
				<Pressable
					style={styles.debugButton}
					onPress={() =>
						present(<StackedSheetDemo />, {
							snapPoints: ['45%', '80%'],
							index: 0,
						})
					}
				>
					<Text style={styles.debugButtonText}>Open stacked sheet demo</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	unavailable: {
		flex: 1,
		textAlign: 'center',
		opacity: 0.6,
		paddingHorizontal: 32,
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 24,
		paddingTop: 16,
		gap: 12,
	},
	heading: {
		fontSize: 20,
		fontWeight: '600',
	},
	description: {
		opacity: 0.65,
		lineHeight: 20,
	},
	probeCard: {
		gap: 8,
		padding: 12,
		borderRadius: 12,
		backgroundColor: 'rgba(120, 120, 128, 0.08)',
	},
	probeHint: {
		fontSize: 12,
		lineHeight: 17,
		opacity: 0.7,
	},
	sectionLabel: {
		marginTop: 8,
		fontSize: 13,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 0.4,
		opacity: 0.55,
	},
	buttonRow: {
		gap: 8,
	},
	debugButton: {
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: 'rgba(0, 122, 255, 0.12)',
	},
	debugButtonSecondary: {
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: 'rgba(120, 120, 128, 0.12)',
	},
	debugButtonText: {
		fontWeight: '500',
	},
	status: {
		marginTop: 4,
		fontVariant: ['tabular-nums'],
		opacity: 0.7,
	},
	debugSheetBody: {
		padding: 24,
		alignItems: 'center',
	},
	debugSheetTitle: {
		fontSize: 17,
		fontWeight: '600',
	},
	checklistCard: {
		gap: 6,
		padding: 12,
		borderRadius: 12,
		backgroundColor: 'rgba(120, 120, 128, 0.08)',
	},
	checklistItem: {
		fontSize: 13,
		lineHeight: 18,
	},
});
