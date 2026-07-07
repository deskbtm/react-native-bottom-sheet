import fs from 'node:fs';
import path from 'node:path';

function extractBalancedBlock(source: string, openBraceIndex: number): string {
	let depth = 0;

	for (let index = openBraceIndex; index < source.length; index += 1) {
		const char = source[index];

		if (char === '{') {
			depth += 1;
		} else if (char === '}') {
			depth -= 1;

			if (depth === 0) {
				return source.slice(openBraceIndex + 1, index);
			}
		}
	}

	throw new Error(`Unbalanced braces at index ${openBraceIndex}`);
}

/** Extract arrow-function bodies for Gesture handler methods such as onUpdate / onEnd. */
export function extractGestureHandlerBodies(
	source: string,
	method: 'onUpdate' | 'onEnd' | 'onStart' | 'onTouchesMove',
): string[] {
	const bodies: string[] = [];
	const pattern = new RegExp(String.raw`\.${method}\(\([^)]*\)\s*=>\s*\{`, 'g');

	for (const match of source.matchAll(pattern)) {
		const openBraceIndex = match.index + match[0].length - 1;
		bodies.push(extractBalancedBlock(source, openBraceIndex));
	}

	return bodies;
}

export function extractUseAnimatedStyleBody(source: string): string {
	const bodies = extractAllUseAnimatedStyleBodies(source);

	if (bodies.length === 0) {
		throw new Error('useAnimatedStyle callback not found');
	}

	return bodies[0];
}

export function extractAllUseAnimatedStyleBodies(source: string): string[] {
	const bodies: string[] = [];
	const blockMarker = 'useAnimatedStyle(() => {';
	let searchFrom = 0;

	while (searchFrom < source.length) {
		const start = source.indexOf(blockMarker, searchFrom);

		if (start === -1) {
			break;
		}

		const openBraceIndex = start + blockMarker.length - 1;
		bodies.push(extractBalancedBlock(source, openBraceIndex));
		searchFrom = openBraceIndex + 1;
	}

	const expressionMarker = 'useAnimatedStyle(() =>';
	searchFrom = 0;

	while (searchFrom < source.length) {
		const start = source.indexOf(expressionMarker, searchFrom);

		if (start === -1) {
			break;
		}

		const afterArrow = start + expressionMarker.length;
		const nextChar = source.slice(afterArrow).trimStart()[0];

		if (nextChar === '{') {
			searchFrom = afterArrow + 1;
			continue;
		}

		const openIndex = source.indexOf('(', afterArrow);

		if (openIndex === -1) {
			break;
		}

		bodies.push(extractBalancedBlock(source, openIndex));
		searchFrom = openIndex + 1;
	}

	return bodies;
}

export function extractAnimatedScrollHandlerBody(source: string): string {
	const marker = 'useAnimatedScrollHandler({';
	const start = source.indexOf(marker);

	if (start === -1) {
		throw new Error('useAnimatedScrollHandler block not found');
	}

	const onScrollMarker = 'onScroll:';
	const onScrollStart = source.indexOf(onScrollMarker, start);

	if (onScrollStart === -1) {
		throw new Error('useAnimatedScrollHandler onScroll not found');
	}

	const arrowStart = source.indexOf('=>', onScrollStart);

	if (arrowStart === -1) {
		throw new Error('useAnimatedScrollHandler onScroll arrow not found');
	}

	const openBraceIndex = source.indexOf('{', arrowStart);

	if (openBraceIndex === -1) {
		throw new Error('useAnimatedScrollHandler onScroll body not found');
	}

	return extractBalancedBlock(source, openBraceIndex);
}

export function extractUseMemoBlock(source: string, constName: string): string {
	const marker = `const ${constName} = useMemo(() => {`;
	const start = source.indexOf(marker);

	if (start === -1) {
		throw new Error(`${constName} useMemo block not found`);
	}

	const openBraceIndex = start + marker.length - 1;
	return extractBalancedBlock(source, openBraceIndex);
}

export function readModuleSource(modulePathFromSrc: string): string {
	const filePath = path.join(__dirname, '..', modulePathFromSrc);
	return fs.readFileSync(filePath, 'utf8');
}

export function findForbiddenTokens(
	body: string,
	forbidden: readonly string[],
): string[] {
	return forbidden.filter((token) => body.includes(token));
}
