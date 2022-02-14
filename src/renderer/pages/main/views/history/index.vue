<template>
  <div class="history">history
    <n-button @click="addHistroy">add</n-button>
  </div>
</template>
<script lang="ts" setup>
import { db } from '@/renderer/utils/database/controller/DBTools'

async function addHistroy () {
  const d = {
    ids: 466,
    name: 'name',
    type: 'type',
    year: 'year',
    index: 1,
    time: 15,
    detail: 'detail'
  }
  const res = await db.put<History>('history', d)
  console.log('res: ', res)
}

</script>
<style lang="scss" scoped></style>
