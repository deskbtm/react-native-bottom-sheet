import { DEFAULT_ACCESSIBILITY_LABEL, DEFAULT_THEME } from './constants';
import { clampIndex, findDetentIndex } from './detents';
import type {
	BottomSheetDetent,
	BottomSheetMode,
	BottomSheetOptions,
	BottomSheetTheme,
	ResolvedBottomSheetOptions,
} from './types';

function mergeTheme(
	...themes: (BottomSheetTheme | undefined)[]
): Required<BottomSheetTheme> {
	return themes.reduce<Required<BottomSheetTheme>>(
		(acc, theme) => ({ ...acc, ...theme }),
		{
			...DEFAULT_THEME,
		},
	);
}

export function resolveBottomSheetOptions(
	options: BottomSheetOptions | undefined,
	providerDefaults?: BottomSheetOptions,
	providerTheme?: BottomSheetTheme,
	hostMode: BottomSheetMode = 'presentation',
): ResolvedBottomSheetOptions {
	const merged = {
		...providerDefaults,
		...options,
		theme: mergeTheme(providerTheme, providerDefaults?.theme, options?.theme),
	};

	const snapPoints: BottomSheetDetent[] = merged.enableDynamicSizing
		? (merged.snapPoints ?? [])
		: (merged.snapPoints ?? ['medium', 'large']);

	const resolvedSnapPoints: BottomSheetDetent[] =
		snapPoints.length > 0 ? snapPoints : merged.enableDynamicSizing ? [] : ['medium'];

	const index =
		merged.index ??
		(resolvedSnapPoints.length > 0
			? findDetentIndex(resolvedSnapPoints, resolvedSnapPoints[0] ?? 'medium')
			: 0);

	return {
		mode: merged.mode ?? providerDefaults?.mode ?? hostMode,
		snapPoints: resolvedSnapPoints,
		index:
			resolvedSnapPoints.length > 0 ? clampIndex(index, resolvedSnapPoints.length) : 0,
		enableDynamicSizing: merged.enableDynamicSizing ?? false,
		enablePanDownToClose: merged.enablePanDownToClose ?? true,
		dismissOnScrimPress: merged.dismissOnScrimPress ?? true,
		scrimColor: merged.scrimColor ?? merged.theme.scrimColor,
		enableContentPanningGesture: merged.enableContentPanningGesture ?? false,
		keyboardBehavior: merged.keyboardBehavior ?? 'interactive',
		keyboardBlurBehavior: merged.keyboardBlurBehavior ?? 'restore',
		showHandle: merged.showHandle ?? true,
		onDismiss: merged.onDismiss,
		onChange: merged.onChange,
		onAnimate: merged.onAnimate,
		theme: merged.theme,
		sheetStyle: merged.sheetStyle,
		accessibilityLabel: merged.accessibilityLabel ?? DEFAULT_ACCESSIBILITY_LABEL,
	};
}
