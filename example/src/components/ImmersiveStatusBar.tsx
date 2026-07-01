import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';

export function ImmersiveStatusBar() {
	useEffect(() => {
		if (Platform.OS === 'web') {
			return;
		}
		void SystemUI.setBackgroundColorAsync('transparent');
	}, []);

	return <StatusBar style="auto" />;
}
