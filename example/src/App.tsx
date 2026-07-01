import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomSheetProvider } from '@deskbtm-rn/bottom-sheet';

import { HostRenderProbeProvider } from '@/components/HostRenderProbe';
import { ImmersiveStatusBar } from '@/components/ImmersiveStatusBar';
import { Navigation } from './navigation';

void Asset.loadAsync([
	...NavigationAssets,
	require('./assets/newspaper.png'),
	require('./assets/bell.png'),
]);

void SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {
	const colorScheme = useColorScheme();
	const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

	return (
		<GestureHandlerRootView style={styles.root}>
			<SafeAreaProvider>
				<ImmersiveStatusBar />
				<KeyboardProvider preload={false}>
					<BottomSheetProvider mode="presentation">
						<HostRenderProbeProvider>
							<Navigation
								theme={theme}
								linking={{
									enabled: 'auto',
									prefixes: [prefix],
								}}
								onReady={() => {
									void SplashScreen.hideAsync();
								}}
							/>
						</HostRenderProbeProvider>
					</BottomSheetProvider>
				</KeyboardProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
