<template>
  <div class="settings">
    <div class="header">Settings</div>
    <n-divider />
    <div class="main">
      <div class="wrapper">
        <n-scrollbar>
          <n-collapse :accordion="true">
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
            <n-collapse-item title="Play" name="9">
              <div>开启关闭 最小化暂停播放</div>
            </n-collapse-item>
            <n-collapse-item title="Window" name="8">
              <div>开启关闭 记录窗口位置</div>
              <div>开启关闭 记录窗口大小</div>
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
              <div>开启关闭 快捷键</div>
              <div>老板键</div>
              <div>快捷键</div>
            </n-collapse-item>
            <n-collapse-item title="Exclude" name="6">
              <div>开启关闭 过滤分类</div>
              <div>过滤分类</div>
              <div>开启关闭 过滤视频</div>
              <div>过滤视频</div>
            </n-collapse-item>
            <n-collapse-item title="Password" name="7">
              <div>设置密码</div>
              <div>修改密码</div>
            </n-collapse-item>
            <n-collapse-item title="Clear" name="10">
              <div>缓存清理</div>
              <div>清理提示</div>
            </n-collapse-item>
            <n-collapse-item title="Reset" name="11">
              <div>软件重置</div>
              <div>重置提示</div>
            </n-collapse-item>
          </n-collapse>
        </n-scrollbar>
      </div>
    </div>
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
  padding: 10px;
  .header{
    font-size: 24px;
    font-weight: bold;
  }
  .main{
    flex: 1;
    position: relative;
    overflow-y: auto;
    .wrapper{
      position: absolute;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      user-select: none;
    }
  }
}
</style>
