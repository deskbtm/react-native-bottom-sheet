import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';
import { Debug } from './screens/Debug';
import { Demos } from './screens/Demos';
import { NotFound } from './screens/NotFound';

const MainTabs = createBottomTabNavigator({
	screens: {
		Demos: {
			screen: Demos,
			options: {
				title: 'Demos',
				tabBarIcon: ({ color, size }) => (
					<Image
						source={newspaper}
						tintColor={color}
						style={{
							width: size,
							height: size,
						}}
					/>
				),
			},
		},
		Debug: {
			screen: Debug,
			options: {
				title: 'Debug',
				tabBarIcon: ({ color, size }) => (
					<Image
						source={bell}
						tintColor={color}
						style={{
							width: size,
							height: size,
						}}
					/>
				),
			},
		},
	},
});

const RootStack = createNativeStackNavigator({
	screens: {
		MainTabs: {
			screen: MainTabs,
			options: {
				headerShown: false,
			},
		},
		NotFound: {
			screen: NotFound,
			options: {
				title: '404',
			},
			linking: {
				path: '*',
			},
		},
	},
});

export const Navigation = createStaticNavigation(RootStack);
