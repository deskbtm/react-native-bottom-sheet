import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	type Dispatch,
	type RefObject,
	type SetStateAction,
} from 'react';
import { useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { createBottomSheetSheetStore } from './bottomSheetSheetStore';
import { DEFAULT_THEME } from './constants';
import { createBottomSheetId } from './createBottomSheetId';
import { resolveHostLayoutMode, type HostLayoutMode } from './hostLayoutMode';
import { mergeLayoutOptions } from './mergeLayoutOptions';
import { resolveBottomSheetOptions } from './resolveOptions';
import type {
	BottomSheetControllerApi,
	BottomSheetLayoutOptions,
	BottomSheetMode,
	BottomSheetOptions,
	BottomSheetProviderProps,
	BottomSheetState,
	RegisteredBottomSheetModal,
} from './types';

export interface BottomSheetEngine {
	hostMode: BottomSheetMode;
	mergedTheme: Required<NonNullable<BottomSheetProviderProps['theme']>>;
	mergedLayout: BottomSheetLayoutOptions;
	bottomProgress: ReturnType<typeof useSharedValue<number>>;
	hostSheetTopY: ReturnType<typeof useSharedValue<number>>;
	/** Push detent open Y — paired with {@link hostSheetTopY} for progress on the UI thread. */
	pushProgressOpenY: ReturnType<typeof useSharedValue<number>>;
	/** Active push sheet panel height — used for top-down host offset math. */
	pushSheetHeight: ReturnType<typeof useSharedValue<number>>;
	activeHostMode: ReturnType<typeof useSharedValue<HostLayoutMode>>;
	sheetStore: ReturnType<typeof createBottomSheetSheetStore>;
	sheetsRef: RefObject<BottomSheetState[]>;
	dismissHandlersRef: RefObject<Map<string, () => void>>;
	controllersRef: RefObject<Map<string, BottomSheetControllerApi>>;
	modalsRef: RefObject<Map<string, RegisteredBottomSheetModal>>;
	dismissingAllRef: RefObject<boolean>;
	screenHeight: number;
	screenWidth: number;
	bindSheetState: (setSheets: Dispatch<SetStateAction<BottomSheetState[]>>) => () => void;
	present: (content: React.ReactNode, options?: BottomSheetOptions) => string;
	dismiss: (sheetId?: string) => void;
	dismissAll: () => void;
	dismissTop: () => void;
	register: (modal: RegisteredBottomSheetModal) => void;
	unregister: (id: string) => void;
	handleDismissComplete: (id: string) => void;
	handleDismissHandlerChange: (id: string, handler: (() => void) | undefined) => void;
	handleControllerReady: (id: string, api: BottomSheetControllerApi | undefined) => void;
	syncSheetStore: (sheets: BottomSheetState[]) => void;
	commitSheets: (sheets: BottomSheetState[]) => void;
}

export function useBottomSheetEngine({
	mode: hostMode = 'presentation',
	sheet,
	layout,
	theme,
}: Omit<BottomSheetProviderProps, 'children'>): BottomSheetEngine {
	const { height: screenHeight, width: screenWidth } = useWindowDimensions();
	const mergedTheme = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme]);
	const mergedLayout = useMemo(() => mergeLayoutOptions(layout), [layout]);

	const bottomProgress = useSharedValue(0);
	const hostSheetTopY = useSharedValue(screenHeight);
	const pushProgressOpenY = useSharedValue(screenHeight);
	const pushSheetHeight = useSharedValue(0);
	const activeHostMode = useSharedValue(resolveHostLayoutMode(hostMode));

	const sheetStore = useMemo(() => createBottomSheetSheetStore(), []);
	const sheetsRef = useRef<BottomSheetState[]>([]);
	const setSheetsRef = useRef<Dispatch<SetStateAction<BottomSheetState[]>> | null>(null);
	const dismissHandlersRef = useRef<Map<string, () => void>>(new Map());
	const controllersRef = useRef<Map<string, BottomSheetControllerApi>>(new Map());
	const modalsRef = useRef<Map<string, RegisteredBottomSheetModal>>(new Map());
	const dismissingAllRef = useRef(false);

	useEffect(() => {
		hostSheetTopY.value = screenHeight;
		pushProgressOpenY.value = screenHeight;
		pushSheetHeight.value = 0;
	}, [hostSheetTopY, pushProgressOpenY, pushSheetHeight, screenHeight]);

	const syncSheetStore = useCallback(
		(sheets: BottomSheetState[]) => {
			sheetsRef.current = sheets;
			const topSheet = sheets.length > 0 ? sheets[sheets.length - 1] : null;
			const drivingSheet = sheets.length > 0 ? sheets[0] : null;
			const layoutMode = topSheet?.options.mode ?? hostMode;
			const pushDirection =
				drivingSheet?.options.pushDirection ??
				topSheet?.options.pushDirection ??
				mergedLayout.push.direction;
			activeHostMode.value = resolveHostLayoutMode(layoutMode, pushDirection);
			sheetStore.setSnapshot({
				isPresented: sheets.length > 0,
				presentedSheetCount: sheets.length,
				topSheetId: topSheet?.id ?? null,
				topSheetController: topSheet
					? (controllersRef.current.get(topSheet.id) ?? null)
					: null,
			});
		},
		[activeHostMode, hostMode, mergedLayout.push.direction, sheetStore],
	);

	const commitSheets = useCallback(
		(next: BottomSheetState[]) => {
			syncSheetStore(next);
			setSheetsRef.current?.(next);
		},
		[syncSheetStore],
	);

	const bindSheetState = useCallback(
		(setSheets: Dispatch<SetStateAction<BottomSheetState[]>>) => {
			setSheetsRef.current = setSheets;
			return () => {
				setSheetsRef.current = null;
			};
		},
		[],
	);

	const dismissTop = useCallback(() => {
		const top = sheetsRef.current[sheetsRef.current.length - 1];
		if (!top) {
			return;
		}
		dismissHandlersRef.current.get(top.id)?.();
	}, []);

	const handleDismissComplete = useCallback(
		(id: string) => {
			const closing = sheetsRef.current.find((entry) => entry.id === id);
			closing?.options.onDismiss?.();

			dismissHandlersRef.current.delete(id);
			controllersRef.current.delete(id);

			const next = sheetsRef.current.filter((entry) => entry.id !== id);
			const dismissNextId =
				dismissingAllRef.current && next.length > 0 ? next[next.length - 1].id : null;

			if (next.length === 0) {
				bottomProgress.value = 0;
				hostSheetTopY.value = screenHeight;
				pushProgressOpenY.value = screenHeight;
				pushSheetHeight.value = 0;
				dismissingAllRef.current = false;
			}

			commitSheets(next);

			if (dismissNextId) {
				queueMicrotask(() => {
					dismissHandlersRef.current.get(dismissNextId)?.();
				});
			}
		},
		[
			bottomProgress,
			commitSheets,
			hostSheetTopY,
			pushProgressOpenY,
			pushSheetHeight,
			screenHeight,
		],
	);

	const handleDismissHandlerChange = useCallback(
		(id: string, handler: (() => void) | undefined) => {
			if (handler) {
				dismissHandlersRef.current.set(id, handler);
				return;
			}
			dismissHandlersRef.current.delete(id);
		},
		[],
	);

	const handleControllerReady = useCallback(
		(id: string, api: BottomSheetControllerApi | undefined) => {
			if (api) {
				controllersRef.current.set(id, api);
			} else {
				controllersRef.current.delete(id);
			}
			syncSheetStore(sheetsRef.current);
		},
		[syncSheetStore],
	);

	const dismiss = useCallback((sheetId?: string) => {
		const stack = sheetsRef.current;
		const top = stack[stack.length - 1];
		if (!top) {
			return;
		}
		const targetId = sheetId ?? top.id;
		if (targetId !== top.id) {
			return;
		}
		dismissHandlersRef.current.get(targetId)?.();
	}, []);

	const dismissAll = useCallback(() => {
		if (sheetsRef.current.length === 0) {
			return;
		}
		dismissingAllRef.current = true;
		dismissTop();
	}, [dismissTop]);

	const present = useCallback(
		(content: React.ReactNode, options?: BottomSheetOptions): string => {
			const id = options?.sheetId ?? createBottomSheetId();
			const resolved = resolveBottomSheetOptions(
				options,
				sheet,
				theme,
				hostMode,
				mergedLayout.push.direction,
			);
			const entry: BottomSheetState = { id, content, options: resolved };
			const prev = sheetsRef.current;
			if (prev.length === 0 && resolved.mode === 'push') {
				if (resolved.pushDirection === 'top') {
					hostSheetTopY.value = -screenHeight;
					pushProgressOpenY.value = 0;
				} else {
					hostSheetTopY.value = screenHeight;
					pushProgressOpenY.value = screenHeight;
				}
				pushSheetHeight.value = 0;
			}
			commitSheets([...prev.filter((sheet) => sheet.id !== id), entry]);
			return id;
		},
		[
			commitSheets,
			hostMode,
			hostSheetTopY,
			mergedLayout.push.direction,
			pushProgressOpenY,
			pushSheetHeight,
			screenHeight,
			sheet,
			theme,
		],
	);

	const register = useCallback((modal: RegisteredBottomSheetModal) => {
		modalsRef.current.set(modal.id, modal);
	}, []);

	const unregister = useCallback((id: string) => {
		modalsRef.current.delete(id);
	}, []);

	return useMemo(
		(): BottomSheetEngine => ({
			hostMode,
			mergedTheme,
			mergedLayout,
			bottomProgress,
			hostSheetTopY,
			pushProgressOpenY,
			pushSheetHeight,
			activeHostMode,
			sheetStore,
			sheetsRef,
			dismissHandlersRef,
			controllersRef,
			modalsRef,
			dismissingAllRef,
			screenHeight,
			screenWidth,
			bindSheetState,
			present,
			dismiss,
			dismissAll,
			dismissTop,
			register,
			unregister,
			handleDismissComplete,
			handleDismissHandlerChange,
			handleControllerReady,
			syncSheetStore,
			commitSheets,
		}),
		[
			activeHostMode,
			bindSheetState,
			bottomProgress,
			commitSheets,
			dismiss,
			dismissAll,
			dismissTop,
			handleControllerReady,
			handleDismissComplete,
			handleDismissHandlerChange,
			hostMode,
			hostSheetTopY,
			pushProgressOpenY,
			mergedLayout,
			mergedTheme,
			present,
			register,
			screenHeight,
			screenWidth,
			sheetStore,
			syncSheetStore,
			unregister,
		],
	);
}
