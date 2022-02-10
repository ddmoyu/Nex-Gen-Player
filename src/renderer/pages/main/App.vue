<template>
  <n-config-provider :theme="activeTheme">
    <n-layout class="container">
      <n-layout-header>
        <Frame />
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider :width="60">
          <Aside />
        </n-layout-sider>
        <n-layout-content content-style="padding: 10px;">
          <router-view />
        </n-layout-content>
      </n-layout>
      <n-layout-footer>
        <Footer />
      </n-layout-footer>
    </n-layout>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { darkTheme, lightTheme } from 'naive-ui'
import bus from './plugins/mitt'
const activeTheme = ref(darkTheme)

onMounted(() => {
  const theme = localStorage.getItem('theme')
  activeTheme.value = theme === 'light' ? lightTheme : darkTheme
  bus.on('bus.settings.theme', changeTheme)
})

function changeTheme (theme: string) {
  if (theme === 'dark') {
    activeTheme.value = darkTheme
  } else {
    activeTheme.value = lightTheme
  }
  localStorage.setItem('theme', theme)
}
</script>
<style lang="scss">
html,body,#app,.n-config-provider{
  height: 100%;
}
.container{
  height: 100%;
  .n-layout-scroll-container{
    display: flex;
    flex-direction: column;
  }
}
</style>
