<template>
  <n-config-provider :theme="activeTheme">
    <n-message-provider>
      <n-layout class="container">
        <n-layout-header>
          <Frame />
        </n-layout-header>
        <n-layout has-sider>
          <n-layout-sider :width="60">
            <Aside />
          </n-layout-sider>
          <n-layout-content>
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component"></component>
              </keep-alive>
            </router-view>
          </n-layout-content>
        </n-layout>
        <n-layout-footer>
          <Footer />
        </n-layout-footer>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'
import { darkTheme, lightTheme } from 'naive-ui'
import bus from './plugins/mitt'
import { IpcDirective } from '@/main/ipcEnum'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const activeTheme = ref(darkTheme)

onMounted(async () => {
  getSystemLanguage()
  getSettingsTheme()
  bus.on('bus.settings.theme', changeTheme)
})

async function getSystemLanguage () {
  const lang = await settingsDB.getSetting('language')
  if (!lang) {
    window.ipc.invoke(IpcDirective.SYS_LANGUAGE)
    window.ipc.on(IpcDirective.SYS_LANGUAGE_REPLAY, (e, args) => {
      if (args === 'zh-CN') {
        locale.value = 'zh-CN'
      } else {
        locale.value = 'en-US'
      }
      settingsDB.updateSetting({ language: locale.value })
    })
  } else {
    // TODO: lang type
    locale.value = lang as string
  }
}

async function getSettingsTheme () {
  const res = await settingsDB.getSetting('theme')
  activeTheme.value = res === 'light' ? lightTheme : darkTheme
}

function changeTheme (theme: 'dark' | 'light') {
  if (theme === 'dark') {
    activeTheme.value = darkTheme
  } else {
    activeTheme.value = lightTheme
  }
  settingsDB.updateSetting({ theme: theme })
}
</script>
<style lang="scss">
html,
body,
#app,
.n-config-provider {
  height: 100%;
}
.container {
  height: 100%;
  .n-layout-scroll-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
