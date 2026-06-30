import { render } from '@testing-library/react-native';

import {
	BOTTOM_SHEET_CORNER_RADIUS,
	STACK_CARD_OFFSET_Y_PER_LEVEL,
	STACK_CARD_RADIUS_BONUS_PER_LEVEL,
	STACK_CARD_SCALE_PER_LEVEL,
	STACK_HORIZONTAL_INSET_PER_LEVEL,
} from '../constants';
import { useStackCardStyle } from '../useStackCardStyle';

import { createSharedValue } from './testUtils';

const SCREEN_HEIGHT = 844;
const OPEN_Y = 422;

type StackCardStyle = ReturnType<typeof useStackCardStyle>;

describe('useStackCardStyle', () => {
	function StackStyleProbe({
		depthFromTop,
		enabled = true,
		styleRef,
		sheetTopY = OPEN_Y,
	}: {
		depthFromTop: number;
		enabled?: boolean;
		styleRef: { current: StackCardStyle | null };
		sheetTopY?: number;
	}) {
		const sheetTop = createSharedValue(sheetTopY);
		styleRef.current = useStackCardStyle(depthFromTop, sheetTop, SCREEN_HEIGHT, enabled);

		return null;
	}

	test('keeps the top card full width with base corner radius', async () => {
		const styleRef: { current: StackCardStyle | null } = { current: null };

		await render(<StackStyleProbe depthFromTop={0} styleRef={styleRef} />);

		expect(styleRef.current).toMatchObject({
			marginHorizontal: 0,
			borderTopLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
			borderTopRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
			transform: [{ translateY: 0 }, { scale: 1 }],
		});
	});

	test('insets and scales buried cards from the bottom edge', async () => {
		const styleRef: { current: StackCardStyle | null } = { current: null };
		const depth = 1;
		const scale = STACK_CARD_SCALE_PER_LEVEL ** depth;
		const sheetHeight = SCREEN_HEIGHT - OPEN_Y;
		const bottomAnchorY = (sheetHeight * (1 - scale)) / 2;
		const peekY = STACK_CARD_OFFSET_Y_PER_LEVEL * depth;

		await render(<StackStyleProbe depthFromTop={depth} styleRef={styleRef} />);

		expect(styleRef.current).toMatchObject({
			marginHorizontal: STACK_HORIZONTAL_INSET_PER_LEVEL * depth,
			borderTopLeftRadius:
				BOTTOM_SHEET_CORNER_RADIUS + depth * STACK_CARD_RADIUS_BONUS_PER_LEVEL,
			borderTopRightRadius:
				BOTTOM_SHEET_CORNER_RADIUS + depth * STACK_CARD_RADIUS_BONUS_PER_LEVEL,
			transform: [{ translateY: bottomAnchorY + peekY }, { scale }],
		});
	});

	test('returns neutral styling when stack styling is disabled', async () => {
		const styleRef: { current: StackCardStyle | null } = { current: null };

		await render(
			<StackStyleProbe depthFromTop={2} enabled={false} styleRef={styleRef} />,
		);

		expect(styleRef.current).toMatchObject({
			marginHorizontal: 0,
			borderTopLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
			borderTopRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
			transform: [{ translateY: 0 }, { scale: 1 }],
		});
	});
});
