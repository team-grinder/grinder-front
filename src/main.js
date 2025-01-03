import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import VCalendar from 'v-calendar';
import vuetify from './plugins/vuetify';
import 'v-calendar/style.css';
import { createPinia } from 'pinia';

const app = createApp(App)

// Pinia 인스턴스 생성
const pinia = createPinia();

app.use(router);
app.use(VCalendar);
app.use(vuetify);
app.use(pinia);

app.mount('#app');
