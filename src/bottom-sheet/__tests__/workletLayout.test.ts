import { DEFAULT_LAYOUT_OPTIONS } from '../mergeLayoutOptions';
import { getWorkletDetentFractions, pickWorkletLayoutScalars } from '../workletLayout';

function isPrimitive(value: unknown): boolean {
	return (
		value === null ||
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		typeof value === 'string'
	);
}

describe('workletLayout', () => {
	test('pickWorkletLayoutScalars returns primitives only', () => {
		const scalars = pickWorkletLayoutScalars(DEFAULT_LAYOUT_OPTIONS);

		for (const value of Object.values(scalars)) {
			expect(isPrimitive(value)).toBe(true);
		}
	});

	test('pickWorkletLayoutScalars mirrors DEFAULT_LAYOUT_OPTIONS values', () => {
		const scalars = pickWorkletLayoutScalars(DEFAULT_LAYOUT_OPTIONS);
		const { presentation, push, stack, gestures, scroll, handle, detents } =
			DEFAULT_LAYOUT_OPTIONS;

		expect(scalars.presentationHostScale).toBe(presentation.hostScale);
		expect(scalars.presentationCornerRadius).toBe(presentation.cornerRadius);
		expect(scalars.presentationHostTopInsetMin).toBe(presentation.hostTopInsetMin);
		expect(scalars.pushHostHorizontalInset).toBe(push.hostHorizontalInset);
		expect(scalars.pushDirectionJs).toBe(0);
		expect(scalars.stackScalePerLevel).toBe(stack.scalePerLevel);
		expect(scalars.stackHorizontalInsetPerLevel).toBe(stack.horizontalInsetPerLevel);
		expect(scalars.stackOffsetYPerLevel).toBe(stack.offsetYPerLevel);
		expect(scalars.stackRadiusBonusPerLevel).toBe(stack.radiusBonusPerLevel);
		expect(scalars.gestureDismissDragThreshold).toBe(gestures.dismissDragThreshold);
		expect(scalars.gestureDismissVelocityThreshold).toBe(
			gestures.dismissVelocityThreshold,
		);
		expect(scalars.gestureDetentVelocityThreshold).toBe(gestures.detentVelocityThreshold);
		expect(scalars.gestureActivationOffset).toBe(gestures.activationOffset);
		expect(scalars.scrollEndExtra).toBe(scroll.endExtra);
		expect(scalars.scrollOffsetEpsilon).toBe(scroll.offsetEpsilon);
		expect(scalars.handleHeight).toBe(handle.height);
		expect(scalars.handleHiddenHeight).toBe(handle.hiddenHeight);
		expect(scalars.detentMedium).toBe(detents.medium);
		expect(scalars.detentLarge).toBe(detents.large);
		expect(scalars.detentFull).toBe(detents.full);
	});

	test('getWorkletDetentFractions rebuilds detent fractions from scalars', () => {
		const scalars = pickWorkletLayoutScalars(DEFAULT_LAYOUT_OPTIONS);
		const fractions = getWorkletDetentFractions(scalars);

		expect(fractions).toEqual(DEFAULT_LAYOUT_OPTIONS.detents);
	});
});
