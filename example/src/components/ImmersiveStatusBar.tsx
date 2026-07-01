import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';

/**
 * Immersive (edge-to-edge) status bar for the app root.
 *
 * - Android: translucent status bar (requires `edgeToEdgeEnabled` in app.json); root view background is transparent.
 * - iOS: content may draw under the status bar; use safe area insets on headerless screens.
 * - `style="auto"` follows the active light/dark color scheme.
 *
 * Mount once inside `SafeAreaProvider` (e.g. in `App.tsx`).
 *
 * @example
 * <SafeAreaProvider>
 *   <ImmersiveStatusBar />
 *   <Navigation />
 * </SafeAreaProvider>
 */
export function ImmersiveStatusBar() {
	useEffect(() => {
		if (Platform.OS === 'web') {
			return;
		}
		void SystemUI.setBackgroundColorAsync('transparent');
	}, []);

	return <StatusBar style="auto" />;
}
