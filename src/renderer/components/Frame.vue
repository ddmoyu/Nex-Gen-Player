<template>
  <div class="frame">
    <div class="mac" v-if="os !== 'win32'">
      <span class="close" @click="close()"></span>
      <span class="max" @click="maximize()"></span>
      <span class="min" @click="mini()"></span>
    </div>
    <div class="win" v-if="os === 'win32'">
      <n-button quaternary type="primary" @click="mini()">
        <n-icon size="20"><Remove /></n-icon>
      </n-button>
      <n-button quaternary type="primary" @click="maximize()">
        <n-icon size="20"><Add /></n-icon>
      </n-button>
      <n-button quaternary type="error" @click="close()">
        <n-icon size="20"><Close /></n-icon>
      </n-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Remove, Add, Close } from '@vicons/ionicons5'
import { settingsDB } from '../utils/database/controller/settingsDB'
import { ipcRenderer } from 'electron'

const os = ref<string>('')

onMounted(() => {
  getOS()
})

async function getOS() {
  const s = await settingsDB.getSetting('os')
  if (s) {
    os.value = s
  } else {
    const sys = await ipcRenderer.invoke('event.os.sys')
    settingsDB.updateSetting({ os: sys })
  }
}

function mini() {
  ipcRenderer.invoke('event.win.mini')
}
function maximize() {
  ipcRenderer.invoke('event.win.max')
}
function close() {
  ipcRenderer.invoke('event.win.close')
}
</script>
<style lang="scss" scoped>
.frame {
  height: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  -webkit-app-region: drag;
  button {
    -webkit-app-region: no-drag;
  }
  .mac {
    position: absolute;
    left: 0;
    height: 40px;
    display: flex;
    align-items: center;
    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      -webkit-app-region: no-drag;
      margin-left: 10px;
      cursor: pointer;
    }
    .close {
      background-color: #ff6057;
    }
    .max {
      background-color: #ffbd2e;
    }
    .min {
      background-color: #29c940;
    }
  }
}
</style>
