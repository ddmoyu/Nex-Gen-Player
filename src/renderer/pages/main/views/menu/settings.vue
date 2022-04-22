<template>
  <div class="settings">
    <div class="header">Settings</div>
    <n-divider />
    <n-collapse :default-expanded-names="['1', '2']">
      <n-collapse-item title="Theme" name="1">
        <n-radio-group v-model:value="theme" @change="changeTheme">
          <n-radio-button :value="'light'" label="light" />
          <n-radio-button :value="'dark'" label="dark" />
          <n-radio-button :value="'system'" label="system" />
        </n-radio-group>
      </n-collapse-item>
      <n-collapse-item title="Language" name="2">
        <n-radio-group v-model:value="language" @change="changeLanguage">
          <n-radio-button :value="'zh-CN'" label="zh-CN" />
          <n-radio-button :value="'en-US'" label="en-US" />
        </n-radio-group>
      </n-collapse-item>
      <n-collapse-item title="External Player" name="3">
        <n-input-group>
          <n-input v-model:value="player" :style="{ width: '50%' }" disabled /><n-button type="primary" @click="changePath('player')">Edit</n-button>
        </n-input-group>
      </n-collapse-item>
      <n-collapse-item title="External Downloader" name="4">
        <n-input-group>
          <n-input v-model:value="downloader" :style="{ width: '50%' }" disabled /><n-button type="primary" @click="changePath('downloader')">Edit</n-button>
        </n-input-group>
      </n-collapse-item>
      <n-collapse-item title="Shortcut" name="5">
        <div>可以</div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>
<script lang="ts" setup>
import { IpcDirective } from '@/main/ipcEnum'
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'
import { useI18n } from 'vue-i18n'
import bus from '../../plugins/mitt'

const { locale } = useI18n()
const theme = ref('light')
const language = ref('en-US')
const player = ref('')
const downloader = ref('')

async function initSettings () {
  theme.value = await settingsDB.getSetting('theme')
  language.value = await settingsDB.getSetting('language')
  player.value = await settingsDB.getSetting('player')
  downloader.value = await settingsDB.getSetting('downloader')
}

function changeTheme () {
  bus.emit('bus.settings.theme', theme.value)
}

function changeLanguage () {
  locale.value = language.value
  settingsDB.updateSetting({ language: language.value })
}

function changePath (type: string) {
  window.ipc.invoke(IpcDirective.WIN_DIALOG)
  window.ipc.once(IpcDirective.WIN_DIALOG_REPLAY, (e, args) => {
    if (args.canceled) return false
    const path = args.filePaths[0]
    if (type === 'player') {
      player.value = path
      settingsDB.updateSetting({ player: path })
    } else if (type === 'downloader') {
      downloader.value = path
      settingsDB.updateSetting({ downloader: path })
    }
  })
}

onMounted(() => {
  initSettings()
})
</script>
<style lang="scss" scoped>
.settings{
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 10px;
  .header{
    font-size: 24px;
    font-weight: bold;
  }
  .item{
    display: flex;
    height: 60px;
    align-items: center;
    .label{
      width: 220px;
      font-size: 18px;
    }
    .seting-item{
      flex: 1;
    }
  }
}
</style>
