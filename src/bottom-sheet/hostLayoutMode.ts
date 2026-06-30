import type { BottomSheetMode } from './types';

/** Numeric host layout modes for Reanimated worklets (no string compare on UI thread). */
export const HOST_LAYOUT_MODE = {
	modal: 0,
	presentation: 1,
	push: 2,
} as const;

export type HostLayoutMode = (typeof HOST_LAYOUT_MODE)[keyof typeof HOST_LAYOUT_MODE];

export function bottomSheetModeToLayoutJs(mode: BottomSheetMode): HostLayoutMode {
	return HOST_LAYOUT_MODE[mode];
}
