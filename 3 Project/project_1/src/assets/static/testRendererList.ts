const RENDERERFIELD_LIST: RendererField[] = [
	// 1. 文本输入框
	{
		fieldName: 'username',
		elType: 'input',
		label: '用户名',
		required: true,
		preset: {
			defaultVal: '',
			placeholder: '请输入用户名',
			clearable: true,
		},
		rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
		// 可选：定义需要向上传递的事件
		events: {
			blur: (field, event) => {
				console.log(`${field.label} 失焦`, event);
			},
			focus: (field, event) => {
				console.log(`${field.label} 聚焦`);
			},
		},
	},

	// 2. 文本域
	{
		fieldName: 'description',
		elType: 'textarea',
		label: '描述',
		required: false,
		preset: {
			defaultVal: '',
			rows: 4,
			placeholder: '请输入描述',
		},
	},

	// 3. 数字输入框
	{
		fieldName: 'age',
		elType: 'number',
		label: '年龄',
		required: false,
		preset: {
			defaultVal: null,
			min: 0,
			max: 120,
			step: 1,
		},
	},

	// 4. 单选按钮
	{
		fieldName: 'gender',
		elType: 'radiobox',
		label: '性别',
		required: true,
		preset: {
			defaultVal: 'male',
			options: [
				{ label: '男', value: 'male' },
				{ label: '女', value: 'female' },
			],
		},
	},

	// 5. 下拉选择
	{
		fieldName: 'city',
		elType: 'select',
		label: '城市',
		required: true,
		preset: {
			defaultVal: '',
			options: ['北京', '上海', '广州', '深圳'],
			placeholder: '请选择城市',
			clearable: true,
		},
	},

	// 6. 日期时间
	{
		fieldName: 'birthday',
		elType: 'datetime',
		label: '生日',
		required: false,
		preset: {
			defaultVal: null,
			format: 'YYYY-MM-DD HH:mm:ss',
			placeholder: '请选择日期时间',
		},
	},

	// 7. 开关 (boolean)
	{
		fieldName: 'active',
		elType: 'boolean',
		label: '是否激活',
		required: false,
		preset: {
			defaultVal: true,
			activeText: '是',
			inactiveText: '否',
			activeValue: true,
			inactiveValue: false,
		},
	},

	// 8. 图片上传（使用 useUploadField）
	{
		fieldName: 'avatar',
		elType: 'image', // 触发 useUploadField
		label: '头像',
		required: false,
		preset: {
			defaultVal: [],
			maxNum: 1, // 最多上传1张
			maxNumTip: '最多上传1张图片',
			uploadUrl: '/api/file/upload/image', // 自定义上传地址
			accept: 'image/jpeg,image/png,image/gif',
			listType: 'picture-card',
			tip: '支持 jpg、png 格式，大小不超过2MB',
			uploadProps: {
				// 其他 el-upload 属性
				name: 'file',
				withCredentials: true,
			},
		},
	},

	// 9. 视频上传
	{
		fieldName: 'videoDemo',
		elType: 'video',
		label: '示例视频',
		required: false,
		preset: {
			defaultVal: [],
			maxNum: 1,
			uploadUrl: '/api/file/upload/video',
			accept: 'video/mp4,video/avi',
			tip: '支持 mp4、avi 格式，不超过100MB',
		},
	},

	// 10. 音频上传
	{
		fieldName: 'audioDemo',
		elType: 'sounds',
		label: '示例音频',
		required: false,
		preset: {
			defaultVal: [],
			maxNum: 1,
			uploadUrl: '/api/file/upload/audio',
			accept: 'audio/mpeg,audio/wav',
			tip: '支持 mp3、wav 格式，不超过50MB',
		},
	},

	// 11. 通用文件上传（多文件）
	{
		fieldName: 'files',
		elType: 'files',
		label: '附件',
		required: false,
		preset: {
			defaultVal: [],
			maxNum: 5,
			multiple: true,
			uploadUrl: '/api/file/upload',
			tip: '支持任意文件，最多上传5个',
		},
	},
];

export default RENDERERFIELD_LIST;
