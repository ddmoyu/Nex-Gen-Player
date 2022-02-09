<template>
  <div class="frame">
    <div class="mac">
      <span class="min" @click="mini()"></span>
      <span class="max" @click="maximize()"></span>
      <span class="close" @click="close()"></span>
    </div>
    <div class="win">
      <n-button quaternary type="primary" @click="mini()">
        <n-icon size="20"><Remove /></n-icon>
      </n-button>
      <n-button quaternary type="primary" @click="maximize()">
        <n-icon size="20"><Add /></n-icon>
      </n-button>
      <n-button quaternary type="primary" @click="close()">
        <n-icon size="20"><Close /></n-icon>
      </n-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Remove, Add, Close } from '@vicons/ionicons5'
import { IpcDirective } from '@/main/ipcEnum'
function mini () {
  window.ipc.invoke(IpcDirective.WIN_MINI, { name: 'main' })
}
function maximize () {
  window.ipc.invoke(IpcDirective.WIN_MAXIMIZE, { name: 'main' })
}
function close () {
  window.ipc.invoke(IpcDirective.WIN_CLOSE, { name: 'main' })
}
</script>
<style lang="scss" scoped>
.frame{
  height: 40px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  -webkit-app-region: drag;
  button{
    -webkit-app-region: no-drag;
  }
}
</style>
