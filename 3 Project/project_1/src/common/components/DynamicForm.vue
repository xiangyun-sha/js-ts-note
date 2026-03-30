<template>
	<div>
		<el-form ref="formEl" :model="formDataRef" :rules="formRulesRef">
			<!-- 字段表单部分 -->
			<template v-for="field in fieldList" :key="field.prop">
				<el-form-item :label="field.label" :prop="field.prop" :required="field.requierd">
					<FieldRenderer :field="field" />
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
import { ref, useTemplateRef } from 'vue';

/*==================== 内部引入 ====================*/
import FieldRenderer from './FieldRenderer.vue';

/*==================== 类型定义 ====================*/

/*==================== 常量定义 ====================*/

/*==================== 组件Props ===================*/
const props = defineProps({
	fieldList: {
		type: Array<RendererField>,
		required: true,
		defualt: () => [],
	},
});

/*==================== Emits定义 ===================*/

/*==================== 状态管理 ====================*/
/* 表单模板引用 */
const formElRef = useTemplateRef('formEl');

/* 表单数据 */
const formDataRef = ref<Record<string, any>>({});

/* 表单校验 */
const formRulesRef = ref<Record<string, any>>({});

/*==================== 计算属性 ====================*/

/*==================== 监听器 ======================*/

/*==================== 生命周期 ====================*/

/*==================== 函数定义 ====================*/
</script>

<style scoped></style>
