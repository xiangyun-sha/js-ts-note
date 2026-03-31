<template>
	<div>
		<!-- 动态处理 -->
		<component :is="rendererFnComputed" />
	</div>
</template>

<script setup lang="ts">
/**
 * @BUILD_TIME 2026-03-30 15:57:34
 * @DESCRIPTION Description here
 * @AUTHOR Your Name
 * @MODIFIED_RECORD
 * 	- TIME: 2026-03-30; AUTHOR: Modifier Name; DESC: Modification Description;
 */

/*==================== 外部引入 ====================*/
import { computed } from 'vue';

/*==================== 内部引入 ====================*/
import { useFieldRenderer } from '../composables/useFieldRenerer';

/*==================== 类型定义 ====================*/

/*==================== 常量定义 ====================*/

/*==================== 组件Props ===================*/
const props = defineProps<{
	field: RendererField;
	formData: Record<string, any>;
	onupdate: <P extends RendererField, E extends any>(field: P, value: E) => void;
	onchange: <P extends RendererField, E extends any>(field: P, value: E) => void;
}>();

/*==================== Emits定义 ===================*/

/*==================== 状态管理 ====================*/

/*==================== 计算属性 ====================*/
const rendererFnComputed = computed(() => rendererFn);

/*==================== 监听器 ======================*/

/*==================== 生命周期 ====================*/

/*==================== 函数定义 ====================*/
const { rendererFn } = useFieldRenderer(props);
</script>

<style scoped></style>
