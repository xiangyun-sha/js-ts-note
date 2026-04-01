// src/shims-cesium-css.d.ts
declare module 'reset-css' {
	// 如果是作为 CSS 文件导入，通常只需要声明为任何模块即可
	const content: string;
	export default content;
}

declare module '*.css' {
	const content: string;
	export default content;
}

declare module '*.png' {
	const src: string;
	export default src;
}
