<template>
  <div class="history">
    <div class="header">
      <n-button tertiary type="primary" @click="handleClear">Clear</n-button>
    </div>
    <div class="list">
      <n-data-table
        ref="table"
        size="small"
        :columns="columns"
        :data="historyList"
        flex-height
        style="height: 100%;"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { db } from '@/renderer/utils/database/controller/DBTools'
import { History } from '@/renderer/utils/database/models/History'
import { NButton } from 'naive-ui'
import { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface'
import { useRouter } from 'vue-router'
import { useStore } from '../../store/video'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const router = useRouter()
const historyList = ref([])
const columns: TableBaseColumn<History>[] = [
  {
    title: 'Name',
    key: 'detail.name',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Type',
    key: 'type',
    width: 100
  },
  {
    title: 'Time',
    key: 'time',
    width: 120,
    render (row: History) {
      const t = row.time
      const m = dayjs.duration(t, 'second').format('HH:mm:ss')
      return m
    }
  },
  {
    title: 'Operator',
    key: 'key',
    width: 160,
    render (row: History) {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handlePlay(row) }, { default: () => 'Play' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleDelete(row) }, { default: () => 'Delete' })
      ])
    }
  }
]

onActivated(() => {
  getHistory()
})

async function getHistory () {
  const list = await db.all('history')
  if (list && list.length) {
    historyList.value = list.reverse()
  } else {
    historyList.value = []
  }
}

async function handlePlay (item: History) {
  const videoStore = useStore()
  const { setVideo } = videoStore
  const data = { video: item.detail, index: item.index, type: item.type }
  setVideo(data)
  router.push({ name: 'play' })
}

async function handleDelete (item: History) {
  await db.delete('history', item.id)
  await getHistory()
}

async function handleClear () {
  await db.clear('history')
  await getHistory()
}
</script>
<style lang="scss" scoped>
.history{
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 10px;
  .header{
    height: 44px;
  }
  .list{
    flex: 1;
  }
}
</style>
