import { pushDirectionToJs, type PushDirectionJs } from './pushDirection';
import type { BottomSheetLayoutDetentsOptions, BottomSheetLayoutOptions } from './types';

/** Flat primitive layout values safe to capture in Reanimated worklet closures. */
export interface WorkletLayoutScalars {
	presentationHostScale: number;
	presentationCornerRadius: number;
	presentationHostTopInsetMin: number;
	pushHostHorizontalInset: number;
	pushDirectionJs: PushDirectionJs;
	stackScalePerLevel: number;
	stackHorizontalInsetPerLevel: number;
	stackOffsetYPerLevel: number;
	stackRadiusBonusPerLevel: number;
	gestureDismissDragThreshold: number;
	gestureDismissVelocityThreshold: number;
	gestureDetentVelocityThreshold: number;
	gestureActivationOffset: number;
	scrollEndExtra: number;
	scrollOffsetEpsilon: number;
	handleHeight: number;
	handleHiddenHeight: number;
	detentMedium: number;
	detentLarge: number;
	detentFull: number;
}

export function pickWorkletLayoutScalars(
	layout: BottomSheetLayoutOptions,
): WorkletLayoutScalars {
	const { presentation, push, stack, gestures, scroll, handle, detents } = layout;

	return {
		presentationHostScale: presentation.hostScale,
		presentationCornerRadius: presentation.cornerRadius,
		presentationHostTopInsetMin: presentation.hostTopInsetMin,
		pushHostHorizontalInset: push.hostHorizontalInset,
		pushDirectionJs: pushDirectionToJs(push.direction),
		stackScalePerLevel: stack.scalePerLevel,
		stackHorizontalInsetPerLevel: stack.horizontalInsetPerLevel,
		stackOffsetYPerLevel: stack.offsetYPerLevel,
		stackRadiusBonusPerLevel: stack.radiusBonusPerLevel,
		gestureDismissDragThreshold: gestures.dismissDragThreshold,
		gestureDismissVelocityThreshold: gestures.dismissVelocityThreshold,
		gestureDetentVelocityThreshold: gestures.detentVelocityThreshold,
		gestureActivationOffset: gestures.activationOffset,
		scrollEndExtra: scroll.endExtra,
		scrollOffsetEpsilon: scroll.offsetEpsilon,
		handleHeight: handle.height,
		handleHiddenHeight: handle.hiddenHeight,
		detentMedium: detents.medium,
		detentLarge: detents.large,
		detentFull: detents.full,
	};
}

export function getWorkletDetentFractions(
	scalars: WorkletLayoutScalars,
): BottomSheetLayoutDetentsOptions {
	'worklet';
	return {
		medium: scalars.detentMedium,
		large: scalars.detentLarge,
		full: scalars.detentFull,
	};
}
