import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from '@/router/router';

import 'cesium/Build/Cesium/Widgets/widgets.css';
import { Ion } from 'cesium';
Ion.defaultAccessToken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2Y2U3M2YwMi02MWIxLTQzY2YtOWNjYS1hY2E4MTk4MGZkZDgiLCJpZCI6MjI0Mzk5LCJpYXQiOjE3MjA1Nzg0Nzd9.lNZ7tE-OtrMVIH4WXDqb_A87R_TWw4l3PYMez5PAJEU';

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount('#app');
