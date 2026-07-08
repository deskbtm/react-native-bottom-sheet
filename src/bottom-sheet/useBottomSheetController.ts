import { useCallback, useEffect, useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
	buildDynamicSheetHeight,
	buildDynamicSnapPoint,
	clampIndex,
	getPushClosedTopY,
	getPushDetentTopY,
	getPushOpenTopY,
	getTranslateYFromSheetHeight,
	mergeSnapPoints,
} from './detents';
import { DEFAULT_LAYOUT_OPTIONS } from './mergeLayoutOptions';
import { pushDirectionToJs } from './pushDirection';
import { getPushLayoutProgress, getPushSheetHeightForDetent } from './pushLayout';
import {
	applySheetDragUpdate,
	applySheetPanSnap,
	resolveSheetPanEnd,
} from './sheetPanWorklets';
import type {
	BottomSheetControllerApi,
	BottomSheetLayoutOptions,
	ResolvedBottomSheetOptions,
} from './types';
import { useBottomSheetKeyboard } from './useBottomSheetKeyboard';
import { getWorkletDetentFractions, pickWorkletLayoutScalars } from './workletLayout';

interface UseSheetControllerParams {
	options: ResolvedBottomSheetOptions;
	layout?: BottomSheetLayoutOptions;
	progress: SharedValue<number>;
	/** When set, sheet Y is written here directly (same ref drives host push layout). */
	hostSheetTopY?: SharedValue<number>;
	/** Push open detent Y on the engine — shared with host for inline progress. */
	pushProgressOpenY?: SharedValue<number>;
	/** Active push panel height — drives top-down host offset. */
	pushSheetHeight?: SharedValue<number>;
	screenHeight: number;
	topInset: number;
	bottomInset: number;
	onDismissComplete: () => void;
	onDismissHandlerChange: (handler: (() => void) | undefined) => void;
	onControllerReady: (controller: BottomSheetControllerApi | undefined) => void;
}

