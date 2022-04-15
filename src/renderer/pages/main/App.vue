<template>
  <n-config-provider :theme="activeTheme">
    <n-message-provider>
      <home></home>
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import Home from './views/Home.vue'
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'
import { darkTheme, lightTheme } from 'naive-ui'
import bus from './plugins/mitt'

const activeTheme = ref(darkTheme)

onMounted(async () => {
  getSettingsTheme()
  bus.on('bus.settings.theme', changeTheme)
})

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
