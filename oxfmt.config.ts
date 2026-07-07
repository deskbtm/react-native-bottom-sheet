import { defineConfig } from 'oxfmt';

export default defineConfig({
	printWidth: 90,
	useTabs: true,
	singleQuote: true,
	ignorePatterns: [
		'**/node_modules/**',
		'**/dist/**',
		'**/out/**',
		'**/coverage/**',
		'**/build/**',
		'**/.agents/**',
		'**/.claude/**',
	],
});
