const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

module.exports = (env, argv) => {
	const isDev = argv.mode === 'development';

	console.log(argv);
	console.log(process.env);

	return {
		mode: argv.mode || 'development',
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
			// 使用 dotenv-webpack，自动根据 mode 加载对应文件
			new Dotenv({
				path: isDev ? './.env.development' : './.env.production', // 也可以省略，插件默认会查找 .env
				safe: true, // 如果发现 .env.example 文件，会校验变量是否齐全（推荐）
				systemvars: true, // 允许使用系统环境变量（如 CI 中设置的）
				silent: true, // 找不到 .env 文件时不抛出错误
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
};
