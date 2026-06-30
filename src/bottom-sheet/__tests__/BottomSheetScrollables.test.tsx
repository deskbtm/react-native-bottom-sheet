import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import {
	BottomSheetFlatList,
	BottomSheetScrollView,
	BottomSheetSectionList,
	BottomSheetTextInput,
	BottomSheetView,
} from '../BottomSheetScrollables';
import { getBottomSheetScrollBottomPadding } from '../constants';

import {
	createBottomSheetContentContextValue,
	renderWithBottomSheetContent,
} from './testUtils';

describe('<BottomSheetView />', () => {
	test('renders sheet content inside the provider', async () => {
		await renderWithBottomSheetContent(
			<BottomSheetView>
				<Text>Sheet body</Text>
			</BottomSheetView>,
		);

		expect(screen.getByText('Sheet body')).toBeTruthy();
	});

	test('applies bottom inset padding in fixed snap mode', async () => {
		await renderWithBottomSheetContent(
			<BottomSheetView testID="sheet-view">
				<Text>Sheet body</Text>
			</BottomSheetView>,
			{ bottomInset: 34, enableDynamicSizing: false },
		);

		const view = screen.getByTestId('sheet-view');
		const flatStyle = StyleSheet.flatten(view.props.style);

		expect(flatStyle.paddingBottom).toBe(34);
	});

	test('reports measured height when dynamic sizing is enabled', async () => {
		const onContentLayout = jest.fn();

		await renderWithBottomSheetContent(
			<BottomSheetView testID="dynamic-view">
				<Text>Dynamic sheet</Text>
			</BottomSheetView>,
			{ enableDynamicSizing: true, onContentLayout },
		);

		await fireEvent(screen.getByTestId('dynamic-view'), 'layout', {
			nativeEvent: { layout: { height: 220, width: 390, x: 0, y: 0 } },
		});

		expect(onContentLayout).toHaveBeenCalledWith(220);
	});

	test('forwards onLayout while reporting dynamic content height', async () => {
		const onLayout = jest.fn();
		const onContentLayout = jest.fn();

		await renderWithBottomSheetContent(
			<BottomSheetView testID="dynamic-view" onLayout={onLayout}>
				<Text>Dynamic sheet</Text>
			</BottomSheetView>,
			{ enableDynamicSizing: true, onContentLayout },
		);

		const event = {
			nativeEvent: { layout: { height: 180, width: 390, x: 0, y: 0 } },
		};

		await fireEvent(screen.getByTestId('dynamic-view'), 'layout', event);

		expect(onLayout).toHaveBeenCalledWith(expect.objectContaining(event));
		expect(onContentLayout).toHaveBeenCalledWith(180);
	});

	test('throws when rendered outside sheet content', async () => {
		await expect(
			render(
				<BottomSheetView>
					<Text>Outside provider</Text>
				</BottomSheetView>,
			),
		).rejects.toThrow(
			'Sheet compound components must be rendered inside BottomSheetModal or present() content.',
		);
	});

	test('wires close and expand helpers from sheet content context', async () => {
		const context = createBottomSheetContentContextValue();

		await renderWithBottomSheetContent(
			<BottomSheetView>
				<Text
					onPress={() => {
						context.close();
						context.expand();
					}}
				>
					Actions
				</Text>
			</BottomSheetView>,
			context,
		);

		await fireEvent.press(screen.getByText('Actions'));

		expect(context.close).toHaveBeenCalledTimes(1);
		expect(context.expand).toHaveBeenCalledTimes(1);
	});
});

describe('<BottomSheetScrollView />', () => {
	test('renders scrollable sheet content', async () => {
		await renderWithBottomSheetContent(
			<BottomSheetScrollView>
				<Text>Scroll row</Text>
			</BottomSheetScrollView>,
		);

		expect(screen.getByText('Scroll row')).toBeTruthy();
	});

	test('adds scroll bottom padding to contentContainerStyle', async () => {
		const bottomInset = 34;

		await renderWithBottomSheetContent(
			<BottomSheetScrollView
				testID="sheet-scroll"
				contentContainerStyle={{ paddingBottom: 8 }}
			>
				<Text>Scroll row</Text>
			</BottomSheetScrollView>,
			{ bottomInset, enableDynamicSizing: false },
		);

		const scrollView = screen.getByTestId('sheet-scroll');
		const flatStyle = StyleSheet.flatten(scrollView.props.contentContainerStyle);

		expect(flatStyle.paddingBottom).toBe(
			8 + getBottomSheetScrollBottomPadding(bottomInset),
		);
	});

	test('skips extra scroll padding when dynamic sizing is enabled', async () => {
		await renderWithBottomSheetContent(
			<BottomSheetScrollView
				testID="sheet-scroll"
				contentContainerStyle={{ paddingBottom: 12 }}
			>
				<Text>Dynamic scroll</Text>
			</BottomSheetScrollView>,
			{ enableDynamicSizing: true },
		);

		const scrollView = screen.getByTestId('sheet-scroll');
		const flatStyle = StyleSheet.flatten(scrollView.props.contentContainerStyle);

		expect(flatStyle.paddingBottom).toBe(12);
	});
});

describe('<BottomSheetFlatList />', () => {
	const data = [{ id: '1', label: 'First item' }];

	test('renders list rows inside the sheet', async () => {
		await renderWithBottomSheetContent(
			<BottomSheetFlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <Text>{item.label}</Text>}
			/>,
		);

		expect(screen.getByText('First item')).toBeTruthy();
	});
});

describe('<BottomSheetSectionList />', () => {
	test('renders section headers and rows', async () => {
		await renderWithBottomSheetContent(
			<BottomSheetSectionList
				sections={[{ title: 'Section A', data: ['Alpha'] }]}
				keyExtractor={(item) => item}
				renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
				renderItem={({ item }) => <Text>{item}</Text>}
			/>,
		);

		expect(screen.getByText('Section A')).toBeTruthy();
		expect(screen.getByText('Alpha')).toBeTruthy();
	});
});

describe('<BottomSheetTextInput />', () => {
	test('renders a text field for sheet keyboard handling', async () => {
		await renderWithBottomSheetContent(
			<BottomSheetTextInput
				testID="sheet-input"
				placeholder="Type here"
				accessibilityLabel="Sheet input"
			/>,
		);

		expect(screen.getByLabelText('Sheet input')).toBeTruthy();
		expect(screen.getByPlaceholderText('Type here')).toBeTruthy();
	});
});