export function useBottomSheetController({
	options,
	layout = DEFAULT_LAYOUT_OPTIONS,
	progress,
	hostSheetTopY,
	pushProgressOpenY,
	pushSheetHeight,
	screenHeight,
	topInset,
	bottomInset,
	onDismissComplete,
	onDismissHandlerChange,
	onControllerReady,
}: UseSheetControllerParams) {
	const [contentHeight, setContentHeight] = useState<number | null>(null);
	const { handle, motion, detents } = layout;
	const layoutScalars = useMemo(() => pickWorkletLayoutScalars(layout), [layout]);
	const handleHeight = options.showHandle ? handle.height : handle.hiddenHeight;

	const dynamicSnapPoint = useMemo(() => {
		if (!options.enableDynamicSizing || contentHeight == null) {
			return null;
		}
		return buildDynamicSnapPoint(
			contentHeight,
			screenHeight,
			topInset,
			bottomInset,
			handleHeight,
		);
	}, [
		bottomInset,
		contentHeight,
		handleHeight,
		options.enableDynamicSizing,
		screenHeight,
		topInset,
	]);

	const effectiveSnapPoints = useMemo(
		() =>
			mergeSnapPoints(options.snapPoints, dynamicSnapPoint, options.enableDynamicSizing),
		[dynamicSnapPoint, options.enableDynamicSizing, options.snapPoints],
	);

	const snapPointsKey = effectiveSnapPoints.join('|');
	const initialIndex = clampIndex(options.index, Math.max(effectiveSnapPoints.length, 1));
	const isDynamicOnly = options.enableDynamicSizing && options.snapPoints.length === 0;
	const isPushLayout = hostSheetTopY != null && pushProgressOpenY != null;
	const pushDirectionJs = pushDirectionToJs(options.pushDirection);
	/** Top-down push is immersive — sheet aligns to y=0, not the safe-area inset. */
	const pushLayoutTopInset = pushDirectionJs === 1 ? 0 : topInset;
	const closedTopY = getPushClosedTopY(pushDirectionJs, screenHeight, pushLayoutTopInset);
	const openTopY = getPushOpenTopY(pushDirectionJs, screenHeight, pushLayoutTopInset);

	const internalSheetTranslateY = useSharedValue(
		isPushLayout ? closedTopY : screenHeight,
	);
	const sheetTranslateY = hostSheetTopY ?? internalSheetTranslateY;
	const dragStartY = useSharedValue(0);
	const touchStartY = useSharedValue(0);
	const activeDetentIndex = useSharedValue(initialIndex);
	const animatedIndex = useSharedValue(initialIndex);
	const scrollOffset = useSharedValue(0);
	const layoutSpring = isPushLayout ? motion.pushLayoutSpring : motion.sheetSpring;
	const { keyboardOffset } = useBottomSheetKeyboard(options.keyboardBehavior, true);

	useEffect(() => {
		if (!isPushLayout || pushProgressOpenY == null) {
			return;
		}
		sheetTranslateY.value = closedTopY;
		pushProgressOpenY.value = openTopY;
		// eslint-disable-next-line react-hooks/exhaustive-deps -- sync engine defaults once per sheet mount
	}, []);

	useAnimatedReaction(
		() => ({
			topY: sheetTranslateY.value,
			openY: pushProgressOpenY?.value ?? openTopY,
		}),
		({ topY, openY }) => {
			if (!isPushLayout || !pushProgressOpenY) {
				return;
			}
			progress.value = getPushLayoutProgress(
				topY,
				openY,
				screenHeight,
				pushDirectionJs,
				pushLayoutTopInset,
			);
		},
		[
			isPushLayout,
			openTopY,
			progress,
			pushDirectionJs,
			pushProgressOpenY,
			screenHeight,
			sheetTranslateY,
			pushLayoutTopInset,
		],
	);

	const notifyIndexChange = useCallback(
		(index: number) => {
			options.onChange?.(index);
		},
		[options],
	);

	const closeSheet = useCallback(() => {
		if (isPushLayout) {
			pushProgressOpenY.value = openTopY;
			sheetTranslateY.value = withSpring(closedTopY, layoutSpring, (finished) => {
				if (finished) {
					scheduleOnRN(onDismissComplete);
				}
			});
			return;
		}

		progress.value = withSpring(0, layoutSpring);
		sheetTranslateY.value = withSpring(screenHeight, layoutSpring, (finished) => {
			if (finished) {
				scheduleOnRN(onDismissComplete);
			}
		});
	}, [
		closedTopY,
		isPushLayout,
		layoutSpring,
		onDismissComplete,
		openTopY,
		progress,
		pushProgressOpenY,
		screenHeight,
		sheetTranslateY,
	]);

	const snapToIndex = useCallback(
		(index: number) => {
			const nextIndex = clampIndex(index, effectiveSnapPoints.length);
			const fromIndex = activeDetentIndex.value;
			const detent = effectiveSnapPoints[nextIndex];
			activeDetentIndex.value = nextIndex;
			animatedIndex.value = nextIndex;
			options.onAnimate?.(fromIndex, nextIndex);
			const targetY = getPushDetentTopY(
				detent,
				pushDirectionJs,
				screenHeight,
				pushLayoutTopInset,
				detents,
			);
			if (isPushLayout) {
				pushProgressOpenY.value = targetY;
			} else {
				progress.value = withSpring(1, layoutSpring);
			}
			if (pushSheetHeight) {
				pushSheetHeight.value = getPushSheetHeightForDetent(
					detent,
					screenHeight,
					pushLayoutTopInset,
					detents,
				);
			}
			sheetTranslateY.value = withSpring(targetY, layoutSpring, (finished) => {
				if (finished) {
					scheduleOnRN(notifyIndexChange, nextIndex);
				}
			});
		},
		[
			activeDetentIndex,
			animatedIndex,
			detents,
			effectiveSnapPoints,
			isPushLayout,
			layoutSpring,
			notifyIndexChange,
			options,
			progress,
			pushDirectionJs,
			pushProgressOpenY,
			pushSheetHeight,
			pushLayoutTopInset,
			screenHeight,
			sheetTranslateY,
			topInset,
			detents,
		],
	);

	const snapToDynamicHeight = useCallback(
		(measuredContentHeight: number, animated = true) => {
			const sheetHeight = buildDynamicSheetHeight(
				measuredContentHeight,
				screenHeight,
				topInset,
				bottomInset,
				handleHeight,
			);
			const targetY =
				pushDirectionJs === 1
					? openTopY
					: getTranslateYFromSheetHeight(sheetHeight, screenHeight);

			if (animated) {
				if (isPushLayout) {
					pushProgressOpenY.value = targetY;
				} else {
					progress.value = withSpring(1, layoutSpring);
				}
				sheetTranslateY.value = withSpring(targetY, layoutSpring, (finished) => {
					if (finished) {
						scheduleOnRN(notifyIndexChange, 0);
					}
				});
				return;
			}

			if (isPushLayout) {
				pushProgressOpenY.value = targetY;
			} else {
				progress.value = 1;
			}
			sheetTranslateY.value = targetY;
		},
		[
			bottomInset,
			handleHeight,
			isPushLayout,
			layoutSpring,
			notifyIndexChange,
			openTopY,
			progress,
			pushDirectionJs,
			pushProgressOpenY,
			screenHeight,
			sheetTranslateY,
			topInset,
		],
	);

	const snapToPosition = useCallback(
		(position: number) => {
			if (isPushLayout) {
				pushProgressOpenY.value = position;
			} else {
				progress.value = withSpring(1, layoutSpring);
			}
			sheetTranslateY.value = withSpring(position, layoutSpring);
		},
		[isPushLayout, layoutSpring, progress, pushProgressOpenY, sheetTranslateY],
	);

	const expand = useCallback(() => {
		snapToIndex(effectiveSnapPoints.length - 1);
	}, [effectiveSnapPoints.length, snapToIndex]);

	const collapse = useCallback(() => {
		snapToIndex(0);
	}, [snapToIndex]);

	useEffect(() => {
		if (isDynamicOnly) {
			if (contentHeight == null || contentHeight <= 0) {
				sheetTranslateY.value = isPushLayout ? closedTopY : screenHeight;
				progress.value = 0;
				return;
			}
			snapToDynamicHeight(contentHeight);
			return;
		}

		if (effectiveSnapPoints.length === 0) {
			return;
		}

		snapToIndex(clampIndex(options.index, effectiveSnapPoints.length));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [snapPointsKey, options.index, contentHeight, isDynamicOnly]);

	useEffect(() => {
		if (!options.enableDynamicSizing || isDynamicOnly) {
			return;
		}
		if (contentHeight == null || contentHeight <= 0) {
			return;
		}

		snapToDynamicHeight(contentHeight);
	}, [contentHeight, isDynamicOnly, options.enableDynamicSizing, snapToDynamicHeight]);

	useEffect(() => {
		onDismissHandlerChange(closeSheet);
		return () => onDismissHandlerChange(undefined);
	}, [closeSheet, onDismissHandlerChange]);

	useEffect(() => {
		const controller: BottomSheetControllerApi = {
			close: closeSheet,
			snapToIndex,
			snapToPosition,
			expand,
			collapse,
		};
		onControllerReady(controller);
		return () => onControllerReady(undefined);
	}, [closeSheet, collapse, expand, onControllerReady, snapToIndex, snapToPosition]);

	const isTopPush = options.pushDirection === 'top';
	const panActivationOffset = layoutScalars.gestureActivationOffset;

	const handlePanGesture = useMemo(() => {
		return Gesture.Pan()
			.activeOffsetY(isTopPush ? [-panActivationOffset, 0] : [0, panActivationOffset])
			.failOffsetX([-12, 12])
			.onStart(() => {
				dragStartY.value = sheetTranslateY.value;
			})
			.onUpdate((event) => {
				applySheetDragUpdate(
					dragStartY.value,
					event.translationY,
					sheetTranslateY,
					progress,
					pushProgressOpenY ?? null,
					activeDetentIndex,
					effectiveSnapPoints,
					screenHeight,
					pushLayoutTopInset,
					getWorkletDetentFractions(layoutScalars),
					isPushLayout,
					pushDirectionJs,
				);
			})
			.onEnd((event) => {
				const result = resolveSheetPanEnd(
					sheetTranslateY.value,
					event.velocityY,
					activeDetentIndex.value,
					effectiveSnapPoints,
					screenHeight,
					pushLayoutTopInset,
					getWorkletDetentFractions(layoutScalars),
					layoutScalars.gestureDismissDragThreshold,
					layoutScalars.gestureDismissVelocityThreshold,
					layoutScalars.gestureDetentVelocityThreshold,
					options.enablePanDownToClose,
					pushDirectionJs,
				);

				if (result.kind === 'dismiss') {
					scheduleOnRN(closeSheet);
					return;
				}

				applySheetPanSnap(
					result.targetIndex,
					result.targetY,
					activeDetentIndex,
					animatedIndex,
					sheetTranslateY,
					progress,
					pushProgressOpenY ?? null,
					isPushLayout,
					layoutSpring,
				);
				scheduleOnRN(notifyIndexChange, result.targetIndex);
			});
	}, [
		activeDetentIndex,
		animatedIndex,
		closeSheet,
		dragStartY,
		effectiveSnapPoints,
		isPushLayout,
		isTopPush,
		layoutScalars,
		layoutSpring,
		notifyIndexChange,
		options.enablePanDownToClose,
		panActivationOffset,
		progress,
		pushDirectionJs,
		pushProgressOpenY,
		screenHeight,
		sheetTranslateY,
		snapPointsKey,
		pushLayoutTopInset,
	]);

	const contentPanGesture = useMemo(() => {
		return Gesture.Pan()
			.manualActivation(true)
			.onTouchesDown((event) => {
				touchStartY.value = event.allTouches[0]?.absoluteY ?? 0;
			})
			.onTouchesMove((event, state) => {
				if (scrollOffset.value > layoutScalars.scrollOffsetEpsilon) {
					state.fail();
					return;
				}

				const currentY = event.allTouches[0]?.absoluteY ?? touchStartY.value;
				const deltaY = currentY - touchStartY.value;

				if (isTopPush) {
					if (deltaY < -layoutScalars.gestureActivationOffset) {
						state.activate();
						return;
					}

					if (deltaY > layoutScalars.gestureActivationOffset) {
						state.fail();
					}
					return;
				}

				if (deltaY > layoutScalars.gestureActivationOffset) {
					state.activate();
					return;
				}

				if (deltaY < -layoutScalars.gestureActivationOffset) {
					state.fail();
				}
			})
			.onStart(() => {
				dragStartY.value = sheetTranslateY.value;
			})
			.onUpdate((event) => {
				applySheetDragUpdate(
					dragStartY.value,
					event.translationY,
					sheetTranslateY,
					progress,
					pushProgressOpenY ?? null,
					activeDetentIndex,
					effectiveSnapPoints,
					screenHeight,
					pushLayoutTopInset,
					getWorkletDetentFractions(layoutScalars),
					isPushLayout,
					pushDirectionJs,
				);
			})
			.onEnd((event) => {
				const result = resolveSheetPanEnd(
					sheetTranslateY.value,
					event.velocityY,
					activeDetentIndex.value,
					effectiveSnapPoints,
					screenHeight,
					pushLayoutTopInset,
					getWorkletDetentFractions(layoutScalars),
					layoutScalars.gestureDismissDragThreshold,
					layoutScalars.gestureDismissVelocityThreshold,
					layoutScalars.gestureDetentVelocityThreshold,
					options.enablePanDownToClose,
					pushDirectionJs,
				);

				if (result.kind === 'dismiss') {
					scheduleOnRN(closeSheet);
					return;
				}

				applySheetPanSnap(
					result.targetIndex,
					result.targetY,
					activeDetentIndex,
					animatedIndex,
					sheetTranslateY,
					progress,
					pushProgressOpenY ?? null,
					isPushLayout,
					layoutSpring,
				);
				scheduleOnRN(notifyIndexChange, result.targetIndex);
			});
	}, [
		activeDetentIndex,
		animatedIndex,
		closeSheet,
		dragStartY,
		effectiveSnapPoints,
		isPushLayout,
		isTopPush,
		layoutScalars,
		layoutSpring,
		notifyIndexChange,
		options.enablePanDownToClose,
		panActivationOffset,
		progress,
		pushDirectionJs,
		pushProgressOpenY,
		screenHeight,
		scrollOffset,
		sheetTranslateY,
		snapPointsKey,
		pushLayoutTopInset,
		touchStartY,
	]);

	const enableDynamicSizing = options.enableDynamicSizing;
	const keyboardBehavior = options.keyboardBehavior;
	const detentFractions = getWorkletDetentFractions(layoutScalars);

	const sheetStyle = useAnimatedStyle(() => {
		const keyboard = keyboardOffset.value;
		const restingTranslateY = sheetTranslateY.value;

		if (isPushLayout && pushDirectionJs === 1) {
			const detentHeight = getPushSheetHeightForDetent(
				effectiveSnapPoints[animatedIndex.value],
				screenHeight,
				pushLayoutTopInset,
				detentFractions,
			);

			if (enableDynamicSizing) {
				const maxHeight = Math.max(screenHeight - topInset - keyboard, handleHeight);
				const height = Math.min(detentHeight, maxHeight);
				return {
					height,
					transform: [{ translateY: restingTranslateY }],
				};
			}

			return {
				height: detentHeight,
				transform: [{ translateY: restingTranslateY - keyboard }],
			};
		}

		const restingHeight = screenHeight - restingTranslateY;

		if (enableDynamicSizing) {
			const maxHeight = Math.max(screenHeight - topInset - keyboard, handleHeight);
			const height = Math.min(restingHeight, maxHeight);
			const translateY = screenHeight - height - keyboard;

			return {
				height,
				transform: [{ translateY }],
			};
		}

		if (keyboardBehavior === 'extend') {
			return {
				height: restingHeight + keyboard,
				transform: [{ translateY: restingTranslateY - keyboard }],
			};
		}

		return {
			height: restingHeight,
			transform: [{ translateY: restingTranslateY - keyboard }],
		};
	});

	const onContentLayout = useCallback((height: number) => {
		setContentHeight(height);
	}, []);

	return {
		animatedIndex,
		animatedPosition: sheetTranslateY,
		scrollOffset,
		keyboardOffset,
		closeSheet,
		snapToIndex,
		expand,
		collapse,
		handlePanGesture,
		contentPanGesture,
		sheetDragGesture: contentPanGesture,
		sheetStyle,
		onContentLayout,
		enableContentPanningGesture: options.enableContentPanningGesture,
		enableDynamicSizing: options.enableDynamicSizing,
	};
}
