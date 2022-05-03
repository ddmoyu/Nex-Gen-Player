<template>
  <div class="discovery">
    <div class="header">
      <div class="left">
        <n-select class="select" v-model:value="siteName" :options="sitesStore.getSiteOptions"
          @update:value="changeSite" />
        <n-select class="select" v-model:value="classVal" :options="classOptions" @update:value="changeClass" />
      </div>
      <div class="right">
        <n-input-group>
          <n-button :tertiary="!searchAll" type="primary" @click="searchAll = !searchAll">
            <n-icon size="22">
              <Compass />
            </n-icon>
          </n-button>
          <n-input class="searchInput" :clearable="true" @clear="handleClear" v-model:value="searchTxt" type="text"
            @keydown.enter="handleSearch" />
          <n-button tertiary type="primary" @click="handleSearch">
            <n-icon size="22">
              <Search />
            </n-icon>
          </n-button>
        </n-input-group>
      </div>
    </div>
    <div class="body">
      <n-scrollbar id="v_lazy_root" class="custom-scrollbar" ref="scrollbar">
        <n-empty v-if="emptyDesc" :description="emptyDesc">
          <template #extra>
            <n-button size="small" @click="goSettingsView">Import sites</n-button>
          </template>
        </n-empty>
        <n-empty v-if="emptyVideoList" :description="emptyVideoList"></n-empty>
        <MasonryLayout :list="list" @scrollReachBottom="getMoreVideosList" :isLoading="loading">
          <template #supernatant="item">
            <div class="masonry-layout">
              <div class="btns">
                <div class="btns-wrapper">
                  <span @click.stop="handlePlay(item)">Play</span>
                  <span @click.stop="handleFavorite(item)">Favorite</span>
                </div>
              </div>
              <n-card class="card" embedded content-style="padding: 8px 6px 10px;" @click="handleDetail(item)">
                <n-ellipsis class="name" style="max-width: 100%">
                  {{ item.name }}
                </n-ellipsis>
                <div class="info">
                  <span>{{ item.area }}</span>
                  <span>{{ item.class }}</span>
                  <span>{{ item.note }}</span>
                </div>
              </n-card>
            </div>
          </template>
        </MasonryLayout>
      </n-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MasonryLayout from '../../components/masonry-layout/MasonryLayout.vue'
import { getSiteById, getVideoList, search } from '@/renderer/utils/movie'
import { VideoDetailType } from '@/typings/video'
import { Search, Compass } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import bus from '../../plugins/mitt'
import { db } from '@/renderer/utils/database/controller/DBTools'
import { Favorite } from '@/renderer/utils/database/models/Favorite'
import { Site } from '@/renderer/utils/database/models/Site'
import { ScrollbarInst, useMessage } from 'naive-ui'
import { useSites } from '../../store/sites'
import { useStore } from '../../store/video'

const site = ref<Site>()
const sites = ref([])
const siteName = ref()
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

const router = useRouter()
const message = useMessage()

const scrollbar = ref<ScrollbarInst>()

// sites store
const sitesStore = useSites()
const { assignClassList, assignSites } = sitesStore
async function getSites () {
  const dbSites = await assignSites()
  // const dbSites = await db.all('sites')
  if (!dbSites.length) {
    emptyDesc.value = 'site is empty'
    return false
  } else {
    emptyDesc.value = ''
    sites.value = dbSites
    const s = getSiteById(dbSites[0].id, dbSites)
    if (s) site.value = s
    siteName.value = site.value.id
    getClassList()
  }
}
function resetValue () {
  list.value = []
  pages.value = 1
  emptyVideoList.value = ''
}

async function getClassList () {
  const res = await assignClassList(site.value)
  scrollbar.value.scrollTo({ top: 0 })
  classOptions.value = res
  classVal.value = res[0].value
  getMoreVideosList()
}

function changeSite () {
  resetValue()
  const s = getSiteById(siteName.value, sites.value)
  if (s) site.value = s
  siteName.value = site.value.id
  classVal.value = ''
  classOptions.value = []
  list.value = []
  getClassList()
}

function changeClass () {
  scrollbar.value.scrollTo({ top: 0 })
  resetValue()
  getMoreVideosList()
}

async function getMoreVideosList () {
  if (searchTxt.value) return getMoreSearchList()
  loading.value = true
  const res = await getVideoList(site.value.api, pages.value, classVal.value)
  if (res) {
    console.log(res)
    const arr = [...list.value]
    arr.push(...res)
    list.value = arr
    pages.value++
    emptyVideoList.value = ''
  } else {
    emptyVideoList.value = list.value.length === 0 ? 'This class no video, Please change class and try again !' : ''
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
  bus.emit('bus.detail.show', item)
}

function handlePlay (item: VideoDetailType) {
  const videoStore = useStore()
  const { setVideo } = videoStore
  const data = { video: item, index: 0, type: 'zy' }
  setVideo(data)
  router.push({ name: 'play' })
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
.discovery {
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  padding: 10px;

  .header {
    height: 44px;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;

      .select {
        width: 180px;
        margin-right: 20px;
      }
    }

    .right {
      .searchInput {
        width: 220px;
      }
    }
  }

  .body {
    height: calc(100% - 44px);

    .custom-scrollbar {
      padding: 20px;
    }

    .masonry-layout {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: flex-end;
      position: relative;
      cursor: pointer;

      .btns {
        display: none;
        position: absolute;
        bottom: 66px;
        height: 36px;
        width: 100%;
        transform: 0.3s;

        .btns-wrapper {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: space-between;

          span {
            cursor: pointer;
            flex: 0.5;
            display: flex;
            color: #cdcdcd;
            align-items: center;
            justify-content: center;
            background-color: rgba(45, 45, 45, 0.7);

            &:hover {
              color: #dedede;
              background-color: rgba(7, 7, 7, 0.8);
            }
          }
        }
      }
    }

    :deep(.img-container) {
      &:hover {
        .btns {
          display: block;
        }
      }
    }

    .card {
      width: 100%;
      cursor: pointer;

      :deep(.n-card-cover) {
        position: relative;
        overflow: unset;

      }

      .info {
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
