const { defineConfig } = require('eslint/config');
const universe = require('eslint-config-universe/flat/native');
const universeWeb = require('eslint-config-universe/flat/web');

module.exports = defineConfig([
	{ ignores: ['build'] },
	...universe,
	...universeWeb,
	{
		files: ['**/__tests__/**/*.{ts,tsx}'],
		rules: {
			'react-hooks/immutability': 'off',
			'react-hooks/refs': 'off',
		},
	},
	{
		files: [
			'src/bottom-sheet/BottomSheetScrollables.tsx',
			'src/bottom-sheet/useBottomSheetController.ts',
			'src/bottom-sheet/useBottomSheetEngine.ts',
		],
		rules: {
			// Reanimated SharedValues and worklets intentionally mutate .value on the UI thread.
			'react-hooks/immutability': 'off',
		},
	},
]);
