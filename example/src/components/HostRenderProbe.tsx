import {
	createContext,
	memo,
	useContext,
	useLayoutEffect,
	useMemo,
	useSyncExternalStore,
	type ReactNode,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HostRenderProbeStore {
	bump: () => void;
	notify: () => void;
	reset: () => void;
	subscribe: (listener: () => void) => () => void;
	getSnapshot: () => number;
}

function createHostRenderProbeStore(): HostRenderProbeStore {
	let count = 0;
	const listeners = new Set<() => void>();

	return {
		bump() {
			count += 1;
		},
		notify() {
			for (const listener of listeners) {
				listener();
			}
		},
		reset() {
			count = 0;
			for (const listener of listeners) {
				listener();
			}
		},
		subscribe(listener) {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		getSnapshot: () => count,
	};
}

const HostRenderProbeContext = createContext<HostRenderProbeStore | null>(null);

export function HostRenderProbeProvider({ children }: { children: ReactNode }) {
	const store = useMemo(() => createHostRenderProbeStore(), []);

	return (
		<HostRenderProbeContext.Provider value={store}>{children}</HostRenderProbeContext.Provider>
	);
}

function useHostRenderProbeStore(): HostRenderProbeStore | null {
	return useContext(HostRenderProbeContext);
}

/** Marks protected host content renders — must live under a component that does not call useBottomSheet(). */
export function ProtectedHostRenderMarker() {
	const store = useHostRenderProbeStore();

	if (!store) {
		return null;
	}

	store.bump();

	useLayoutEffect(() => {
		store.notify();
	});

	return null;
}

export function useHostRenderCount(): number {
	const store = useHostRenderProbeStore();

	return useSyncExternalStore(
		store?.subscribe ?? (() => () => {}),
		() => store?.getSnapshot() ?? 0,
		() => 0,
	);
}

interface HostRenderProbeBadgeProps {
	label?: string;
}

export const HostRenderProbeBadge = memo(function HostRenderProbeBadge({
	label = 'Protected host renders',
}: HostRenderProbeBadgeProps) {
	const count = useHostRenderCount();

	if (!__DEV__) {
		return null;
	}

	return (
		<View style={styles.badge}>
			<Text style={styles.badgeLabel}>{label}</Text>
			<Text style={styles.badgeCount}>{count}</Text>
		</View>
	);
});

export function useHostRenderProbeActions() {
	const store = useHostRenderProbeStore();

	return useMemo(
		() => ({
			reset: () => store?.reset(),
		}),
		[store],
	);
}

const styles = StyleSheet.create({
	badge: {
		alignSelf: 'stretch',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
		backgroundColor: 'rgba(52, 199, 89, 0.14)',
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'rgba(52, 199, 89, 0.35)',
	},
	badgeLabel: {
		fontSize: 13,
		fontWeight: '500',
	},
	badgeCount: {
		fontVariant: ['tabular-nums'],
		fontSize: 15,
		fontWeight: '700',
	},
});
