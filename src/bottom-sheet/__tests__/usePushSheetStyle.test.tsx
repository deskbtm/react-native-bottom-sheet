import { render } from '@testing-library/react-native';

import {
	BOTTOM_SHEET_CORNER_RADIUS,
	PUSH_HOST_HORIZONTAL_INSET,
} from '../constants';
import { mergeLayoutOptions } from '../mergeLayoutOptions';
import {
	usePushSheetCardStyle,
	usePushSheetScaleStyle,
} from '../usePushSheetStyle';

import { createSharedValue } from './testUtils';

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const OPEN_Y = 422;

type PushSheetScaleStyle = ReturnType<typeof usePushSheetScaleStyle>;
type PushSheetCardStyle = ReturnType<typeof usePushSheetCardStyle>;

describe('usePushSheetScaleStyle', () => {
	function ScaleStyleProbe({
		enabled,
		styleRef,
		sheetTopY = OPEN_Y,
	}: {
		enabled: boolean;
		styleRef: { current: PushSheetScaleStyle | null };
		sheetTopY?: number;
	}) {
		const sheetTop = createSharedValue(sheetTopY);
		const pushProgressOpenY = createSharedValue(OPEN_Y);
		styleRef.current = usePushSheetScaleStyle(
			sheetTop,
			pushProgressOpenY,
			SCREEN_HEIGHT,
			SCREEN_WIDTH,
			enabled,
		);

		return null;
	}

	test('returns an empty style object when push layout is disabled', async () => {
		const styleRef: { current: PushSheetScaleStyle | null } = { current: null };

		await render(<ScaleStyleProbe enabled={false} styleRef={styleRef} />);

		expect(styleRef.current).toEqual({});
	});

	test('applies horizontal scale at full push progress', async () => {
		const styleRef: { current: PushSheetScaleStyle | null } = { current: null };

		await render(<ScaleStyleProbe enabled styleRef={styleRef} />);

		const expectedScale = (SCREEN_WIDTH - PUSH_HOST_HORIZONTAL_INSET * 2) / SCREEN_WIDTH;

		expect(styleRef.current).toMatchObject({
			width: SCREEN_WIDTH,
			flex: 1,
			alignSelf: 'center',
			transform: [{ scaleX: expectedScale }],
		});
	});

	test('keeps scale at 1 when sheet is dismissed', async () => {
		const styleRef: { current: PushSheetScaleStyle | null } = { current: null };

		await render(
			<ScaleStyleProbe enabled styleRef={styleRef} sheetTopY={SCREEN_HEIGHT} />,
		);

		expect(styleRef.current).toMatchObject({
			transform: [{ scaleX: 1 }],
		});
	});
});

describe('usePushSheetCardStyle', () => {
	function CardStyleProbe({
		enabled,
		styleRef,
		sheetTopY = OPEN_Y,
	}: {
		enabled: boolean;
		styleRef: { current: PushSheetCardStyle | null };
		sheetTopY?: number;
	}) {
		const sheetTop = createSharedValue(sheetTopY);
		const pushProgressOpenY = createSharedValue(OPEN_Y);
		styleRef.current = usePushSheetCardStyle(
			sheetTop,
			pushProgressOpenY,
			SCREEN_HEIGHT,
			enabled,
		);

		return null;
	}

	test('returns an empty style object when push layout is disabled', async () => {
		const styleRef: { current: PushSheetCardStyle | null } = { current: null };

		await render(<CardStyleProbe enabled={false} styleRef={styleRef} />);

		expect(styleRef.current).toEqual({});
	});

	test('applies top corner radius at full push progress', async () => {
		const styleRef: { current: PushSheetCardStyle | null } = { current: null };

		await render(<CardStyleProbe enabled styleRef={styleRef} />);

		expect(styleRef.current).toMatchObject({
			flex: 1,
			borderTopLeftRadius: BOTTOM_SHEET_CORNER_RADIUS,
			borderTopRightRadius: BOTTOM_SHEET_CORNER_RADIUS,
			overflow: 'hidden',
		});
	});

	test('uses layout.presentation.cornerRadius when provided', async () => {
		const styleRef: { current: PushSheetCardStyle | null } = { current: null };
		const layout = mergeLayoutOptions({ presentation: { cornerRadius: 32 } });

		function CustomLayoutProbe() {
			const sheetTop = createSharedValue(OPEN_Y);
			const pushProgressOpenY = createSharedValue(OPEN_Y);
			styleRef.current = usePushSheetCardStyle(
				sheetTop,
				pushProgressOpenY,
				SCREEN_HEIGHT,
				true,
				layout,
			);
			return null;
		}

		await render(<CustomLayoutProbe />);

		expect(styleRef.current).toMatchObject({
			borderTopLeftRadius: 32,
			borderTopRightRadius: 32,
		});
	});
});
