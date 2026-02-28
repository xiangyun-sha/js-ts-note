<template>
	<div>
		<div style="display: flex; justify-content: center; align-items: center">
			<div>{{ counterRef }}</div>
			<el-button type="primary" size="small" circle @click="add">+</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();

const { add } = store;
const { counterRef } = storeToRefs(store);
</script>

<style scoped></style>
