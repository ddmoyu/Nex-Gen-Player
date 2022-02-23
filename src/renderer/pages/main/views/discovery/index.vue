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
import { getClass, getVideoList, getDetail, search } from '@/renderer/utils/movie'
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

async function getClassList () {
  // const url = 'http://www.kuaibozy.com/api.php/provide/vod/from/kbm3u8/at/xml/'
  // const url = 'https://m3u8.bdxapi.com/api.php/provide/vod/at/xml'
  // const url = 'https://m3u8.bdxapi.com/api.php/Seacms/vod/'
  // const seacms = 'https://caiji.523zyw.com/inc/seacmsapi.php'
  const seacms = 'https://www.siwazyw.tv/api.php/provide/vod/at/xml/'
  // const seacms = 'https://taopianapi.com/home/cjapi/as/sea/vod/xml'
  const json = 'https://api.kuapi.cc/api.php/provide/vod/'
  // const json2 = 'https://api.kuapi.cc/api.php/provide/vod/?ac=detail'
  // const maccms10 = 'https://caiji.523zyw.com/inc/api.php'
  // const maccms10 = 'https://www.siwazyw.tv/api.php/provide/vod/at/xml/'
  // const maccms10 = 'https://taopianapi.com/home/cjapi/as/mc10/vod/xml'
  // const xmlres = await getClass(seacms)
  // console.log('xml res: ', xmlres)
  // const jsonres = await getClass(json)
  // console.log('json res: ', jsonres)
  // await getClass(json2)
  // const res = await getClass(url)
  // console.log('res0: ', res)
  const res1 = await getVideoList(seacms)
  const res2 = await getVideoList(json)
  console.log('res1: ', res1, res2)
  // const res2 = await getDetail(url, 44059)
  // console.log('res2: ', res2)
  // const res3 = await search(url, '武林')
  // console.log('res3: ', res3)
}

onMounted(() => {
  getClassList()
})
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
