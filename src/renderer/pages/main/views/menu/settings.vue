<template>
  <div class="settings">
    <div class="header">{{$t('Settings.settings')}}</div>
    <n-divider />
    <div class="main">
      <div class="wrapper">
        <n-scrollbar>
          <n-collapse :accordion="true" :default-expanded-names="['0']">
            <n-collapse-item :title="$t('Settings.theme')" name="1">
              <n-radio-group v-model:value="theme" @change="changeTheme">
                <n-radio-button :value="'light'" :label="$t('Settings.light')" />
                <n-radio-button :value="'dark'" :label="$t('Settings.dark')" />
                <n-radio-button :value="'system'" :label="$t('Settings.system')" />
              </n-radio-group>
            </n-collapse-item>
            <n-collapse-item :title="$t('Settings.language')" name="2">
              <n-radio-group v-model:value="language" @change="changeLanguage">
                <n-radio-button :value="'zh-CN'" :label="$t('Settings.zh-CN')" />
                <n-radio-button :value="'en-US'" :label="$t('Settings.en-US')" />
              </n-radio-group>
            </n-collapse-item>
            <!-- <n-collapse-item title="Play" name="9">
              <div>开启关闭 最小化暂停播放</div>
            </n-collapse-item>
            <n-collapse-item title="Window" name="8">
              <div>开启关闭 记录窗口位置</div>
              <div>开启关闭 记录窗口大小</div>
            </n-collapse-item> -->
            <n-collapse-item :title="$t('Settings.externalPlayer')" name="3">
              <n-input-group>
                <n-input v-model:value="player" :style="{ width: '50%' }" disabled /><n-button type="primary" @click="changePath('player')">Edit</n-button>
              </n-input-group>
            </n-collapse-item>
            <n-collapse-item :title="$t('Settings.externalDownloader')" name="4">
              <n-input-group>
                <n-input v-model:value="downloader" :style="{ width: '50%' }" disabled /><n-button type="primary" @click="changePath('downloader')">Edit</n-button>
              </n-input-group>
            </n-collapse-item>
            <!-- <n-collapse-item title="Shortcut" name="5">
              <div>开启关闭 快捷键</div>
              <div>老板键</div>
              <div>快捷键</div>
            </n-collapse-item> -->
            <n-collapse-item title="过滤" name="6">
              <div class="exclude" v-if="filter">
                <div class="left">
                  <div class="toggle">过滤分类：<n-switch v-model:value="filter.classToggle" :round="false" @update:value="handleFilterChange" /></div>
                  <div><n-input v-model:value="filter.class" type="textarea" @change="handleFilterChange" /></div>
                </div>
                <div class="right" v-if="filter">
                  <div class="toggle">过滤视频：<n-switch v-model:value="filter.videoToggle" :round="false" @update:value="handleFilterChange" /></div>
                  <div><n-input v-model:value="filter.video" type="textarea" @input="handleFilterChange"/></div>
                </div>
              </div>
            </n-collapse-item>
            <!-- <n-collapse-item title="Password" name="7">
              <div>设置密码</div>
              <div>修改密码</div>
            </n-collapse-item> -->
            <n-collapse-item title="重置" name="11">
              <n-popconfirm
                @positive-click="handleResetConfirm"
                positive-text="确认"
                negative-text="取消">
                <template #trigger>
                  <n-button type="error">软件重置</n-button>
                </template>
                确认是否重置软件？
              </n-popconfirm>
              <div class="resetTips">软件重置会清空用户所有数据，请谨慎操作。点击确认后，软件会重置并关闭退出。</div>
            </n-collapse-item>
          </n-collapse>
        </n-scrollbar>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IpcDirective } from '@/main/ipcEnum'
import { db } from '@/renderer/utils/database/controller/DBTools'
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'
import { cloneDeep } from 'lodash'
import { useI18n } from 'vue-i18n'
import bus from '../../plugins/mitt'

const { locale } = useI18n()
const theme = ref('light')
const language = ref('en-US')
const player = ref('')
const downloader = ref('')
const filter = ref()

async function initSettings () {
  theme.value = await settingsDB.getSetting('theme')
  language.value = await settingsDB.getSetting('language')
  player.value = await settingsDB.getSetting('player')
  downloader.value = await settingsDB.getSetting('downloader')
  filter.value = await settingsDB.getSetting('exclude')
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

function handleResetConfirm () {
  db.reset().then(() => {
    window.ipc.invoke(IpcDirective.WIN_CLOSE)
  })
}

function handleFilterChange () {
  const exclude = cloneDeep(filter.value)
  settingsDB.updateSetting({ exclude })
  bus.emit('bus.class.change')
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
      .exclude{
        display: flex;
        width: 100%;
        justify-content: space-between;
        .left, .right{
          flex: 0.49;
          .toggle{
            margin-bottom: 10px;
            display: flex;
            align-items: center;
          }
        }
      }
      .resetTips{
        margin-top: 10px;
      }
    }
  }
}
</style>
