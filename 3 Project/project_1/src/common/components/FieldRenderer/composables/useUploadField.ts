// composables/fields/useUploadField.ts
import { h, ref, type RenderFunction } from 'vue';
import { ElUpload, ElButton, ElIcon, ElDialog, ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { FieldRendererOptions } from '@/types/dynamic-form';

/**
 * 上传字段渲染组合式函数
 * @param props - 与 useStandardField 一致的属性
 * @returns 渲染函数
 */
export function useUploadField<
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
	const { field, formData, onupdate, onchange } = props;
	const fieldName = field.fieldName;
	const type = field.elType as 'image' | 'video' | 'sounds' | 'files'; // 上传类型

	// 预览弹窗状态
	const previewState = ref({ visible: false, url: '' });

	// 文件类型映射
	const acceptMap: Record<string, string> = {
		image: 'image/*',
		video: 'video/*',
		sounds: 'audio/*',
		files: '*/*',
	};
	const listTypeMap: Record<string, 'picture-card' | 'text'> = {
		image: 'picture-card',
		video: 'text',
		sounds: 'text',
		files: 'text',
	};

	// 从 preset 中获取配置
	const maxNum = field.preset?.maxNum as number | undefined;
	const maxNumTip =
		field.preset?.maxNumTip ??
		(maxNum !== undefined ? `最多上传 ${maxNum} 个文件` : '');
	const uploadUrl = field.preset?.uploadUrl ?? '/api/file/upload/tmp';
	const multiple =
		field.preset?.multiple !== false &&
		(maxNum === undefined || maxNum > 1);
	const accept = field.preset?.accept ?? acceptMap[type] ?? '*/*';
	const listType = field.preset?.listType ?? listTypeMap[type] ?? 'text';
	const tipText = field.preset?.tip as string | undefined;

	// 从响应中提取文件标识
	const extractDbName = (response: any): string => {
		if (response?.files?.[0]) return response?.files[0];
		if (response?.data?.url) return response.data.url;
		if (response?.url) return response.url;
		return '';
	};

	// 更新文件列表
	const updateFileList = (newList: any[]) => onupdate(field, newList);

	return () => {
		const currentList: any[] = formData[fieldName] || [];
		const isFull = maxNum !== undefined && currentList.length >= maxNum;
		const remaining =
			maxNum !== undefined ? maxNum - currentList.length : null;
		const remainingTip =
			remaining !== null && remaining > 0
				? `还可上传 ${remaining} 个`
				: remaining === 0
					? '已达到上限'
					: '';

		const uploadProps = {
			action: uploadUrl,
			multiple,
			accept,
			listType,
			fileList: currentList,
			limit: maxNum,
			onExceed: (files: File[], fileList: any[]) => {
				ElMessage.warning(`最多只能上传 ${maxNum} 个文件`);
			},
			onChange: (file: any, uploadFileList: any[]) => {
				const newList = uploadFileList.map((uploadFile) => {
					const existing = currentList.find(
						(item) => item.uid === uploadFile.uid,
					);
					if (existing) {
						return {
							...existing,
							url: uploadFile.url,
							status: uploadFile.status,
							dbName:
								existing.dbName ||
								extractDbName(uploadFile.response),
						};
					}
					let blobUrl = uploadFile.url;
					if (!blobUrl && uploadFile.raw) {
						blobUrl = URL.createObjectURL(uploadFile.raw);
					}
					return {
						name: uploadFile.name,
						url: blobUrl,
						uid: uploadFile.uid,
						dbName: '',
						status: uploadFile.status,
					};
				});
				updateFileList(newList);
			},
			onRemove: (file: any, uploadFileList: any[]) => {
				const removed = currentList.find(
					(item) => item.uid === file.uid,
				);
				if (removed?.url?.startsWith('blob:')) {
					URL.revokeObjectURL(removed.url);
				}
				const newList = currentList.filter(
					(item) => item.uid !== file.uid,
				);
				updateFileList(newList);
			},
			onSuccess: (response: any, file: any) => {
				const dbName = extractDbName(response);
				const newList = currentList.map((item) => {
					if (item.uid === file.uid) {
						return {
							...item,
							dbName,
							status: 'success',
							url:
								response?.url || response.data?.url || item.url,
						};
					}
					return item;
				});
				updateFileList(newList);
			},
			onError: (err: Error, file: any) => {
				const removed = currentList.find(
					(item) => item.uid === file.uid,
				);
				if (removed?.url?.startsWith('blob:')) {
					URL.revokeObjectURL(removed.url);
				}
				const newList = currentList.filter(
					(item) => item.uid !== file.uid,
				);
				updateFileList(newList);
				console.error('Upload failed:', err);
			},
			onPreview: (file: any) => {},
			...(field.preset?.uploadProps || {}),
		};

		// 上传组件插槽内容
		const uploadSlots =
			type === 'image'
				? {
						default: () => h(ElIcon, { size: '24' }, () => h(Plus)),
						tip: () =>
							tipText
								? h('div', { class: 'el-upload__tip' }, tipText)
								: null,
					}
				: {
						default: () =>
							h(
								ElButton,
								{ type: 'primary', disabled: isFull },
								() => '点击上传',
							),
						tip: () =>
							tipText
								? h('div', { class: 'el-upload__tip' }, tipText)
								: null,
					};

		const uploadComponent = h(ElUpload, uploadProps, uploadSlots);

		// 提示信息
		const tipElement = h(
			'div',
			{
				class: 'upload-field-tip',
				style: { fontSize: '12px', color: '#909399', marginTop: '4px' },
			},
			[
				maxNumTip && h('span', maxNumTip),
				remainingTip &&
					h('span', { style: { marginLeft: '8px' } }, remainingTip),
				tipText &&
					type !== 'image' &&
					h('span', { style: { marginLeft: '8px' } }, tipText),
			].filter(Boolean),
		);

		// 预览弹窗（仅视频/音频）
		const previewDialog = ['video', 'sounds'].includes(type)
			? h(
					ElDialog,
					{
						modelValue: previewState.value.visible,
						'onUpdate:modelValue': (val: boolean) =>
							(previewState.value.visible = val),
						title: type === 'video' ? '视频预览' : '音频预览',
						width: '80%',
						appendToBody: true,
						destroyOnClose: true,
					},
					{
						default: () =>
							h(type === 'video' ? 'video' : 'audio', {
								src: previewState.value.url,
								controls: true,
								style: 'width:100%; height:auto;',
							}),
					},
				)
			: null;

		return h(
			'div',
			{},
			previewDialog
				? [uploadComponent, tipElement, previewDialog]
				: [uploadComponent, tipElement],
		);
	};
}
