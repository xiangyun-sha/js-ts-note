import type { FormItemRule } from 'element-plus';

export interface FieldRendererOptions {
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
		[eventName: string]: (
			field: FieldRendererOptions,
			...args: any[]
		) => void;
	};
}

export { FieldRendererOptions };
