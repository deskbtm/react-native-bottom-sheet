import { createContext, useContext, useId, useMemo, type ReactNode } from 'react';

import type { RegisteredBottomSheetModal } from './types';

interface BottomSheetModalRegistryContextValue {
	register: (modal: RegisteredBottomSheetModal) => void;
	unregister: (id: string) => void;
}

export const BottomSheetModalRegistryContext =
	createContext<BottomSheetModalRegistryContextValue | null>(null);

export function useBottomSheetModalRegistry(): BottomSheetModalRegistryContextValue {
	const context = useContext(BottomSheetModalRegistryContext);
	if (!context) {
		throw new Error('BottomSheetModal must be used within BottomSheetProvider');
	}
	return context;
}

export function useBottomSheetInstanceId(sheetId?: string): string {
	const generatedId = useId();
	return sheetId ?? generatedId;
}

export function BottomSheetModalRegistryProvider({
	children,
	register,
	unregister,
}: {
	children: ReactNode;
	register: (modal: RegisteredBottomSheetModal) => void;
	unregister: (id: string) => void;
}) {
	const value = useMemo(
		() => ({
			register,
			unregister,
		}),
		[register, unregister],
	);

	return (
		<BottomSheetModalRegistryContext.Provider value={value}>
			{children}
		</BottomSheetModalRegistryContext.Provider>
	);
}
