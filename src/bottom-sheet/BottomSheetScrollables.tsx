import type { ReactElement } from 'react';
import {
	SectionList,
	StyleSheet,
	TextInput,
	View,
	type FlatListProps,
	type LayoutChangeEvent,
	type SectionListProps,
	type StyleProp,
	type TextInputProps,
	type ViewProps,
	type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	createAnimatedComponent,
	useAnimatedScrollHandler,
	type AnimatedScrollViewProps,
} from 'react-native-reanimated';

import { useBottomSheetContent } from './BottomSheetContentContext';
import { getBottomSheetScrollBottomPadding } from './constants';

function mergeScrollContentContainerStyle(
	contentContainerStyle: StyleProp<ViewStyle> | undefined,
	bottomInset: number,
): StyleProp<ViewStyle> {
	const flat = StyleSheet.flatten(contentContainerStyle) ?? {};
	const existingBottom =
		typeof flat.paddingBottom === 'number'
			? flat.paddingBottom
			: typeof flat.padding === 'number'
				? flat.padding
				: typeof flat.paddingVertical === 'number'
					? flat.paddingVertical
					: 0;

	return [
		contentContainerStyle,
		{
			paddingBottom: existingBottom + getBottomSheetScrollBottomPadding(bottomInset),
		},
	];
}

const AnimatedSectionList = createAnimatedComponent(SectionList);

function useBottomSheetScrollHandler() {
	const { scrollOffset } = useBottomSheetContent();
	const nativeGesture = Gesture.Native();

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollOffset.value = Math.max(0, event.contentOffset.y);
		},
	});

	return { scrollHandler, nativeGesture };
}

function reportDynamicContentHeight(
	event: LayoutChangeEvent,
	onLayout: ViewProps['onLayout'],
	onContentLayout: (height: number) => void,
) {
	onLayout?.(event);
	onContentLayout(event.nativeEvent.layout.height);
}

/**
 * Root container for sheet content. Required for `enableDynamicSizing` (reports content height).
 * Use instead of a plain `View` inside sheets.
 */
export function BottomSheetView({ children, onLayout, style, ...rest }: ViewProps) {
	const { onContentLayout, enableDynamicSizing, bottomInset } = useBottomSheetContent();

	if (enableDynamicSizing) {
		return (
			<View
				{...rest}
				style={[styles.dynamicRoot, style]}
				onLayout={(event) => reportDynamicContentHeight(event, onLayout, onContentLayout)}
			>
				{children}
			</View>
		);
	}

	return (
		<Animated.View
			{...rest}
			style={[style, { paddingBottom: bottomInset }]}
			onLayout={onLayout}
		>
			{children}
		</Animated.View>
	);
}

/** ScrollView wired to sheet pan gestures. Use inside `present()` or `BottomSheetModal` content. */
export function BottomSheetScrollView({
	children,
	scrollEventThrottle = 16,
	style,
	contentContainerStyle,
	...rest
}: AnimatedScrollViewProps) {
	const { scrollHandler, nativeGesture } = useBottomSheetScrollHandler();
	const { enableDynamicSizing, bottomInset } = useBottomSheetContent();
	const mergedContentContainerStyle = enableDynamicSizing
		? contentContainerStyle
		: mergeScrollContentContainerStyle(
				contentContainerStyle as StyleProp<ViewStyle> | undefined,
				bottomInset,
			);

	return (
		<GestureDetector gesture={nativeGesture}>
			<Animated.ScrollView
				{...rest}
				style={[styles.scrollContainer, style]}
				contentContainerStyle={
					mergedContentContainerStyle as AnimatedScrollViewProps['contentContainerStyle']
				}
				onScroll={scrollHandler}
				scrollEventThrottle={scrollEventThrottle}
				nestedScrollEnabled
				bounces
			>
				{children}
			</Animated.ScrollView>
		</GestureDetector>
	);
}

/** FlatList wired to sheet pan gestures. Supports pull-to-refresh via `refreshControl`. */
export function BottomSheetFlatList<ItemT>({
	scrollEventThrottle = 16,
	style,
	contentContainerStyle,
	...rest
}: FlatListProps<ItemT>) {
	const { scrollHandler, nativeGesture } = useBottomSheetScrollHandler();
	const { bottomInset } = useBottomSheetContent();
	const mergedContentContainerStyle = mergeScrollContentContainerStyle(
		contentContainerStyle,
		bottomInset,
	);

	const listProps = {
		...rest,
		style: [styles.scrollContainer, style],
		contentContainerStyle: mergedContentContainerStyle,
		onScroll: scrollHandler,
		scrollEventThrottle,
		nestedScrollEnabled: true,
		bounces: rest.bounces ?? true,
	};

	return (
		<GestureDetector gesture={nativeGesture}>
			{/* @ts-ignore Reanimated FlatList typing is incompatible with RN FlatList props. */}
			<Animated.FlatList {...listProps} />
		</GestureDetector>
	);
}

/** SectionList wired to sheet pan gestures. */
export function BottomSheetSectionList<ItemT, SectionT = unknown>({
	scrollEventThrottle = 16,
	style,
	contentContainerStyle,
	...rest
}: SectionListProps<ItemT, SectionT>) {
	const { scrollHandler, nativeGesture } = useBottomSheetScrollHandler();
	const { bottomInset } = useBottomSheetContent();
	const mergedContentContainerStyle = mergeScrollContentContainerStyle(
		contentContainerStyle,
		bottomInset,
	);

	const listProps = {
		...rest,
		style: [styles.scrollContainer, style],
		contentContainerStyle: mergedContentContainerStyle,
		onScroll: scrollHandler,
		scrollEventThrottle,
		nestedScrollEnabled: true,
		bounces: rest.bounces ?? true,
	};

	return (
		<GestureDetector gesture={nativeGesture}>
			{/* @ts-ignore Animated SectionList typing is incompatible with RN SectionList props. */}
			<AnimatedSectionList {...listProps} />
		</GestureDetector>
	);
}

/** Uses FlatList until `@shopify/flash-list` is installed in the project. */
export const BottomSheetFlashList = BottomSheetFlatList;

/** TextInput for sheet content; pair with `keyboardBehavior: 'interactive'` on the sheet. */
export function BottomSheetTextInput(props: TextInputProps) {
	return <TextInput {...props} />;
}

export type BottomSheetFlatListProps<ItemT> = FlatListProps<ItemT>;
export type BottomSheetSectionListProps<ItemT, SectionT> = SectionListProps<
	ItemT,
	SectionT
>;

export type BottomSheetScrollViewElement = ReactElement;

const styles = StyleSheet.create({
	dynamicRoot: {
		width: '100%',
	},
	scrollContainer: {
		flex: 1,
		minHeight: 0,
	},
});
