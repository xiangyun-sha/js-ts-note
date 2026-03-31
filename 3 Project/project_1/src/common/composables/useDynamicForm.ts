import { reactive, useTemplateRef } from 'vue';
import type { FormInstance } from 'element-plus';

export function useDyanmicForm<
	P extends { fieldList: RendererField[] },
	E extends {
		(e: 'change', value: any): void;
		(e: 'submit', value: any): void;
	},
>(props: P, emits: E) {
	/* 表单模板引用 */
	const formElRef = useTemplateRef<FormInstance>('formEl');

	/* 表单数据 */
	const formDataRx = reactive<Record<string, any>>({});

	/* 表单校验 */
	const formRulesRx = reactive<Record<string, any>>({});

	/**
	 * 构建表单数据
	 * @param { RendererField } fieldList
	 * @returns { void }
	 */
	function initialFormData(fieldList: Array<RendererField>): void {
		props.fieldList.forEach((field: RendererField) => {
			const { fieldName, preset } = field;
			formDataRx[fieldName] = preset.defaultVal;
		});
	}

	/**
	 * 构建表单校验规则
	 * @param { RendererField } fieldList
	 * @returns { void }
	 */
	function initialFormRules(fieldList: Array<RendererField>): void {
		props.fieldList.forEach((field: RendererField) => {
			/* 解译 */
			const { fieldName, required, rules, label } = field;

			/* 如果没有也需要赋值为空数组 */
			if (!formRulesRx[fieldName]) formRulesRx[fieldName] = [];

			/* 是否为必要字段 */
			if (required)
				formRulesRx[fieldName].push({
					required: true,
					message: `${label}不能为空`,
					trigger: 'blur',
				});

			/* 其他校验规则 */
			if (rules) {
				const rulesArr = Array.isArray(rules) ? rules : [rules];
				formRulesRx[fieldName].push(...rulesArr);
			}
		});
	}

	/**
	 * 字段更新事件处理函数
	 * @param { RendererField } field
	 * @param { any } value
	 * @returns { void }
	 */
	function handleFieldValueUpdated(field: RendererField, value: any): void {
		const { fieldName } = field;
		formDataRx[fieldName] = value;
	}

	/**
	 * 字段更改事件处理函数
	 * @param { RendererField } field
	 * @param { any } value
	 * @returns { void }
	 */
	function handleFieldValueChanged(field: RendererField, value: any): void {
		const { fieldName } = field;
		emits('change', { name: fieldName });
	}

	/**
	 * 提交逻辑
	 * @async
	 * @event click
	 * @returns { Promise<void> }
	 */
	async function handleSubmit(): Promise<void> {
		if (!formElRef.value) return;

		try {
			/* 校验通过，继续提交 */
			await formElRef.value.validate();
			// console.log('表单数据：', formDataRx);
			emits('submit', formDataRx);

			/* 调用提交接口... */
		} catch (errors: any) {
			/* 校验失败，errors 包含具体错误信息 */
			console.error('表单校验失败：', errors);

			/* 可选：提示用户 */
			ElMessage.warning('请填写完整并正确表单');
		}
	}

	return {
		formElRef,
		formDataRx,
		formRulesRx,
		initialFormData,
		initialFormRules,
		handleFieldValueUpdated,
		handleFieldValueChanged,
		handleSubmit,
	};
}
