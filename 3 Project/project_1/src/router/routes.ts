import type { RouteRecordRaw } from 'vue-router';

import HomeView from '@/views/Home/HomeView.vue';

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: HomeView,
	},
	{
		path: '/about',
		name: 'About',
		component: () => import('@/views/About/AboutView.vue'),
	},
];
