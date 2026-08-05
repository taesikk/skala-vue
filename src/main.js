// Vue 앱 진입점. 전역 CSS를 불러오고 Pinia·Router를 등록한 뒤 App을 마운트한다.

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
