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
    <div class="body waterfall-bod">
      <n-scrollbar>
        <V3waterfall
          :list="list"
          :gap="10"
          :colWidth="220"
          srcKey="pic"
          :distanceToScroll="100"
          :isLoading="loading"
          scrollBodySelector=".n-scrollbar-container"
          :isMounted="isMounted"
          @scrollReachBottom="getMoreVideosList"
          class="waterfall">
          <template #default="slot">
            <n-card class="card" embedded content-style="padding: 8px 6px 10px;" @click="handleDetail(slot.item)">
              <template #cover>
                <img :src="slot.item.pic" alt="">
                <div class="btns">
                  <div class="btns-wrapper">
                    <span @click.stop="handlePlay(slot.item)">Play</span>
                    <span @click.stop="handleFavorite(slot.item)">Favorite</span>
                  </div>
                </div>
              </template>
              <n-ellipsis class="name" style="max-width: 100%">
                {{slot.item.name}}
              </n-ellipsis>
              <div class="info">
                <span>{{slot.item.area}}</span>
                <span>{{slot.item.class}}</span>
                <span>{{slot.item.note}}</span>
              </div>
            </n-card>
          </template>
        </V3waterfall>
      </n-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getClass, getVideoList, getDetail, search } from '@/renderer/utils/movie'
import { VideoDetailType } from '@/typings/video'
import { Search, Compass } from '@vicons/ionicons5'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/dist/style.css'
import { useStore } from '../../store/video'
import { useRouter } from 'vue-router'
import bus from '../../plugins/mitt'

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

const store = useStore()
const router = useRouter()

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
  return true
}

function getMoreVideosList () {
  loading.value = true
  console.log('getMoreVideosList')
}

function handleDetail (item: VideoDetailType) {
  router.push({ name: 'play' })
  store.setVideo(item)
}

function handlePlay (item: VideoDetailType) {
  store.setVideo(item)
  router.push({ name: 'play' })
  bus.emit('bus.video.play', item)
  console.log('=== handlePlay item ===', item)
}

function handleFavorite (item: VideoDetailType) {
  router.push({ name: 'play' })
  console.log('=== handleFavorite item ===', item)
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
    .card{
      width: 100%;
      cursor: pointer;
      :deep(.n-card-cover){
        position: relative;
        .btns{
          display: none;
          position: absolute;
          bottom: 0;
          height: 36px;
          width: 100%;
          transform: 0.3s;
          .btns-wrapper{
            display: flex;
            height: 100%;
            width: 100%;
            justify-content: space-between;
            span{
              flex: 0.5;
              display: flex;
              height: 100%;
              color: #cdcdcd;
              align-items: center;
              justify-content: center;
              background-color: rgba(45, 45, 45, 0.7);
              &:hover{
                color: #dedede;
                background-color: rgba(7, 7, 7, 0.8);
              }
            }
          }
        }
      }
      &:hover{
        .btns{
          display: block;
        }
      }
      .info{
        margin-top: 4px;
        font-size: 12px;
        opacity: 0.9;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
