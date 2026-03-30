import { useStandardField } from './useStandardField';

/**
 * 字段渲染的组合式函数
 * @param { P } props
 * @returns { Record<string, any> }
 */
export function useFieldRenderer<P extends { field: RendererField }>(props: P) {
	/* 从父组件获取字段 */
	const { field } = props;

	/* 解译字段 */
	const { type } = field;

	/* 确定具体渲染逻辑 */
	let composable: Function;
	switch (type) {
		/* 上传类型 */
		case 'image':
		case 'video':
		case 'sounds':
		case 'files':
			composable = () => {
				console.log('upload el');
			};
			break;

		/* 常规类型 */
		default:
			composable = useStandardField;
			break;
	}

	/* 返回渲染函数 */
	return { rendererFn: composable(props) };
}
