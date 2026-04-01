import { useStandardField } from './useStandardField';
import { useUploadField } from './useUploadField';

/**
 * 字段渲染的组合式函数
 * @param { P } props
 * @returns { Record<string, any> }
 */
export function useFieldRenderer<
	P extends {
		field: RendererField;
		formData: Record<string, any>;
		onupdate: <R extends RendererField, E extends any>(
			field: R,
			value: E,
		) => void;
		onchange: <R extends RendererField, E extends any>(
			field: R,
			value: E,
		) => void;
	},
>(props: P): { rendererFn: <P>(props: P) => void } {
	/* 从父组件获取字段 */
	const { field } = props;

	/* 解译字段 */
	const { elType } = field;

	/* 确定具体渲染逻辑 */
	let composable: Function;
	switch (elType) {
		/* 上传类型 */
		case 'image':
		case 'video':
		case 'sounds':
		case 'files':
			composable = useUploadField;
			break;

		/* 常规类型 */
		default:
			composable = useStandardField;
			break;
	}

	/* 返回渲染函数 */
	return { rendererFn: composable(props) };
}
