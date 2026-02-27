<template>
	<div>
		<RouterView />
		<div id="cesiumContainer" style="width: 500px; height: 500px"></div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import * as Cesium from 'cesium';

onMounted(() => {
	const viewer = new Cesium.Viewer('cesiumContainer');
	console.log(viewer);
});
</script>

<style scoped></style>
