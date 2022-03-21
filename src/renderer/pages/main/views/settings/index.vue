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
    <div>
      <n-button @click="openSiteManager">sites manager</n-button>
    </div>
    <site-manager v-if="siteManagerShow" @handleClose="handleClose" />
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import bus from '../../plugins/mitt'
import SiteManager from '../../components/SiteManager.vue'

const { locale } = useI18n()
const siteManagerShow = ref(false)

function changeTheme (theme: string) {
  bus.emit('bus.settings.theme', theme)
}

function changeLanguage (lang: string) {
  locale.value = lang
}

function openSiteManager () {
  siteManagerShow.value = !siteManagerShow.value
}

function handleClose (e: string) {
  if (e === 'siteManager') return openSiteManager()
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
