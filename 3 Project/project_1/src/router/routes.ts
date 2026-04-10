import type { RouteRecordRaw } from 'vue-router';

import Layout from '@/layout/Layout.vue';

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Layout',
		component: Layout,
		redirect: '/home',
		children: [
			{
				path: '/home',
				name: 'Home',
				component: () => import('@/views/Home/HomeView.vue'),
			},
			{
				path: '/about',
				name: 'About',
				component: () => import('@/views/About/AboutView.vue'),
			},
		],
	},
];
