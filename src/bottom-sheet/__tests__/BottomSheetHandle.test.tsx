import { render, screen } from '@testing-library/react-native';

import { BottomSheetHandle } from '../BottomSheetHandle';

describe('<BottomSheetHandle />', () => {
	test('renders the drag handle with the given color', async () => {
		await render(<BottomSheetHandle color="#D1D1D6" />);

		expect(screen.root).toBeTruthy();
		expect(screen.toJSON()).toEqual(
			expect.objectContaining({
				type: 'View',
				children: [
					expect.objectContaining({
						type: 'View',
						props: expect.objectContaining({
							style: expect.arrayContaining([
								expect.objectContaining({
									backgroundColor: '#D1D1D6',
								}),
							]),
						}),
					}),
				],
			}),
		);
	});
});
