import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './plugins/router'
import { createI18n } from 'vue-i18n'
import { messages } from './plugins/i18n'

const i18n = createI18n({
  locale: 'en',
  messages
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
