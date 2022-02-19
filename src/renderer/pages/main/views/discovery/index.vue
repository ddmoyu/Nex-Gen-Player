<template>
  <div class="discovery">
    <div class="header">
      <div class="left">
        <n-select class="select" v-model:value="siteVal" :options="siteOptions"/>
        <n-select class="select" v-model:value="classVal" :options="classOptions"/>
      </div>
      <div class="right">
        <n-input-group>
          <n-button :tertiary="!searchAll" type="primary" @click="searchAll = !searchAll">
            <n-icon size="22">
              <Compass />
            </n-icon>
          </n-button>
          <n-input class="searchInput" />
          <n-button tertiary type="primary">
            <n-icon size="22">
              <Search />
            </n-icon>
          </n-button>
        </n-input-group>
      </div>
    </div>
    <div class="body"></div>
  </div>
</template>
<script lang="ts" setup>
import { fetchClassByKey } from '@/renderer/api/movie'
import { Search, Compass } from '@vicons/ionicons5'

const siteVal = ref('site')
const siteOptions = ref([
  {
    label: 'site',
    value: 'site'
  }
])
const classVal = ref('class')
const classOptions = ref([
  {
    label: 'class',
    value: 'class'
  }
])
const searchAll = ref(false)

async function getClass () {
  const res = await fetchClassByKey()
  console.log(res)
}
</script>
<style lang="scss" scoped>
.discovery{
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  .header{
    height: 44px;
    display: flex;
    justify-content: space-between;
    .left{
      display: flex;
      .select{
        width: 180px;
        margin-right: 20px;
      }
    }
    .right{
      .searchInput{
        width: 220px;
      }
    }
  }
  .body{
    flex: 1;
    border: 1px solid #fff;
  }
}
</style>
