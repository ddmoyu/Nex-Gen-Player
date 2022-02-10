<template>
  <div class="discovery">
    <n-button @click="go">go download</n-button>
    {{sum}}{{dbSum}}
    <n-button @click="add"> + </n-button>
    <n-button @click="addHistory"> history </n-button>
    <n-button @click="getClass">获取分类</n-button>
  </div>
</template>
<script lang="ts" setup>
import { fetchClassByKey } from '@/renderer/api/movie'
import { db } from '@/renderer/utils/database/controller/DBTools'
import { History } from '@/renderer/utils/database/models/History'
import { useRouter } from 'vue-router'
const router = useRouter()
function go () {
  router.push({ name: 'download' })
}
const sum = ref(0)
const dbSum = computed(() => sum.value * 2)
function add () {
  sum.value++
}
function addHistory () {
  const his = new History()
  his.ids = 12314
  db.put<History>('history', his)
}
async function getClass () {
  const res = await fetchClassByKey()
  console.log(res)
}
</script>
<style lang="scss" scoped></style>
