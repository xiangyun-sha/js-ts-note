<template>
	<div>
		<div>
			<DynamicForm
				:field-list="RENDERERFIELD_LIST"
				@submit="handleSubmitAsync"
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
 * 	- TIME: 2026-03-30; AUTHOR: Modifier Name; DESC: 动态表单的使用示例;
 */

/*==================== 外部引入 ====================*/

/*==================== 内部引入 ====================*/
import RENDERERFIELD_LIST from '@/assets/static/testRendererList';
import DynamicForm from '@/common/components/DynamicForm.vue';
import { useHomeView } from './composables/useHomeView';

/*==================== 类型定义 ====================*/

/*==================== 常量定义 ====================*/

/*==================== 组件Props ===================*/

/*==================== Emits定义 ===================*/

/*==================== 状态管理 ====================*/
const { handleSubmitAsync } = useHomeView();

/*==================== 监听器 ======================*/

/*==================== 生命周期 ====================*/
</script>

<style scoped></style>
