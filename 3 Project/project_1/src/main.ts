import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from '@/router/router';

import 'reset-css';
import 'element-plus/dist/index.css';
import "cesium/Build/Cesium/Widgets/widgets.css"

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount('#app');
