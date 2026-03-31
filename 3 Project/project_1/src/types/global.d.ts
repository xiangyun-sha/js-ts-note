import type { FormItemRule } from 'element-plus';
import type { Arrayable } from 'element-plus/es/utils';

declare global {
	interface RendererField {
		fieldName: string;
		elType: string;
		label: string;
		required: boolean;
		rules?: FormItemRule | Arrayable<FormItemRule>; // 使用导入的类型
		preset: {
			options?: Array<any>;
			defaultVal: any;
			[key: string]: any;
		};
	}
}

export {}; // 必须存在，使文件成为模块
