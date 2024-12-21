import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { createPinia } from 'pinia';

const app = createApp(App)
// v-calendar 전역 등록
app.use(router);
app.use(VCalendar);

// Pinia 인스턴스 생성
const pinia = createPinia();

// Pinia를 Vue 애플리케이션에 추가
app.use(pinia);

app.mount('#app');
