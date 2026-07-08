import type { PushDirection } from './types';

/** Numeric push direction for Reanimated worklets (no string compare on UI thread). */
export const PUSH_DIRECTION_JS = {
	bottom: 0,
	top: 1,
} as const;

export type PushDirectionJs = (typeof PUSH_DIRECTION_JS)[keyof typeof PUSH_DIRECTION_JS];

export function pushDirectionToJs(direction: PushDirection): PushDirectionJs {
	return direction === 'top' ? PUSH_DIRECTION_JS.top : PUSH_DIRECTION_JS.bottom;
}

export function isTopPushDirection(direction: PushDirection): boolean {
	return direction === 'top';
}

/** JS-thread helper. In worklets, compare with `direction === PUSH_DIRECTION_JS.top`. */
export function isTopPushDirectionJs(direction: PushDirectionJs): boolean {
	return direction === PUSH_DIRECTION_JS.top;
}
