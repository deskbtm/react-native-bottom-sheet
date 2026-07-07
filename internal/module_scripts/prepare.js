#!/usr/bin/env node
const { spawnSyncWithAutoShell } = require('./util');
const fs = require('fs');
const path = require('path');

const SUBTARGETS = ['plugin', 'cli', 'utils', 'scripts'];
const BUILD_ENTRY = path.join(process.cwd(), 'build', 'index.js');

function resolveLocalTsc() {
	try {
		return {
			command: process.execPath,
			argsPrefix: [require.resolve('typescript/bin/tsc')],
		};
	} catch {
		// fall through
	}

	const binName = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
	const localBin = path.join(process.cwd(), 'node_modules', '.bin', binName);
	if (fs.existsSync(localBin)) {
		return { command: localBin, argsPrefix: [] };
	}

	return null;
}

function runTsc(args = []) {
	const tsc = resolveLocalTsc();
	if (!tsc) {
		console.error(
			'[@deskbtm/react-native-bottom-sheet] TypeScript is required to compile from source.',
		);
		console.error('Install from npm: npm install @deskbtm/react-native-bottom-sheet');
		console.error('When using a git URL, install with devDependencies enabled.');
		process.exit(1);
	}

	const result = spawnSyncWithAutoShell(tsc.command, [...tsc.argsPrefix, ...args], {
		stdio: 'inherit',
	});

	if (result.status !== 0) {
		process.exit(result.status ?? 1);
	}
}

function buildMain(force = false) {
	if (!force && fs.existsSync(BUILD_ENTRY)) {
		return;
	}

	fs.rmSync(path.join(process.cwd(), 'build'), { recursive: true, force: true });
	runTsc();
}

function buildSubtargets() {
	for (const target of SUBTARGETS) {
		const targetDir = path.join(process.cwd(), target);
		if (
			fs.existsSync(targetDir) &&
			fs.existsSync(path.join(targetDir, 'tsconfig.json'))
		) {
			console.log(`Building ${target}`);
			fs.rmSync(path.join(targetDir, 'build'), { recursive: true, force: true });
			runTsc(['--build', targetDir]);
		}
	}
}

const force = process.env.FORCE_PREPARE_BUILD === '1' || process.argv.includes('--force');
buildMain(force);
buildSubtargets();
