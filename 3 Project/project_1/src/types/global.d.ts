/* 渲染字段结构 */
type RendererField = {
	type: string; // 元素类型
	prop: string; // 属性
	label: string; // 标签
	requierd: boolean; // 是否为必须
	rules?: Record<string, any>; // 校验规则
	preset?: Record<string, any>; // 设置包括 选项 等
};
