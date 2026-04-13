import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
	const counterRef = ref(0);

	const add = () => {
		counterRef.value++;
	};

	return {
		counterRef,
		add,
	};
});
