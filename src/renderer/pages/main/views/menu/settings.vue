<template>
  <div class="settings">
    <div>
      <n-button @click="changeTheme('dark')">Dark Theme</n-button>
      <n-button @click="changeTheme('light')">light Theme</n-button>
    </div>
    <div>
      <n-button @click="changeLanguage('en-US')">en language</n-button>
      <n-button @click="changeLanguage('zh-CN')">zh language</n-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import bus from '../../plugins/mitt'

const { locale } = useI18n()

function changeTheme (theme: string) {
  bus.emit('bus.settings.theme', theme)
}

function changeLanguage (lang: string) {
  locale.value = lang
}
</script>
<style lang="scss" scoped>
.settings{
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
