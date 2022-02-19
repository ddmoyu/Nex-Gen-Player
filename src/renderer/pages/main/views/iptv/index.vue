<template>
  <div class="iptv">
    <div class="header">
      <n-space vertical>
        <n-space justify="space-between">
          <n-space>
            <n-select v-model:value="iptv" :options="iptvList"></n-select>
            <n-button @click="handleRequst">Refresh</n-button>
          </n-space>
          <n-input placeholder="Search" clearable v-model:value="value" @input="handleInput">
            <template #suffix>
              <n-icon><Search /></n-icon>
            </template>
          </n-input>
        </n-space>
      </n-space>
    </div>
    <div class="body">
      <n-data-table
        ref="table"
        size="small"
        :columns="columns"
        :data="data"
        flex-height
        style="height: 100%;"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { m3uList } from '../../../../api/iptv'
import type { PlaylistItem } from 'iptv-playlist-parser'
import { NButton } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface'

const iptv = ref('awesome')
const iptvList = ref([
  { label: 'Awesome-iptv', value: 'awesome' }
])

const data = ref<PlaylistItem[]>()
const table = ref()
const value = ref('')

const columns: TableBaseColumn<PlaylistItem>[] = [
  {
    title: 'Name',
    key: 'name',
    ellipsis: {
      tooltip: true
    },
    filter (value, row) {
      const reg = new RegExp(value as string, 'gi')
      return reg.test(row.name)
    }
  },
  {
    title: 'Country',
    key: 'tvg.country',
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Language',
    key: 'tvg.language',
    width: 120,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Group',
    key: 'group.title',
    width: 140,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Action',
    key: 'actions',
    width: 100,
    render (row: PlaylistItem) {
      return h(
        NButton,
        {
          onClick: () => handlePlay(row)
        },
        {
          default: () => 'Play'
        }
      )
    }
  }
]

function handleInput () {
  const txt = value.value.trim()
  if (txt !== '') {
    table.value.filter({ name: [`${txt}`] })
  } else {
    table.value.filter(null)
  }
}

function handlePlay (row: PlaylistItem): void {
  console.log('play: ', row)
}

async function handleRequst () {
  const list = await m3uList()
  console.log('list', list)
  data.value = list
}
</script>
<style lang="scss" scoped>
.iptv{
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 10px;
  .header{
    height: 44px;
  }
  .body{
    flex: 1;
  }
}
</style>
