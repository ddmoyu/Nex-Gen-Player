<template>
  <div class="iptv">
    <div class="header">
      <n-button @click="handleRequst">request</n-button>
    </div>
    <div class="body">
      <n-data-table
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
import { DataTableColumns } from 'naive-ui'

const data = ref<PlaylistItem[]>()
const columns = createColumns()

function createColumns (): DataTableColumns<PlaylistItem> {
  return [
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Country',
      key: 'tvg.country'
    },
    {
      title: 'Language',
      key: 'tvg.language'
    }
  ]
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
  .body{
    flex: 1;
  }
}
</style>
