<template>
	<div>
		<el-form ref="formEl" :model="formDataRx" :rules="formRulesRx">
			<!-- 字段表单部分 -->
			<template v-for="field in fieldList" :key="field.fieldName">
				<el-form-item
					:label="field.label"
					:prop="field.fieldName"
					:required="field.required"
				>
					<FieldRenderer
						:field="field"
						:form-data="formDataRx"
						:onupdate="handleFieldValueUpdated"
						:onchange="handleFieldValueChanged"
					/>
				</el-form-item>
			</template>

			<!-- 提交以及其他操作部分 -->
			<el-form-item>
				<el-button type="primary" @click="handleSubmit">
					提交
				</el-button>
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
import { watch } from 'vue';

/*==================== 内部引入 ====================*/
import FieldRenderer from './FieldRenderer.vue';
import { useDyanmicForm } from '../composables/useDynamicForm';

/*==================== 类型定义 ====================*/

/*==================== 常量定义 ====================*/

/*==================== Props / Emits ================*/
const props = defineProps<{
	fieldList: RendererField[];
}>();

const emits = defineEmits<{
	(e: 'change', value: any): void;
	(e: 'submit', value: any): void;
}>();

/*==================== 组合式函数 ==================*/
const {
	formElRef,
	formDataRx,
	formRulesRx,
	initialFormData,
	initialFormRules,
	handleFieldValueChanged,
	handleFieldValueUpdated,
	handleSubmit,
} = useDyanmicForm(props, emits);

/*==================== 计算属性 ====================*/

/*==================== 监听器 ======================*/
watch(
	props.fieldList,
	(
		newList: Array<RendererField>,
		oldList: Array<RendererField> | undefined,
	) => {
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
</script>

<style scoped></style>
