<template>
  <div class="discovery">
    <div class="header">
      <div class="left">
        <n-select class="select" v-model:value="siteName" :options="sitesStore.getSiteOptions" @update:value="changeSite" />
        <n-select class="select" v-model:value="classVal" :options="classOptions" @update:value="changeClass" />
      </div>
      <div class="right">
        <n-input-group>
          <n-popover trigger="hover" placement="bottom-end">
            <template #trigger>
              <n-button :tertiary="!searchAll" type="primary" @click="searchAll = !searchAll">
                <n-icon size="22"><Compass /></n-icon>
              </n-button>
            </template>
            <span>{{ $t("Discovery.searchAllSites") }}</span>
          </n-popover>
          <n-select
            v-model:value="searchTxt"
            class="searchInput"
            placeholder="Search"
            filterable
            :options="searchOptions"
            :loading="searchLoading"
            clearable
            remote
            :clear-filter-after-select="false"
            @clear="handleClear"
            @search="handleSuggest"
            @update:value="handleSearch"
          />
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
            <n-button size="small" @click="goSettingsView">{{ $t("Discovery.importSites") }}</n-button>
          </template>
        </n-empty>
        <n-empty v-if="emptyVideoList" :description="emptyVideoList"></n-empty>
        <MasonryLayout :list="list" @scrollReachBottom="getMoreVideosList" @itemClick="handleDetail" :breakWidth="200" :isLoading="loading" srcKey="pic" rootId="v_lazy_root">
          <template #supernatant="item">
            <div class="masonry-layout">
              <div class="btns">
                <div class="btns-wrapper">
                  <span @click.stop="handlePlay(item)">{{t('Discovery.play')}}</span>
                  <span @click.stop="handleFavorite(item)">{{t('Discovery.favorite')}}</span>
                </div>
              </div>
              <n-card class="card" embedded content-style="padding: 8px 6px 10px;" @itemClick="handleDetail(item)">
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
import { getSiteById, getVideoList, search, getSearchSuggest } from '@/renderer/utils/movie'
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
const pages = ref(1)
const searchTxt = ref('')

const router = useRouter()
const message = useMessage()

const scrollbar = ref<ScrollbarInst>()
const searchOptions = ref([])
const searchLoading = ref(false)

const sitesStore = useSites()
const { assignClassList, assignSites } = sitesStore

async function getSites () {
  resetValue()
  const dbSites = await assignSites()
  if (!dbSites.length) {
    emptyDesc.value = t('Discovery.siteIsEmpty')
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
  list.value = []
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
    const arr = [...list.value]
    arr.push(...res)
    list.value = arr
    pages.value++
    emptyVideoList.value = ''
  } else {
    emptyVideoList.value = list.value.length === 0 ? t('Discovery.classNoVideo') : ''
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

async function handleSuggest (wd: string) {
  searchLoading.value = true
  const w = wd.trim()
  if (w) searchOptions.value = await getSearchSuggest(wd)
  searchLoading.value = false
}

async function handleSearch () {
  if (!searchTxt.value) return changeSite()
  loading.value = true
  pages.value = 1
  list.value = []
  if (searchAll.value) {
    sites.value.forEach(async site => {
      const res = await search(site.api, searchTxt.value)
      if (searchTxt.value === '') return false
      if (res) {
        list.value.push(...res)
        emptyVideoList.value = ''
      }
    })
  } else {
    const res = await search(site.value.api, searchTxt.value)
    if (res) {
      list.value = res
      emptyVideoList.value = ''
    } else {
      emptyVideoList.value = t('Discovery.noContent')
    }
  }
  loading.value = false
}

function handleClear () {
  searchTxt.value = ''
  searchOptions.value = []
  changeClass()
}

function goSettingsView () {
  router.push({ name: 'siteManager' })
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
  const flag = await db.put<Favorite>('favorites', { detail: item, hasUpdate: false, key }, { key })
  if (!flag) return message.warning(t('Favorites.hasFavorites'))
  message.success(t('Favorites.success'))
}

onMounted(() => {
  getSites()
  bus.on('bus.sites.change', getSites)
  bus.on('bus.class.change', getClassList)
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
        bottom: 65px;
        height: 36px;
        width: 100%;
        z-index: 10;
        transition:all 0.3s ease;

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
