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
    <div class="body waterfall-body">
      <V3waterfall
        :list="list"
        :gap="10"
        :colWidth="200"
        srcKey="pic"
        :distanceToScroll="200"
        :isLoading="loading"
        scrollBodySelector=".waterfall-body"
        :isMounted="isMounted"
        @scrollReachBottom="getMoreVideosList"
        class="waterfall">
        <template v-slot:default="slotProp">
          <div class="card">
            <div class="box">
              <div class="img">
                <img :src="slotProp.item.pic" alt="">
              </div>
              <div class="btns"></div>
            </div>
            <div class="info">
              <div class="name">{{slotProp.item.name}}</div>
            </div>
          </div>
        </template>
      </V3waterfall>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getClass, getVideoList, getDetail, search } from '@/renderer/utils/movie'
import { VideoDetailType } from '@/typings/video'
import { Search, Compass } from '@vicons/ionicons5'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/dist/style.css'

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
const list = ref<VideoDetailType[]>([])
const loading = ref(false)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

async function getClassList () {
  // const url = 'http://www.kuaibozy.com/api.php/provide/vod/from/kbm3u8/at/xml/'
  const url = 'https://m3u8.bdxapi.com/api.php/provide/vod/at/xml'
  // const url = 'https://caiji.523zyw.com/inc/seacmsapi.php'
  // const url = 'https://www.siwazyw.tv/api.php/provide/vod/at/xml/'
  // const url = 'https://taopianapi.com/home/cjapi/as/sea/vod/xml'
  // const json = 'https://api.kuapi.cc/api.php/provide/vod/'
  // const json2 = 'https://api.kuapi.cc/api.php/provide/vod/?ac=detail'
  // const xmlres = await getClass(seacms)
  // console.log('xml res: ', xmlres)
  // const jsonres = await getClass(json)
  // console.log('json res: ', jsonres)
  // await getClass(json2)
  // const res = await getClass(url)
  // console.log('res0: ', res)
  const res1 = await getVideoList(url)
  list.value = res1 as VideoDetailType[]
  // const res1 = await getDetail(url, 34750)
  // const res2 = await search(json, '故事')
  console.log('res1: ', res1)
  // const res2 = await getDetail(url, 44059)
  // console.log('res2: ', res2)
  // const res3 = await search(url, '武林')
  // console.log('res3: ', res3)
}

function getMoreVideosList () {
  console.log('getMoreVideosList')
}

onMounted(() => {
  getClassList()
})
</script>
<style lang="scss" scoped>
.discovery{
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
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
    height: calc(100% - 44px);
    border: 1px solid #fff;
    overflow-y: auto;
    overflow-x: hidden;
    .card{
      width: 100%;
      overflow: hidden;
      .box{
        .img{
          img{
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
