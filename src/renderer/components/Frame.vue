<template>
  <div class="frame">
    <span @click="mini()">-</span>
    <span @click="maximize()">□</span>
    <span @click="close()">X</span>
  </div>
</template>
<script lang="ts" setup>
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
  -webkit-app-region: drag;
  height: 40px;
}
span{
  padding: 10px;
  border: 1px #ccc solid;
  cursor: pointer;
  -webkit-app-region: no-drag;
}
</style>
