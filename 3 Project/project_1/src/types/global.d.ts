import type { Cesium3DTile, Viewer } from 'cesium';
import type { FormItemRule } from 'element-plus';
import type { Arrayable } from 'element-plus/es/utils';

declare global {
	interface Window {
		_viewer: Viewer;
	}

	interface RendererField {
		fieldName: string;
		elType: string;
		label: string;
		required: boolean;
		preset: {
			options?: Array<any>;
			defaultVal: any;
			[key: string]: any;
		};
		rules?: FormItemRule | Arrayable<FormItemRule>; // 使用导入的类型
		events?: {
			[eventName: string]: (field: RendererField, ...args: any[]) => void;
		};
	}
}

export {}; // 必须存在，使文件成为模块
