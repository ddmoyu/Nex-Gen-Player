<template>
  <n-layout class="siteManager">
    <div class="header">
      <n-button>
        <template #icon><n-icon size="20"><Add /></n-icon></template>Add
      </n-button>
      <n-dropdown :options="importOptions" placement="bottom-end" @select="handleImportSelect">
        <n-button>
          <n-icon size="20"><ArrowDown /></n-icon>Import
        </n-button>
      </n-dropdown>
      <n-button>
        <template #icon><n-icon size="20"><ArrowUp /></n-icon></template>Export
      </n-button>
      <n-button>
        <template #icon><n-icon size="20"><ShieldCheckmarkOutline /></n-icon></template>Check
      </n-button>
    </div>
    <n-scrollbar>
      <div class="list">
        <!-- {{siteList}} -->
        live manager
      </div>
    </n-scrollbar>
  </n-layout>
</template>
<script lang="ts" setup>
import { db } from '@/renderer/utils/database/controller/DBTools'
import { ArrowUp, ArrowDown, Add, ShieldCheckmarkOutline } from '@vicons/ionicons5'
import { IpcDirective } from '@/main/ipcEnum'
import bus from '../../plugins/mitt'

const siteList = ref([])

onMounted(() => {
  getSites()
})

const importOptions = ref([
  {
    label: 'Online JSON',
    key: 'online'
  },
  {
    label: 'Local JSON',
    key: 'local'
  }
])

async function getSites () {
  const res = await db.all('sites')
  console.log('=== res ===', res)
}

function handleImportSelect () {
  console.log('handleImportSelect')
}

async function handleImport () {
  window.ipc.invoke(IpcDirective.IMPORT_JSON)
  window.ipc.once(IpcDirective.IMPORT_JSON_REPLAY, async (e, args) => {
    siteList.value = args
    await db.bulkAdd('sites', args)
    bus.emit('bus.sites.change')
  })
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
