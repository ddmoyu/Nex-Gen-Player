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
    <div class="list">
      <n-data-table
        ref="table"
        size="small"
        :columns="columns"
        :data="siteList"
        flex-height
        style="height: 100%;"
      />
    </div>
  </n-layout>
</template>
<script lang="ts" setup>
import { db } from '@/renderer/utils/database/controller/DBTools'
import { ArrowUp, ArrowDown, Add, ShieldCheckmarkOutline } from '@vicons/ionicons5'
import { IpcDirective } from '@/main/ipcEnum'
import bus from '../../plugins/mitt'
import { Site } from '@/renderer/utils/database/models/Site'
import { NButton, NSwitch } from 'naive-ui'
import { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface'
import { cloneDeep, orderBy, sortBy } from 'lodash'

const siteList = ref([])
const columns: TableBaseColumn<Site>[] = [
  {
    title: 'Name',
    key: 'name',
    width: 80,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Group',
    key: 'group',
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'jiexi',
    key: 'jiexi',
    width: 100,
    render (row: Site) {
      return row.jiexi ? '有' : '无'
    }
  },
  {
    title: 'State',
    key: 'state',
    width: 100,
    render (row: Site) {
      return row.state ? '可用' : '失效'
    }
  },
  {
    title: 'Active',
    key: 'isActive',
    width: 100,
    render (row: Site) {
      return h(NSwitch, { defaultValue: row.isActive, onClick: () => handleActive(row) })
    }
  },
  {
    title: 'Operator',
    key: 'key',
    width: 180,
    render (row: Site) {
      return [
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleTop(row) }, { default: () => 'Top' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleEdit(row) }, { default: () => 'Edit' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleCheck(row) }, { default: () => 'Check' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleDelete(row) }, { default: () => 'Delete' })
      ]
    }
  }
]

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

onMounted(() => {
  getSites()
})

function renderSite () {
  const list = sortBy(cloneDeep(siteList.value), 'id')
  siteList.value = list
  db.clear('sites').then(() => {
    db.bulkAdd('sites', list)
  })
  bus.emit('bus.sites.change')
}

function handleActive (item: Site) {
  item.isActive = !item.isActive
}

function handleTop (item: Site) {
  const id = item.id
  const list = cloneDeep(siteList.value)
  list.map(li => {
    if (li.id === 0) li.id = id
    if (li.name === item.name) li.id = 0
  })
  siteList.value = list
  console.log('sitelist', siteList.value)
  renderSite()
}
function handleEdit (item: Site) {
  console.log('item: ', item)
}
function handleCheck (item: Site) {
  console.log('item: ', item)
}
function handleDelete (item: Site) {
  console.log('item: ', item)
}

async function getSites () {
  const res = await db.all('sites')
  siteList.value = res
  renderSite()
  console.log('=== res ===', res)
}

// TODO: check repeat api
function handleImportSelect (key: string | number) {
  if (key === 'local') {
    window.ipc.invoke(IpcDirective.IMPORT_JSON)
    window.ipc.on(IpcDirective.IMPORT_JSON_REPLAY, async (e, args) => {
      siteList.value = args
      await db.bulkAdd('sites', args)
      bus.emit('bus.sites.change')
    })
  } else if (key === 'online') {
    console.log('todo')
  }
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
  .list{
    height: 100%;
    padding: 10px;
  }
}
</style>
