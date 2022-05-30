<template>
  <div class="history">
    <div class="header">
      <n-button tertiary type="primary" @click="handleClear">{{$t('History.clear')}}</n-button>
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
import { useI18n } from 'vue-i18n'

dayjs.extend(duration)

const { t } = useI18n()
const router = useRouter()
const historyList = ref([])
const columns: TableBaseColumn<History>[] = [
  {
    title: t('History.name'),
    key: 'detail.name',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: t('History.type'),
    key: 'type',
    width: 100
  },
  {
    title: t('History.time'),
    key: 'time',
    width: 120,
    render (row: History) {
      const t = row.time
      const m = dayjs.duration(t, 'second').format('HH:mm:ss')
      return m
    }
  },
  {
    title: t('History.action'),
    key: 'key',
    width: 160,
    render (row: History) {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handlePlay(row) }, { default: () => t('History.play') }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleDelete(row) }, { default: () => t('History.delete') })
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
