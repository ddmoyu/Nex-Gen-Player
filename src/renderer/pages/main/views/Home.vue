<template>
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
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </n-layout-content>
    </n-layout>
    <n-layout-footer>
      <Footer />
    </n-layout-footer>
  </n-layout>
</template>
<script lang="ts" setup>
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'
import { useMessage } from 'naive-ui'
import { IpcDirective } from '@/main/ipcEnum'
import { useI18n } from 'vue-i18n'

//  add global message
window.$message = useMessage()

const { locale } = useI18n()

onMounted(async () => {
  getSystemLanguage()
})

async function getSystemLanguage () {
  const lang = await settingsDB.getSetting('language')
  if (!lang) {
    // debugger
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
    locale.value = lang
  }
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
