/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
	bundleMode: true,
	strictGlobal: true,
};

module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			[
				'babel-preset-expo',
				{
					// Preset auto-injects the plugin without bundleMode; configure explicitly below.
					reanimated: false,
					worklets: false,
				},
			],
		],
		plugins: [['react-native-worklets/plugin', workletsPluginOptions]],
	};
};
