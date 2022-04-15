<template>
  <n-layout class="siteManager">
    <div class="header">
      <n-button>
        <template #icon><n-icon size="20"><Add /></n-icon></template>Add
      </n-button>
      <n-button @click="handleImport">
        <template #icon><n-icon size="20"><ArrowDown /></n-icon></template>Import
      </n-button>
      <n-button>
        <template #icon><n-icon size="20"><ArrowUp /></n-icon></template>Export
      </n-button>
      <n-button>
        <template #icon><n-icon size="20"><ShieldCheckmarkOutline /></n-icon></template>Check
      </n-button>
      <n-button circle @click="handleClose">
        <template #icon><n-icon size="20"><Close /></n-icon></template>
      </n-button>
    </div>
    <n-scrollbar>
      <div class="list">
        <!-- {{siteList}} -->
        site manager
      </div>
    </n-scrollbar>
  </n-layout>
</template>
<script lang="ts" setup>
import { db } from '@/renderer/utils/database/controller/DBTools'
import { ArrowUp, ArrowDown, Add, ShieldCheckmarkOutline, Close } from '@vicons/ionicons5'
import { IpcDirective } from '@/main/ipcEnum'
import bus from '../../plugins/mitt'

const siteList = ref([])
const emit = defineEmits(['handleClose'])

onMounted(() => {
  getSites()
})

async function getSites () {
  const res = await db.all('sites')
  console.log('=== res ===', res)
}

async function handleImport () {
  window.ipc.invoke(IpcDirective.IMPORT_JSON)
  window.ipc.on(IpcDirective.IMPORT_JSON_REPLAY, async (e, args) => {
    siteList.value = args
    await db.bulkAdd('sites', args)
    bus.emit('bus.sites.change')
  })
}

function handleClose () {
  emit('handleClose', 'siteManager')
}
</script>
<style lang="scss" scoped>
.siteManager{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    button{
      margin-left: 10px;
    }
  }
}
</style>
