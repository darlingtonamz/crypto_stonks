import { createApp } from 'vue'
import App from './App.vue'

const API_HOST = 'api.stonk.local';
let app = createApp(App);
app.config.globalProperties.API_HOST = API_HOST;
app.mount('#app');