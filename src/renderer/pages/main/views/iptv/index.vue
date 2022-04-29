<template>
  <div class="iptv">
    <div class="header">
      <n-space vertical>
        <n-space justify="space-between">
          <n-space>
            <n-button tertiary type="primary" @click="handleManager" v-if="!iptv">
              <n-icon size="22">
                <Build />
              </n-icon>
            </n-button>
            <n-select v-if="iptv || iptv === 0" v-model:value="iptv" :options="iptvList" @update:value="getTvList"></n-select>
            <n-button v-if="iptv || iptv === 0" tertiary type="primary" @click="handleRefresh">
              <n-icon size="22">
                <RefreshCircle />
              </n-icon>
            </n-button>
          </n-space>
          <n-input v-if="iptv" placeholder="Search" clearable v-model:value="value" @input="handleInput">
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
        virtual-scroll
        style="height: 100%;"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { checkM3uUrl } from '@/renderer/utils/iptv'
import type { PlaylistItem } from 'iptv-playlist-parser'
import { NButton } from 'naive-ui'
import { Search, RefreshCircle, Build } from '@vicons/ionicons5'
import { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface'
import { db } from '@/renderer/utils/database/controller/DBTools'
import bus from '../../plugins/mitt'
import { useRouter } from 'vue-router'
import { useStore } from '../../store/video'

const router = useRouter()

const iptv = ref()
const iptvList = ref([])
const iptvRaw = ref([])

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

onMounted(() => {
  getIptvList()
  bus.on('bus.iptv.change', getIptvList)
})

async function getIptvList () {
  const res = await db.all('iptv')
  if (res.length) {
    iptvRaw.value = res
    const arr = []
    for (const i of res) {
      arr.push({ label: i.name, value: i.id })
    }
    iptvList.value = arr
    iptv.value = res[0].id
    getTvList()
  }
}

async function getTvList () {
  let list = []
  for (const i of iptvRaw.value) {
    if (i.id === iptv.value) {
      list = i.list
      break
    }
  }
  data.value = list
}

function handleInput () {
  const txt = value.value.trim()
  if (txt !== '') {
    table.value.filter({ name: [`${txt}`] })
  } else {
    table.value.filter(null)
  }
}

function handlePlay (row: PlaylistItem) {
  const videoStore = useStore()
  const { setVideo } = videoStore
  const data = { video: row, index: 0, type: 'iptv' }
  setVideo(data)
  router.push({ name: 'play' })
}

async function handleRefresh () {
  for (const i of iptvList.value) {
    if (i.id === iptv.value) {
      const { flag, list } = await checkM3uUrl(i.url)
      if (flag) {
        data.value = list
      }
      break
    }
  }
}

async function handleManager () {
  router.push({ name: 'liveManager' })
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
