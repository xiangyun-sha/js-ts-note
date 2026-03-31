import { h } from 'vue';
import { ElInput, ElInputNumber, ElSelect, ElOption, ElRadioGroup, ElRadio, ElSwitch, ElDatePicker, ariaProps } from 'element-plus';

export function useStandardField(props: {
	field: RendererField;
	formData: Record<string, any>;
	onupdate: (field: RendererField, value: any) => void;
	onchange: (field: RendererField, value: any) => void;
}) {
	const { field, formData, onupdate, onchange } = props;
	const { fieldName, elType, label } = field;

	const handleUpdate = (value: any) => onupdate(field, value);
	const handleChange = (value: any) => onchange(field, value);

	return () => {
		switch (elType) {
			case 'number':
				return h(ElInputNumber, {
					placeholder: `请输入${label}`,
					modelValue: formData[fieldName] as number | null,
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
				});

			case 'radiobox': {
				const options = (field.preset?.options || []).map((opt: any) =>
					typeof opt === 'object' ? { label: opt.label || opt.value, value: opt.value || opt.label } : { label: opt, value: opt },
				);
				return h(
					ElRadioGroup,
					{
						modelValue: formData[fieldName] as string | number | boolean,
						'onUpdate:modelValue': handleUpdate,
						onChange: handleChange,
					},
					() => options.map((opt) => h(ElRadio, { label: opt.value, key: opt.value }, () => opt.label)),
				);
			}

			case 'select': {
				const selectOptions = (field.preset?.options || []).map((opt: any) => (typeof opt === 'object' && opt.label ? opt : { label: String(opt), value: opt }));
				return h(
					ElSelect as any,
					{
						placeholder: `请选择${label}`,
						modelValue: formData[fieldName],
						'onUpdate:modelValue': handleUpdate,
						onChange: handleChange,
						style: 'width: 150px;',
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
				});

			case 'boolean':
				return h(ElSwitch, {
					modelValue: formData[fieldName] as boolean,
					activeText: formData.preset?.activeText || '是',
					inactiveText: formData.preset?.inactiveText || '否',
					activeValue: formData.preset?.activeValue || true,
					inactiveValue: formData.preset?.inactiveValue || false,
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
				});

			case 'input':
			case 'textarea':
			case 'password':
				return h(ElInput, {
					modelValue: formData[fieldName] as string,
					type: elType === 'password' ? 'password' : elType === 'textarea' ? 'textarea' : 'text',
					placeholder: `请输入${label}`,
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
				});

			default:
				return h(ElInput, {
					modelValue: formData[fieldName],
					'onUpdate:modelValue': handleUpdate,
					onChange: handleChange,
				});
		}
	};
}
