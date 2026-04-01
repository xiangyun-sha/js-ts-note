<template>
	<div>
		<div ref="cesiumContainerRef" id="cesiumContainer"></div>
	</div>
</template>

<script setup lang="ts">
/**
 * @BUILD_TIME 2026-04-01 15:20:06
 * @DESCRIPTION Description here
 * @AUTHOR Your Name
 * @MODIFIED_RECORD
 * 	- TIME: 2026-04-01; AUTHOR: Modifier Name; DESC: Modification Description;
 */

/*==================== 外部引入 ====================*/
import { onMounted } from 'vue';

/*==================== 内部引入 ====================*/
import { useCesiumContainer } from './composables/useCesiumContainer';

/*==================== 类型定义 ====================*/

/*==================== Props / Emits ==============*/
const props = defineProps<{}>();

const emits = defineEmits<{}>();

/*==================== 响应式变量 / 常量 ===========*/

/*==================== Inject（依赖注入） ==========*/

/*==================== 组合式函数 =================*/
const { cesiumContainerRef, initCesiumViewer } = useCesiumContainer(
	props,
	emits,
);

/*==================== 计算属性 ===================*/

/*==================== 监听器 ====================*/

/*==================== 生命周期 ===================*/
onMounted(() => {
	console.log(cesiumContainerRef.value);

	initCesiumViewer('cesiumContainer');

	console.log(window._viewer);
});

/*==================== Provide（依赖提供） ====================*/

/*==================== defineExpose ====================*/
</script>

<style scoped>
#cesiumContainer {
	width: 100vw;
	height: 100vh;
}
</style>
