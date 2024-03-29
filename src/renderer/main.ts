import { createApp } from 'vue'
import App from './App.vue'
import router from './plugins/router'
import { createI18n } from 'vue-i18n'
import { messages } from './plugins/i18n'

const i18n = createI18n({
  locale: 'zh-CN',
  messages
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
