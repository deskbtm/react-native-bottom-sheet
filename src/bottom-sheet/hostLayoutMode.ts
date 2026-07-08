import type { PushDirectionJs } from './pushDirection';
import type { BottomSheetMode, PushDirection } from './types';

/** Numeric host layout modes for Reanimated worklets (no string compare on UI thread). */
export const HOST_LAYOUT_MODE = {
	modal: 0,
	presentation: 1,
	pushBottom: 2,
	pushTop: 3,
} as const;

export type HostLayoutMode = (typeof HOST_LAYOUT_MODE)[keyof typeof HOST_LAYOUT_MODE];

/** @deprecated Use {@link resolveHostLayoutMode} for push sheets. */
export const HOST_LAYOUT_MODE_PUSH = HOST_LAYOUT_MODE.pushBottom;

export function bottomSheetModeToLayoutJs(mode: BottomSheetMode): HostLayoutMode {
	if (mode === 'push') {
		return HOST_LAYOUT_MODE.pushBottom;
	}
	return HOST_LAYOUT_MODE[mode];
}

export function resolveHostLayoutMode(
	mode: BottomSheetMode,
	pushDirection: PushDirection = 'bottom',
): HostLayoutMode {
	if (mode === 'push') {
		return pushDirection === 'top'
			? HOST_LAYOUT_MODE.pushTop
			: HOST_LAYOUT_MODE.pushBottom;
	}
	return HOST_LAYOUT_MODE[mode];
}

export function pushDirectionJsToHostLayoutMode(
	direction: PushDirectionJs,
): HostLayoutMode {
	return direction === 1 ? HOST_LAYOUT_MODE.pushTop : HOST_LAYOUT_MODE.pushBottom;
}
