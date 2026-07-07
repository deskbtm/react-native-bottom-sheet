import { act, cleanup, render, waitFor } from '@testing-library/react-native';
import { type MutableRefObject } from 'react';
import { Text } from 'react-native';

import { useBottomSheet } from '../BottomSheetContext';
import { BottomSheetProvider } from '../BottomSheetProvider';
import type { BottomSheetContextValue } from '../types';

jest.mock('react-native-safe-area-context', () => ({
	useSafeAreaInsets: () => ({ top: 47, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('react-native-keyboard-controller', () => ({
	useAnimatedKeyboard: () => ({
		height: { value: 0 },
	}),
}));

const mockUseWindowDimensions = jest.spyOn(
	require('react-native'),
	'useWindowDimensions',
);

const SCREEN = { width: 390, height: 844, scale: 2, fontScale: 2 };

function createRenderCounter() {
	const countRef: MutableRefObject<number> = { current: 0 };

	function ProtectedHostProbe() {
		countRef.current += 1;
		return <Text testID="protected-host">host</Text>;
	}

	return { countRef, ProtectedHostProbe };
}

function SheetDriver({
	driverRef,
}: {
	driverRef: MutableRefObject<BottomSheetContextValue | null>;
}) {
	const sheet = useBottomSheet();
	driverRef.current = sheet;
	return null;
}

function SubscriberProbe({ countRef }: { countRef: MutableRefObject<number> }) {
	countRef.current += 1;
	useBottomSheet();
	return null;
}

interface HostHarnessOptions {
	mode?: 'presentation' | 'push' | 'modal';
	theme?: { hostBackgroundColor?: string };
	withSubscriber?: boolean;
}

async function renderHostHarness(options: HostHarnessOptions = {}) {
	const { countRef, ProtectedHostProbe } = createRenderCounter();
	const driverRef: MutableRefObject<BottomSheetContextValue | null> = { current: null };
	const subscriberCountRef: MutableRefObject<number> = { current: 0 };

	const view = await render(
		<BottomSheetProvider mode={options.mode ?? 'presentation'} theme={options.theme}>
			<ProtectedHostProbe />
			<SheetDriver driverRef={driverRef} />
			{options.withSubscriber ? <SubscriberProbe countRef={subscriberCountRef} /> : null}
		</BottomSheetProvider>,
	);

	const mountCount = countRef.current;

	return {
		...view,
		countRef,
		driverRef,
		subscriberCountRef,
		mountCount,
	};
}

describe('BottomSheetProvider render isolation', () => {
	beforeEach(() => {
		mockUseWindowDimensions.mockReturnValue(SCREEN);
	});

	afterEach(async () => {
		await cleanup();
	});

	test('present does not re-render protected host content', async () => {
		const { countRef, driverRef, mountCount } = await renderHostHarness();

		await act(async () => {
			driverRef.current!.present(<Text testID="sheet-body">Sheet</Text>, {
				snapPoints: ['50%'],
			});
		});

		expect(countRef.current).toBe(mountCount);
		expect(driverRef.current?.isPresented).toBe(true);
	});

	test('dismiss does not re-render protected host content', async () => {
		const { countRef, driverRef, mountCount } = await renderHostHarness();

		await act(async () => {
			driverRef.current!.present(<Text>Sheet</Text>, { snapPoints: ['50%'] });
		});

		await act(async () => {
			driverRef.current!.dismiss();
		});

		await waitFor(() => {
			expect(driverRef.current?.isPresented).toBe(false);
		});

		expect(countRef.current).toBe(mountCount);
	});

	test('stacking sheets and dismissAll do not re-render protected host content', async () => {
		const { countRef, driverRef, mountCount } = await renderHostHarness();

		await act(async () => {
			driverRef.current!.present(<Text>Bottom</Text>, { snapPoints: ['40%'] });
			driverRef.current!.present(<Text>Top</Text>, { snapPoints: ['50%'] });
		});

		expect(driverRef.current?.presentedSheetCount).toBe(2);
		expect(countRef.current).toBe(mountCount);

		await act(async () => {
			driverRef.current!.dismissAll();
		});

		await waitFor(() => {
			expect(driverRef.current?.isPresented).toBe(false);
		});

		expect(countRef.current).toBe(mountCount);
	});

	test('stacking three sheets does not re-render protected host content', async () => {
		const { countRef, driverRef, mountCount } = await renderHostHarness();

		await act(async () => {
			driverRef.current!.present(<Text>First</Text>, { snapPoints: ['30%'] });
			driverRef.current!.present(<Text>Second</Text>, { snapPoints: ['40%'] });
			driverRef.current!.present(<Text>Third</Text>, { snapPoints: ['50%'] });
		});

		expect(driverRef.current?.presentedSheetCount).toBe(3);
		expect(countRef.current).toBe(mountCount);
	});

	test.each([
		['presentation', { mode: 'presentation' as const }],
		['push', { mode: 'push' as const }],
		['modal', { mode: 'modal' as const }],
	])(
		'present in %s mode does not re-render protected host content',
		async (_label, options) => {
			const { countRef, driverRef, mountCount } = await renderHostHarness();

			await act(async () => {
				driverRef.current!.present(<Text>Sheet</Text>, {
					...options,
					snapPoints: ['50%'],
				});
			});

			expect(countRef.current).toBe(mountCount);
		},
	);

	test('provider push mode does not re-render protected host content on present', async () => {
		const { countRef, driverRef, mountCount } = await renderHostHarness({ mode: 'push' });

		await act(async () => {
			driverRef.current!.present(<Text>Sheet</Text>, { snapPoints: ['50%'] });
		});

		expect(countRef.current).toBe(mountCount);
	});

	test('screen dimension change re-renders protected host content', async () => {
		const { countRef, ProtectedHostProbe } = createRenderCounter();

		const { rerender } = await render(
			<BottomSheetProvider mode="presentation">
				<ProtectedHostProbe />
			</BottomSheetProvider>,
		);
		const mountCount = countRef.current;

		mockUseWindowDimensions.mockReturnValue({
			...SCREEN,
			width: 400,
			height: 860,
		});

		await act(async () => {
			await rerender(
				<BottomSheetProvider mode="presentation">
					<ProtectedHostProbe />
				</BottomSheetProvider>,
			);
		});

		expect(countRef.current).toBeGreaterThan(mountCount);
	});

	test('theme change re-renders protected host content', async () => {
		const { countRef, ProtectedHostProbe } = createRenderCounter();

		const { rerender } = await render(
			<BottomSheetProvider mode="presentation" theme={{ hostBackgroundColor: '#ffffff' }}>
				<ProtectedHostProbe />
			</BottomSheetProvider>,
		);
		const mountCount = countRef.current;

		await act(async () => {
			await rerender(
				<BottomSheetProvider
					mode="presentation"
					theme={{ hostBackgroundColor: '#000000' }}
				>
					<ProtectedHostProbe />
				</BottomSheetProvider>,
			);
		});

		expect(countRef.current).toBeGreaterThan(mountCount);
	});

	test('useBottomSheet subscribers re-render when sheet lifecycle changes', async () => {
		const { driverRef, subscriberCountRef } = await renderHostHarness({
			withSubscriber: true,
		});

		const subscriberMountCount = subscriberCountRef.current;

		await act(async () => {
			driverRef.current!.present(<Text>Sheet</Text>, { snapPoints: ['50%'] });
		});

		expect(subscriberCountRef.current).toBeGreaterThan(subscriberMountCount);
		const afterPresentCount = subscriberCountRef.current;

		await act(async () => {
			driverRef.current!.dismiss();
		});

		await waitFor(() => {
			expect(driverRef.current?.isPresented).toBe(false);
		});

		expect(subscriberCountRef.current).toBeGreaterThan(afterPresentCount);
	});
});
