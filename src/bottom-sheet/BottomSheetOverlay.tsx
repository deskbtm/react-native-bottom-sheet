import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getBottomSheetScrollBottomPadding } from './constants';
import { DEFAULT_LAYOUT_OPTIONS } from './mergeLayoutOptions';
import { BottomSheetContentContext } from './BottomSheetContentContext';
import { BottomSheetHandle } from './BottomSheetHandle';
import { BottomSheetMask } from './BottomSheetMask';
import { BottomSheetScrollView } from './BottomSheetScrollables';
import type { BottomSheetControllerApi, BottomSheetLayoutOptions, BottomSheetState } from './types';
import { useBottomSheetController } from './useBottomSheetController';
import { usePushSheetCardStyle, usePushSheetScaleStyle } from './usePushSheetStyle';
import { useStackCardStyle } from './useStackCardStyle';

interface BottomSheetOverlayProps {
	sheet: BottomSheetState;
	progress: SharedValue<number>;
	hostSheetTopY?: SharedValue<number>;
	pushProgressOpenY?: SharedValue<number>;
	stackIndex?: number;
	stackSize?: number;
	depthFromTop?: number;
	enableStackCardStyle?: boolean;
	isTop?: boolean;
	showBackdrop?: boolean;
	onDismissComplete: () => void;
	onDismissHandlerChange: (handler: (() => void) | undefined) => void;
	onControllerReady: (controller: BottomSheetControllerApi | undefined) => void;
	layout?: BottomSheetLayoutOptions;
}

