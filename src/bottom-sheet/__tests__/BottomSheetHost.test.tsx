import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { BottomSheetHost } from '../BottomSheetHost';
import { getPresentationHostTopInset } from '../constants';
import { HOST_LAYOUT_MODE, type HostLayoutMode } from '../hostLayoutMode';
import { mergeLayoutOptions } from '../mergeLayoutOptions';

import { createSharedValue } from './testUtils';

const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;
const OPEN_Y = 422;

describe('<BottomSheetHost />', () => {
	test('uses layout.presentation values at full presentation progress', async () => {
		const layout = mergeLayoutOptions({
			presentation: { hostScale: 0.85, cornerRadius: 32, hostTopInsetMin: 40 },
		});

		await render(
			<BottomSheetHost
				testID="bottom-sheet-host"
				hostLayoutMode={createSharedValue<HostLayoutMode>(HOST_LAYOUT_MODE.presentation)}
				progress={createSharedValue(1)}
				sheetTopY={createSharedValue(OPEN_Y)}
				pushProgressOpenY={createSharedValue(OPEN_Y)}
				pushSheetHeight={createSharedValue(200)}
				topInset={0}
				screenHeight={SCREEN_HEIGHT}
				screenWidth={SCREEN_WIDTH}
				layout={layout}
			>
				<Text>Host</Text>
			</BottomSheetHost>,
		);

		const host = screen.getByTestId('bottom-sheet-host');
		const animatedStyle = Array.isArray(host.props.style)
			? host.props.style.find(
					(entry: object) =>
						entry != null && typeof entry === 'object' && 'borderRadius' in entry,
				)
			: host.props.style;

		expect(animatedStyle).toMatchObject({
			borderRadius: 32,
			borderTopLeftRadius: 32,
			borderTopRightRadius: 32,
			borderBottomLeftRadius: 32,
			borderBottomRightRadius: 32,
			transform: [
				{ scale: 0.85 },
				{
					translateY: getPresentationHostTopInset(SCREEN_WIDTH, 0.85, 40),
				},
			],
		});
	});

	test('presentation host radius wins when push shared values are still wired', async () => {
		const layout = mergeLayoutOptions({
			presentation: { cornerRadius: 32 },
		});

		await render(
			<BottomSheetHost
				testID="bottom-sheet-host"
				hostLayoutMode={createSharedValue<HostLayoutMode>(HOST_LAYOUT_MODE.presentation)}
				progress={createSharedValue(1)}
				sheetTopY={createSharedValue(0)}
				pushProgressOpenY={createSharedValue(0)}
				pushSheetHeight={createSharedValue(300)}
				topInset={0}
				screenHeight={SCREEN_HEIGHT}
				screenWidth={SCREEN_WIDTH}
				layout={layout}
			>
				<Text>Host</Text>
			</BottomSheetHost>,
		);

		const host = screen.getByTestId('bottom-sheet-host');
		const animatedStyle = Array.isArray(host.props.style)
			? host.props.style.find(
					(entry: object) =>
						entry != null && typeof entry === 'object' && 'borderRadius' in entry,
				)
			: host.props.style;

		expect(animatedStyle).toMatchObject({
			borderRadius: 32,
			borderBottomLeftRadius: 32,
			borderTopLeftRadius: 32,
		});
	});
});
