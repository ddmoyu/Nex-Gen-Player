import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './plugins/router'
import { createI18n } from 'vue-i18n'
import { messages } from './plugins/i18n'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/dist/style.css'

const i18n = createI18n({
  locale: 'en-US',
  messages
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.use(V3waterfall)
app.mount('#app')
