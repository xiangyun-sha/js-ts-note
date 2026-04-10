import { h } from 'vue';
import {
	ElInput,
	ElInputNumber,
	ElSelect,
	ElOption,
	ElRadioGroup,
	ElRadio,
	ElSwitch,
	ElDatePicker,
} from 'element-plus';

import type { RenderFunction } from 'vue';
import type { FieldRendererOptions } from '@/types/dynamic-form';

export function useStandardField<
	P extends {
		field: FieldRendererOptions;
		formData: Record<string, any>;
		onupdate: <R extends FieldRendererOptions, E extends any>(
			field: R,
			value: E,
		) => void;
		onchange: <R extends FieldRendererOptions, E extends any>(
			field: R,
			value: E,
		) => void;
	},
>(props: P): RenderFunction {
	/* 解译属性与渲染字段 */
	const { field, formData, onupdate, onchange } = props;
	const { fieldName, elType, label, preset } = field;

	/* onUpdate:modealValue 与 change 事件 */
	const handleUpdate = (value: any) => onupdate(field, value);
	const handleChange = (value: any) => onchange(field, value);

	/**
	 * 处理单独字段的自有事件
	 * @returns { Record<string, (...args: any[]) => void> }
	 */
	function buildEventHandlers(): Record<string, (...args: any[]) => void> {
		/* container */
		const handlers: Record<string, (...args: any[]) => void> = {};

		/* fiter & reconstruct */
		if (field.events) {
			Object.entries(field.events).forEach(([eventName, handler]) => {
				/* deal event name，like "blur -> onBlur" */
				const vueEventName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

				/* reconstructor */
				handlers[vueEventName] = (...args: any[]) =>
					handler(field, ...args);
			});
		}

		/* return res */
		return handlers;
	}

	/* 返回的渲染逻辑 */
	return () => {
		const eventHandlers = buildEventHandlers();

		switch (elType) {
			case 'number':
				return h(ElInputNumber, {
					placeholder: `请输入${label}`,
					modelValue: formData[fieldName] as number | null,
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
					...eventHandlers,
				});

			case 'radiobox': {
				const options = (field.preset?.options || []).map((opt: any) =>
					typeof opt === 'object'
						? {
								label: opt.label || opt.value,
								value: opt.value || opt.label,
							}
						: { label: opt, value: opt },
				);
				return h(
					ElRadioGroup,
					{
						modelValue: formData[fieldName] as
							| string
							| number
							| boolean,
						'onUpdate:modelValue': handleUpdate,
						onChange: handleChange,
						...eventHandlers,
					},
					() =>
						options.map((opt) =>
							h(
								ElRadio,
								{ label: opt.value, key: opt.value },
								() => opt.label,
							),
						),
				);
			}

			case 'select': {
				const selectOptions = (preset?.options || []).map((opt: any) =>
					typeof opt === 'object' && opt.label
						? opt
						: { label: String(opt), value: opt },
				);
				return h(
					ElSelect as any,
					{
						placeholder: `请选择${label}`,
						modelValue: formData[fieldName],
						'onUpdate:modelValue': handleUpdate,
						style: 'width: 200px;',
						onChange: handleChange,
						...eventHandlers,
					},
					() =>
						selectOptions.map((opt) =>
							h(ElOption, {
								key: opt.value,
								value: opt.value,
								label: opt.label,
							}),
						),
				);
			}

			case 'datetime':
				return h(ElDatePicker, {
					type: 'datetime',
					placeholder: `请选择${label}`,
					modelValue: formData[fieldName],
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
					...eventHandlers,
				});

			case 'boolean':
				return h(ElSwitch, {
					modelValue: formData[fieldName] as boolean,
					activeText: preset?.activeText || '是',
					inactiveText: preset?.inactiveText || '否',
					activeValue: preset?.activeValue || true,
					inactiveValue: preset?.inactiveValue || false,
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
					...eventHandlers,
				});

			case 'input':
			case 'textarea':
			case 'password':
				return h(ElInput, {
					modelValue: formData[fieldName] as string,
					type:
						elType === 'password'
							? 'password'
							: elType === 'textarea'
								? 'textarea'
								: 'text',
					placeholder: `请输入${label}`,
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
					rows: field.preset.rows || 3,
					...eventHandlers,
				});

			default:
				return h(ElInput, {
					modelValue: formData[fieldName],
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
					...eventHandlers,
				});
		}
	};
}
