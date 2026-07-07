import { defineConfig } from 'oxlint';

export default defineConfig({
	plugins: ['typescript', 'unicorn', 'oxc'],
	categories: {
		correctness: 'error',
	},
	rules: {
		'unicorn/no-static-only-class': 'off',
	},
	env: {
		builtin: true,
	},
	ignorePatterns: [
		'**/node_modules/**',
		'**/dist/**',
		'**/out/**',
		'**/coverage/**',
		'**/build/**',
		'**/.agents/**',
		'**/.claude/**',
	],
	options: {
		typeAware: true,
	},
});