export function BottomSheetOverlay({
	sheet,
	progress,
	hostSheetTopY,
	pushProgressOpenY,
	stackIndex = 0,
	depthFromTop = 0,
	enableStackCardStyle = true,
	isTop = true,
	onDismissComplete,
	onDismissHandlerChange,
	onControllerReady,
	layout = DEFAULT_LAYOUT_OPTIONS,
}: BottomSheetOverlayProps) {
	const { height: screenHeight, width: screenWidth } = useWindowDimensions();
	const idlePushProgressOpenY = useSharedValue(screenHeight);
	const insets = useSafeAreaInsets();
	const { options, content: sheetContent } = sheet;
	const { theme } = options;
	const isPushLayout = options.mode === 'push';

	const controller = useBottomSheetController({
		options,
		layout,
		progress,
		hostSheetTopY,
		pushProgressOpenY,
		screenHeight,
		topInset: insets.top,
		bottomInset: insets.bottom,
		onDismissComplete,
		onDismissHandlerChange,
		onControllerReady,
	});

	const stackCardStyle = useStackCardStyle(
		enableStackCardStyle ? depthFromTop : 0,
		controller.animatedPosition,
		screenHeight,
		enableStackCardStyle,
		layout,
	);
	const pushOpenY = pushProgressOpenY ?? idlePushProgressOpenY;
	const pushSheetScaleStyle = usePushSheetScaleStyle(
		controller.animatedPosition,
		pushOpenY,
		screenHeight,
		screenWidth,
		isPushLayout && pushProgressOpenY != null,
		layout,
	);
	const pushSheetCardStyle = usePushSheetCardStyle(
		controller.animatedPosition,
		pushOpenY,
		screenHeight,
		isPushLayout && pushProgressOpenY != null,
		layout,
	);

	const internalContextValue = {
		animatedIndex: controller.animatedIndex,
		animatedPosition: controller.animatedPosition,
		scrollOffset: controller.scrollOffset,
		snapToIndex: controller.snapToIndex,
		close: controller.closeSheet,
		expand: controller.expand,
		collapse: controller.collapse,
		enableContentPanningGesture: controller.enableContentPanningGesture,
		enableDynamicSizing: controller.enableDynamicSizing,
		bottomInset: insets.bottom,
		onContentLayout: controller.onContentLayout,
		sheetDragGesture: controller.sheetDragGesture,
	};

	const dynamicContentPaddingStyle = useAnimatedStyle(() => {
		const keyboard = controller.keyboardOffset.value;
		if (keyboard > 0) {
			// Sheet container already sits on the keyboard; avoid double vertical inset.
			return { paddingBottom: layout.scroll.endExtra };
		}
		return {
			paddingBottom: getBottomSheetScrollBottomPadding(
				insets.bottom,
				layout.scroll.endExtra,
			),
		};
	});

	const fixedContentWrapperStyle = styles.sheetContent;

	const handleArea = options.showHandle ? (
		<BottomSheetHandle color={theme.handleColor} />
	) : (
		<View style={{ height: layout.handle.hiddenHeight }} />
	);

	const sheetBody = (
		<View style={styles.sheetBody}>
			{isTop ? (
				<GestureDetector gesture={controller.handlePanGesture}>
					<Animated.View>{handleArea}</Animated.View>
				</GestureDetector>
			) : (
				<View pointerEvents="none">{handleArea}</View>
			)}

			{controller.enableDynamicSizing ? (
				<BottomSheetScrollView
					style={styles.dynamicScroll}
					contentContainerStyle={styles.dynamicSheetContent}
					keyboardShouldPersistTaps="handled"
					scrollEnabled={isTop}
				>
					<Animated.View style={dynamicContentPaddingStyle}>{sheetContent}</Animated.View>
				</BottomSheetScrollView>
			) : controller.enableContentPanningGesture && isTop ? (
				<GestureDetector gesture={controller.contentPanGesture}>
					<Animated.View style={fixedContentWrapperStyle}>{sheetContent}</Animated.View>
				</GestureDetector>
			) : (
				<View style={fixedContentWrapperStyle} pointerEvents={isTop ? 'auto' : 'none'}>
					{sheetContent}
				</View>
			)}
		</View>
	);

	return (
		<View
			style={[StyleSheet.absoluteFill, styles.overlay, { zIndex: 2 + stackIndex * 10 }]}
			pointerEvents={isTop ? 'box-none' : 'none'}
			accessibilityViewIsModal={isTop}
			importantForAccessibility={isTop ? 'yes' : 'no-hide-descendants'}
		>
			{isTop ? (
				<BottomSheetMask
					sheetTopY={controller.animatedPosition}
					pressable={options.dismissOnScrimPress}
					onPress={controller.closeSheet}
					color={options.scrimColor}
				/>
			) : null}
			<Animated.View
				style={[
					styles.sheet,
					isPushLayout && styles.sheetPushClip,
					options.sheetStyle,
					controller.sheetStyle,
				]}
				accessibilityLabel={options.accessibilityLabel}
				pointerEvents="box-none"
			>
				{isPushLayout ? (
					<Animated.View style={[styles.pushSheetScale, pushSheetScaleStyle]}>
						<Animated.View
							style={[
								styles.sheetCard,
								pushSheetCardStyle,
								{ backgroundColor: theme.sheetBackgroundColor },
							]}
						>
							<BottomSheetContentContext.Provider value={internalContextValue}>
								{sheetBody}
							</BottomSheetContentContext.Provider>
						</Animated.View>
					</Animated.View>
				) : (
					<Animated.View
						style={[
							styles.sheetCard,
							stackCardStyle,
							{ backgroundColor: theme.sheetBackgroundColor },
						]}
					>
						<BottomSheetContentContext.Provider value={internalContextValue}>
							{sheetBody}
						</BottomSheetContentContext.Provider>
					</Animated.View>
				)}
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {},
	sheet: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		overflow: 'visible',
	},
	sheetPushClip: {
		overflow: 'hidden',
	},
	pushSheetScale: {
		flex: 1,
	},
	sheetCard: {
		flex: 1,
		overflow: 'hidden',
		backgroundColor: 'transparent',
	},
	sheetBody: {
		flex: 1,
		minHeight: 0,
	},
	sheetContent: {
		flex: 1,
		minHeight: 0,
	},
	dynamicScroll: {
		flex: 1,
		minHeight: 0,
	},
	dynamicSheetContent: {
		flexGrow: 1,
		width: '100%',
	},
});
