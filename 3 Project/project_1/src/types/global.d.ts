import type { Cesium3DTile, Viewer } from 'cesium';

declare global {
	interface Window {
		_viewer: Viewer;
	}
}

export {}; // 必须存在，使文件成为模块
