const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = {
	mode: 'development',
	entry: './src/main.ts',
	output: {
		filename: 'js/[name].[contenthash:8].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.json', '.vue'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			cesium: path.resolve(__dirname, 'node_modules/cesium'), // ✅ 指向根目录
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					appendTsSuffixTo: [/\.vue$/], // 使 ts-loader 能处理 .vue 文件中的 <script lang="ts">
				},
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: './public/index.html',
		}),
		new DefinePlugin({
			__VUE_OPTIONS_API__: JSON.stringify(true),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
			CESIUM_BASE_URL: JSON.stringify('cesium'), // ✅ 正确路径
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'node_modules/cesium/Build/Cesium/Workers',
					to: 'cesium/Workers',
				},
				{
					from: 'node_modules/cesium/Build/Cesium/ThirdParty',
					to: 'cesium/ThirdParty',
				},
				{
					from: 'node_modules/cesium/Build/Cesium/Assets',
					to: 'cesium/Assets',
				},
				{
					from: 'node_modules/cesium/Build/Cesium/Widgets',
					to: 'cesium/Widgets',
				},
			],
		}),
		AutoImport({
			resolvers: [ElementPlusResolver()],
			dts: path.resolve(__dirname, 'src/auto-imports.d.ts'),
		}),
		Components({
			resolvers: [ElementPlusResolver()],
			dts: path.resolve(__dirname, 'src/components.d.ts'),
		}),
	],
	devServer: {
		static: path.join(__dirname, 'dist'),
		port: 8080,
		hot: true,
		open: true,
		historyApiFallback: true,
	},
};
