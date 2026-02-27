<template>
	<div>
		<h3>{{ counterRef }}</h3>
		<el-button type="primary" size="small" circle @click="add"></el-button>
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
