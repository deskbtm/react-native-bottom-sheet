import fs from 'node:fs';
import path from 'node:path';

const PERFORMANCE_TRACK_TESTS = [
	'BottomSheetProvider.test.tsx',
	'gestureFluency.test.ts',
	'sheetScrollFluency.test.ts',
	'sheetStackFluency.test.ts',
] as const;

describe('performance track regression suites', () => {
	test.each(PERFORMANCE_TRACK_TESTS)('includes %s', (filename) => {
		const filePath = path.join(__dirname, filename);
		expect(fs.existsSync(filePath)).toBe(true);
	});
});
