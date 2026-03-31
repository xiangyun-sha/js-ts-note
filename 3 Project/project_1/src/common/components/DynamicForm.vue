<template>
	<div>
		<el-form ref="formEl" :model="formDataRx" :rules="formRulesRx">
			<!-- 字段表单部分 -->
			<template v-for="field in fieldList" :key="field.fieldName">
				<el-form-item :label="field.label" :prop="field.fieldName" :required="field.required">
					<FieldRenderer :field="field" :form-data="formDataRx" :onupdate="handleFieldValueUpdated" :onchange="handleFieldValueChanged" />
				</el-form-item>
			</template>

			<!-- 提交以及其他操作部分 -->
			<el-form-item>
				<el-button type="primary"> 提交 </el-button>
				<el-button type="primary"> 保存为草稿 </el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
/**
 * @BUILD_TIME 2026-03-30 15:19:22
 * @DESCRIPTION Description here
 * @AUTHOR Your Name
 * @MODIFIED_RECORD
 * 	- TIME: 2026-03-30; AUTHOR: Modifier Name; DESC: Modification Description;
 */

/*==================== 外部引入 ====================*/
import { reactive, useTemplateRef, watch } from 'vue';

/*==================== 内部引入 ====================*/
import FieldRenderer from './FieldRenderer.vue';

/*==================== 类型定义 ====================*/

/*==================== 常量定义 ====================*/

/*==================== 组件Props ===================*/
const props = defineProps<{
	fieldList: RendererField[];
}>();

/*==================== Emits定义 ===================*/
const emits = defineEmits<{
	(e: 'change', valeu: any): void;
}>();

/*==================== 状态管理 ====================*/
/* 表单模板引用 */
const formElRef = useTemplateRef('formEl');

/* 表单数据 */
const formDataRx = reactive<Record<string, any>>({});

/* 表单校验 */
const formRulesRx = reactive<Record<string, any>>({});

/*==================== 计算属性 ====================*/

/*==================== 监听器 ======================*/
watch(
	props.fieldList,
	(newList: Array<RendererField>, oldList: Array<RendererField> | undefined) => {
		/* 重构 formData */
		Object.keys(formDataRx).forEach((k) => delete formDataRx[k]);
		initialFormData(newList);

		/* 重构 formRules */
		Object.keys(formRulesRx).forEach((k) => delete formRulesRx[k]);
		initialFormRules(newList);
	},
	{ deep: true, immediate: true },
);

/*==================== 生命周期 ====================*/

/*==================== 函数定义 ====================*/
/**
 * 构建表单数据
 * @param { RendererField } fieldList
 * @returns { void }
 */
function initialFormData(fieldList: Array<RendererField>) {
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
function initialFormRules(fieldList: Array<RendererField>) {
	props.fieldList.forEach((field: RendererField) => {
		/* 解译 */
		const { fieldName, required, rules, label } = field;

		/* 如果没有也需要赋值为空数组 */
		if (!formRulesRx[fieldName]) formRulesRx[fieldName] = [];

		/* 是否为必要字段 */
		if (required) formRulesRx[fieldName].push({ required: true, message: `${label}不能为空`, trigger: 'blur' });

		/* 其他校验规则 */
		if (rules) {
			const rulesArr = Array.isArray(rules) ? rules : [rules];
			formRulesRx[fieldName].push(...rulesArr);
		}
	});
}

/**
 * 表单项单独校验
 * @param field
 * @returns { void }
 */
function getFormItemRule(field: RendererField) {}

/**
 * 字段更新事件处理函数
 * @param { RendererField } field
 * @param { any } value
 */
function handleFieldValueUpdated(field: RendererField, value: any) {
	const { fieldName } = field;
	formDataRx[fieldName] = value;
}

/**
 * 字段更改事件处理函数
 * @param { RendererField } field
 * @param { any } value
 */
function handleFieldValueChanged(field: RendererField, value: any) {
	const { fieldName } = field;
	emits('change', { name: fieldName });
}
</script>

<style scoped></style>
