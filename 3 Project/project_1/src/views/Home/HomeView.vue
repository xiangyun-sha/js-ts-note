<template>
	<div>
		<div id="cesiumContainer"></div>
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
import * as Cesium from 'cesium';
import { onMounted } from 'vue';

/*==================== 内部引入 ====================*/

/*==================== 类型定义 ====================*/

/*==================== Props / Emits ==============*/

/*==================== 响应式变量 / 常量 ===========*/

/*==================== Inject（依赖注入） ==========*/

/*==================== 组合式函数 =================*/

/*==================== 计算属性 ===================*/

/*==================== 监听器 ====================*/

/*==================== 生命周期 ===================*/
onMounted(() => {
	const view = new Cesium.Viewer('cesiumContainer', {
		shouldAnimate: true,
		animation: false,
		timeline: false,
		fullscreenButton: false,
		geocoder: false,
		homeButton: false,
		sceneModePicker: false,
		baseLayerPicker: false,
		navigationHelpButton: false,
	});

	view.cesiumWidget.creditContainer.innerHTML = '';
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
