const RENDERERFIELD_LIST: Array<RendererField> = [
	{
		fieldName: 'name',
		elType: 'input',
		label: '名称',
		required: true,
		preset: {
			defaultVal: '',
		},
		events: {
			blur: (field, event) => {
				console.log(`${field.label} 失去焦点`, event);
				// 可以在这里做实时校验等
			},
			focus: (field, event) => {
				console.log('获得焦点');
			},
		},
	},
	{
		fieldName: 'date',
		elType: 'datetime',
		label: '日期',
		required: false,
		preset: {
			defaultVal: '',
		},
	},
	{
		fieldName: 'isNaN',
		elType: 'boolean',
		label: '是否为空',
		required: false,
		preset: {
			defaultVal: '',
		},
	},
	{
		fieldName: 'hobbies',
		elType: 'radiobox',
		label: '兴趣',
		required: false,
		preset: {
			options: ['radio 1', 'radio 2', 'radio 3'],
			defaultVal: 'radio 1',
		},
	},
	{
		fieldName: 'category',
		elType: 'select',
		label: '类别',
		required: false,
		preset: {
			options: ['category 1', 'category 2', 'category 3'],
			defaultVal: '',
		},
	},
	{
		fieldName: 'desc',
		elType: 'textarea',
		label: '描述',
		required: false,
		preset: {
			defaultVal: '',
		},
	},
	{
		fieldName: 'accuracy',
		elType: 'number',
		label: '误差',
		required: false,
		preset: {
			defaultVal: '',
		},
	},
];

export default RENDERERFIELD_LIST;
