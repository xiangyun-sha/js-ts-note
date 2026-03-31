<template>
	<div>
		<div>
			<DynamicForm
				:field-list="RENDERERFIELD_LIST"
				@change="console.log('step in')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * @BUILD_TIME 2026-03-30 15:45:40
 * @DESCRIPTION Description here
 * @AUTHOR Your Name
 * @MODIFIED_RECORD
 * 	- TIME: 2026-03-30; AUTHOR: Modifier Name; DESC: Modification Description;
 */

/*==================== 外部引入 ====================*/

/*==================== 内部引入 ====================*/
import DynamicForm from '@/common/components/DynamicForm.vue';

/*==================== 类型定义 ====================*/

/*==================== 常量定义 ====================*/
/* 测试用 字段表 */
const RENDERERFIELD_LIST: Array<RendererField> = [
	{
		fieldName: 'name',
		elType: 'input',
		label: '名称',
		required: true,
		preset: {
			defaultVal: '',
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

/*==================== 组件Props ===================*/

/*==================== Emits定义 ===================*/

/*==================== 状态管理 ====================*/

/*==================== 计算属性 ====================*/

/*==================== 监听器 ======================*/

/*==================== 生命周期 ====================*/

/*==================== 函数定义 ====================*/
</script>

<style scoped></style>
