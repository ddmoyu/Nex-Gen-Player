<template>
  <div class="discovery">
    <div class="header">
      <div class="left">
        <n-select class="select" v-model:value="siteName" :options="siteOptions" @update:value="changeSite"/>
        <n-select class="select" v-model:value="classVal" :options="classOptions" @update:value="changeClass"/>
      </div>
      <div class="right">
        <n-input-group>
          <n-button :tertiary="!searchAll" type="primary" @click="searchAll = !searchAll">
            <n-icon size="22">
              <Compass />
            </n-icon>
          </n-button>
          <n-input class="searchInput" :clearable="true" @clear="handleClear" v-model:value="searchTxt" type="text" @keydown.enter="handleSearch" />
          <n-button tertiary type="primary" @click="handleSearch">
            <n-icon size="22">
              <Search />
            </n-icon>
          </n-button>
        </n-input-group>
      </div>
    </div>
    <div class="body">
      <n-scrollbar class="custom-scrollbar">
        <n-empty v-if="emptyDesc" :description="emptyDesc">
          <template #extra><n-button size="small" @click="goSettingsView">Import sites</n-button></template>
        </n-empty>
        <n-empty v-if="emptyVideoList" :description="emptyVideoList"></n-empty>
        <v3-waterfall
          :list="list"
          :gap="10"
          :bottomGap="10"
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
                <img src="../../../../assets/default.png" alt="">
                <!-- <img :src="slot.item.pic" alt=""> -->
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
        </v3-waterfall>
      </n-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getClass, getSiteById, getVideoList, search } from '@/renderer/utils/movie'
import { VideoDetailType } from '@/typings/video'
import { Search, Compass } from '@vicons/ionicons5'
import { useStore } from '../../store/video'
import { useRouter } from 'vue-router'
import bus from '../../plugins/mitt'
import { db } from '@/renderer/utils/database/controller/DBTools'
import { Favorite } from '@/renderer/utils/database/models/Favorite'
import { Site } from '@/renderer/utils/database/models/Site'
import { useMessage } from 'naive-ui'

const site = ref<Site>()
const sites = ref([])
const siteName = ref()
const siteOptions = ref([])
const emptyDesc = ref('')
const classVal = ref()
const classOptions = ref([])
const searchAll = ref(false)
const list = ref<VideoDetailType[]>([])
const emptyVideoList = ref('')
const loading = ref(false)
const isMounted = ref(false)
const pages = ref(1)
const searchTxt = ref('')

const store = useStore()
const router = useRouter()
const message = useMessage()

async function getSites () {
  const dbSites = await db.all('sites')
  if (!dbSites.length) {
    emptyDesc.value = 'site is empty'
    return false
  } else {
    sites.value = dbSites
    const arr = []
    for (const i of dbSites) {
      if (i.isActive) {
        arr.push({ label: i.name, value: i.id })
      }
    }
    siteOptions.value = arr
    const s = getSiteById(arr[0].value, dbSites)
    if (s) site.value = s
    siteName.value = site.value.id
    getClassList()
  }
}

async function getClassList () {
  const res = await getClass(site.value.api)
  if (res) {
    const arr = []
    for (const i of res.class) {
      arr.push({ label: i._t, value: i.id })
    }
    classOptions.value = arr
    classVal.value = arr[0].value
    list.value = []
    document.querySelector('.waterfall').scrollIntoView(true)
    pages.value = 1
    getMoreVideosList()
  }
}

function changeSite () {
  const s = getSiteById(siteName.value, sites.value)
  if (s) site.value = s
  siteName.value = site.value.id
  getClassList()
}

function changeClass () {
  list.value = []
  document.querySelector('.waterfall').scrollIntoView(true)
  pages.value = 1
  getMoreVideosList()
}

async function getMoreVideosList () {
  if (searchTxt.value) return getMoreSearchList()
  loading.value = true
  const res = await getVideoList(site.value.api, pages.value, classVal.value)
  if (res) {
    const arr = [...list.value]
    arr.push(...res)
    list.value = arr
    pages.value++
    emptyVideoList.value = ''
  } else {
    emptyVideoList.value = 'This class no video, Please change class and try again !'
  }
  loading.value = false
}

async function getMoreSearchList () {
  loading.value = true
  pages.value++
  const res = await search(site.value.api, searchTxt.value)
  if (res) {
    const arr = [...list.value]
    arr.push(...res)
    list.value = arr
    pages.value++
  }
}

async function handleSearch () {
  if (!searchTxt.value) return changeSite()
  loading.value = true
  pages.value = 1
  list.value = []
  document.querySelector('.waterfall').scrollIntoView(true)
  const res = await search(site.value.api, searchTxt.value)
  if (res) {
    list.value = res
    emptyVideoList.value = ''
  } else {
    emptyVideoList.value = 'No content found !'
  }
  loading.value = false
}

function handleClear () {
  pages.value = 1
  list.value = []
  document.querySelector('.waterfall').scrollIntoView(true)
  changeClass()
}

function goSettingsView () {
  router.push({ name: 'settings' })
}

function handleDetail (item: VideoDetailType) {
  console.log(item)
  // router.push({ name: 'play' })
  // store.setVideo(item)
}

function handlePlay (item: VideoDetailType) {
  store.setVideo(item)
  router.push({ name: 'play' })
  bus.emit('bus.video.play', item)
  // console.log('=== handlePlay item ===', item)
}

async function handleFavorite (item: VideoDetailType) {
  const key = item.name + item.id
  const flag = await db.put<Favorite>('favorites', { detail: toRaw(item), hasUpdate: false, key }, { key })
  if (!flag) return message.warning('已收藏，请勿重复收藏')
  message.success('收藏成功')
}

onMounted(() => {
  isMounted.value = true
  getSites()
  bus.on('bus.sites.change', getSites)
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
