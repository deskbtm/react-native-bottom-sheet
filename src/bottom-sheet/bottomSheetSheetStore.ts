import type { BottomSheetControllerApi } from './types';

export interface BottomSheetSheetSnapshot {
	isPresented: boolean;
	presentedSheetCount: number;
	topSheetId: string | null;
	topSheetController: BottomSheetControllerApi | null;
}

const EMPTY_SNAPSHOT: BottomSheetSheetSnapshot = {
	isPresented: false,
	presentedSheetCount: 0,
	topSheetId: null,
	topSheetController: null,
};

export type BottomSheetSheetStoreListener = () => void;

export interface BottomSheetSheetStore {
	getSnapshot: () => BottomSheetSheetSnapshot;
	subscribe: (listener: BottomSheetSheetStoreListener) => () => void;
	setSnapshot: (next: BottomSheetSheetSnapshot) => void;
}

export function createBottomSheetSheetStore(): BottomSheetSheetStore {
	let snapshot = EMPTY_SNAPSHOT;
	const listeners = new Set<BottomSheetSheetStoreListener>();

	return {
		getSnapshot: () => snapshot,
		subscribe: (listener) => {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		setSnapshot: (next) => {
			if (
				snapshot.isPresented === next.isPresented &&
				snapshot.presentedSheetCount === next.presentedSheetCount &&
				snapshot.topSheetId === next.topSheetId &&
				snapshot.topSheetController === next.topSheetController
			) {
				return;
			}
			snapshot = next;
			listeners.forEach((listener) => listener());
		},
	};
}
