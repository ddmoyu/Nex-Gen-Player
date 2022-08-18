<template>
  <n-config-provider :theme="activeTheme">
    <n-message-provider>
      <home></home>
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import Home from './views/Home.vue'
import { settingsDB } from './utils/database/controller/settingsDB'
import { darkTheme, lightTheme } from 'naive-ui'
import bus from './plugins/mitt'

const activeTheme = ref(darkTheme)

onMounted(async () => {
  getSettingsTheme()
  bus.on('bus.settings.theme', changeTheme)
})

async function getSettingsTheme() {
  const res = await settingsDB.getSetting('theme')
  if (res === 'system') {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    activeTheme.value = theme ? darkTheme : lightTheme
  } else {
    activeTheme.value = res === 'light' ? lightTheme : darkTheme
  }
}

function changeTheme(theme?: 'dark' | 'light' | 'system') {
  if (theme === 'system') {
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    activeTheme.value = theme ? darkTheme : lightTheme
  } else if (theme === 'dark') {
    activeTheme.value = darkTheme
  } else if (theme === 'light') {
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
  overflow-x: hidden;
}
.container {
  height: 100%;
  .n-layout-scroll-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
