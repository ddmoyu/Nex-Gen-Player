<template>
<div class="play">
  <div class="header">{{name}}<span class="index" v-show="index && index !== 0">第{{index + 1}}集</span></div>
  <div class="body">
    <video v-show="type === 'player'" id="video" controls></video>
    <iframe v-show="type === 'iframe'" :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
  </div>
  <div class="footer">
    <n-space>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small" @click="handleSwitchSites">
            <n-icon size="22">
              <SyncCircleOutline />
            </n-icon>
          </n-button>
        </template>
        <span>Switch Site</span>
      </n-popover>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small" @click="handleHistory">
            <n-icon size="22">
              <Time />
            </n-icon>
          </n-button>
        </template>
        <span>History</span>
      </n-popover>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small" @click="handleFavorite">
            <n-icon size="22">
              <Heart v-show="isFave" />
              <HeartOutline v-show="!isFave" />
            </n-icon>
          </n-button>
        </template>
        <span>Favorites</span>
      </n-popover>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small" @click="handlePlaylist">
            <n-icon size="22">
              <ListCircleOutline />
            </n-icon>
          </n-button>
        </template>
        <span>Playlist</span>
      </n-popover>
    </n-space>
    <n-space>
      <n-dropdown :options="menuOptions" @select="handleMenuSelect">
        <n-button quaternary type="primary" size="small">
          <n-icon size="22">
            <Menu />
          </n-icon>
        </n-button>
      </n-dropdown>
    </n-space>
  </div>
  <n-drawer v-model:show="siteListShow" :width="300" :height="'100%'" :placement="'right'" :trap-focus="false" :block-scroll="false" to=".body" >
    <n-drawer-content title="Switch Site">
      <n-scrollbar class="playlist">
        <div class="item" v-for="(i, j) in siteList" :key="j">
          <n-popover trigger="hover" placement="bottom-end">
            <template #trigger>
              <n-button text type="primary" @click="handlePlaySitelistPlay(i)">{{i.name}}</n-button>
            </template>
            <template #header>
              <n-text strong depth="1">
                {{i.name}}
              </n-text>
            </template>
            {{i.class}} - {{i.area}}
          </n-popover>
        </div>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
  <n-drawer v-model:show="playListShow" :width="200" :height="'100%'" :placement="'right'" :trap-focus="false" :block-scroll="false" to=".body" >
    <n-drawer-content title="Playlist">
      <n-scrollbar class="playlist">
        <div class="item" v-for="(i, j) in playList" :key="j">
          <n-button text type="primary" @click="handlePlaylistPlay(j)"> 第 {{j + 1}} 集 </n-button>
        </div>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
  <n-drawer v-model:show="historyShow" :width="300" :height="'100%'" :placement="'right'" :trap-focus="false" :block-scroll="false" to=".body" >
    <n-drawer-content title="Histroy">
      <n-scrollbar class="playlist">
        <div class="item" v-for="(i, j) in historyList" :key="j">
          <n-button text type="primary" @click="handleHistoryPlay(i)">{{i.detail.name}}</n-button>
        </div>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</div>
</template>
<script lang="ts" setup>
import { SyncCircleOutline, ListCircleOutline, Time, Heart, HeartOutline, ArrowDownCircleOutline, ShareSocialOutline, PlayCircleOutline, PlaySkipForwardCircleOutline, DocumentTextOutline, Menu } from '@vicons/ionicons5'
import { NIcon, useMessage } from 'naive-ui'
import bus from '../../plugins/mitt'
import { VideoBusPlay, VideoDetailType, HistroyDetailType } from '@/typings/video'
import { useStore } from '../../store/video'
// import { useRoute } from 'vue-router'
import type { PlaylistItem } from 'iptv-playlist-parser'
import Hls from 'hls.js'
import { useThrottleFn } from '@vueuse/shared'
import { db } from '@/renderer/utils/database/controller/DBTools'
import { History } from '@/renderer/utils/database/models/History'
import { Favorite } from '@/renderer/utils/database/models/Favorite'
import { cloneDeep } from 'lodash'
import { getRealUrl, search } from '@/renderer/utils/movie'
import { IpcDirective } from '@/main/ipcEnum'
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'

// const route = useRoute()
const message = useMessage()
const videoStore = useStore()

let player: Hls = null
let video: HTMLMediaElement = null
const name = ref('')
const isFave = ref(false)
const index = ref(0)
const from = ref('zy')
const type = ref('player') // player || iframe
const iframeSrc = ref('')
const siteList = ref([])
const siteListShow = ref(false)
const playList = ref([])
const playListShow = ref(false)
const historyList = ref([])
const historyShow = ref(false)

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const menuOptions = ref([
  {
    label: 'Detail',
    key: 'detail',
    icon: renderIcon(DocumentTextOutline)
  },
  {
    label: 'Download',
    key: 'download',
    icon: renderIcon(ArrowDownCircleOutline)
  },
  // {
  //   label: 'Skip',
  //   key: 'skip',
  //   icon: renderIcon(PlaySkipForwardCircleOutline)
  // },
  {
    label: 'Other Player',
    key: 'otherPlayer',
    icon: renderIcon(PlayCircleOutline)
  },
  {
    label: 'Share',
    key: 'share',
    icon: renderIcon(ShareSocialOutline)
  }
])

function init () {
  if (Hls.isSupported() && !player) {
    video = document.getElementById('video') as HTMLMediaElement
    player = new Hls()
  }
  name.value = ''
  playVideo(videoStore.video)
}

async function playVideo (item: VideoBusPlay) {
  from.value = item.type
  if (item.type === 'zy') {
    const time = await checkHistoryTime(item)
    await checkFavorite()
    index.value = item.index || 0
    return await playFromZY(item.video as VideoDetailType, item.index, time)
  }
  if (item.type === 'iptv') {
    return playFromIPTV(item.video as PlaylistItem)
  }
  if (item.type === 'url') {
    return playFromURL(item.video as HistroyDetailType)
  }
}

async function checkHistoryTime (item: VideoBusPlay) {
  const key = item.video.name + item.video.id
  const res = await db.find<History>('history', { key })
  if (res) {
    return res.time
  } else {
    await db.put<History>('history', { type: item.type, detail: cloneDeep(item.video), index: item.index, time: 0, key })
  }
  return 0
}

async function checkFavorite () {
  const vs = videoStore.video
  const key = vs.video.name + vs.video.id
  const res = await db.find<Favorite>('favorites', { key })
  if (res) {
    isFave.value = true
  } else {
    isFave.value = false
  }
}

async function handleFavorite () {
  const vs = videoStore.video
  const key = vs.video.name + vs.video.id
  const res = await db.find<Favorite>('favorites', { key })
  if (res) {
    await db.delete('favorites', res.id)
    isFave.value = false
  } else {
    await db.put<Favorite>('favorites', { detail: cloneDeep(vs.video), hasUpdate: false, key }, { key })
    isFave.value = true
  }
}

function playError () {
  player.once(Hls.Events.ERROR, (e, d) => {
    if (d.fatal) {
      switch (d.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          player.startLoad()
          break
        case Hls.ErrorTypes.MEDIA_ERROR:
          player.recoverMediaError()
          break
        default:
          player.destroy()
          break
      }
    }
  })
}

function reset () {
  video.removeEventListener('timeupdate', recordTime)
}
function playing () {
  video.addEventListener('timeupdate', recordTime)
}

const recordTime = useThrottleFn(async () => {
  const time = video.currentTime
  const vs = videoStore.video
  const key = vs.video.name + vs.video.id
  const res = await db.find<History>('history', { key })
  if (res) await db.update<History>('history', res.id, { time })
}, 5000)

async function playFromZY (item: VideoDetailType, index = 0, time = 0) {
  let list = []
  let urlType = 'm3u8'
  type.value = 'player'
  if (item.urls.length) {
    list = item.urls
  } else {
    if (!item.jxUrls.length) return false
    list = item.jxUrls
    urlType = 'jiexi'
  }
  let url = list[index]
  if (!url) {
    message.warning('未发现视频链接')
    return false
  }
  if (urlType === 'jiexi') {
    const res = await getRealUrl(url, item.jiexi)
    if (res) {
      url = res
    } else {
      type.value = 'iframe'
      iframeSrc.value = item.jiexi + url
    }
  }
  try {
    if (type.value === 'iframe') {
      return false
    }
    reset()
    name.value = item.name
    player.destroy()
    player = new Hls()
    player.attachMedia(video)
    player.once(Hls.Events.MEDIA_ATTACHED, () => {
      player.loadSource(url)
      if (time) video.currentTime = time
      video.play()
      playing()
    })
    playError()
  } catch (_) {
    message.warning('播放失败，请重试')
  }
}
async function playFromIPTV (item: HistroyDetailType) {
  console.log('playFromIPTV item', item)
  const url = item.url
  if (!url) return false
  type.value = 'player'
  reset()
  name.value = item.name
  player.destroy()
  player = new Hls()
  player.attachMedia(video)
  player.once(Hls.Events.MEDIA_ATTACHED, () => {
    player.loadSource(url)
    video.play()
    playing()
  })
  playError()
}
async function playFromURL (item: HistroyDetailType) {
  console.log('playFromURL video', item)
  const url = item.url
  if (!url) return false
  type.value = 'player'
  reset()
  player.destroy()
  player = new Hls()
  player.attachMedia(video)
  player.once(Hls.Events.MEDIA_ATTACHED, () => {
    player.loadSource(url)
    video.play()
    playing()
  })
  playError()
}

function handlePlaylist () {
  const video = videoStore.video.video as VideoDetailType
  playListShow.value = true
  if (type.value === 'player') {
    playList.value = video.urls
  } else if (type.value === 'iframe') {
    playList.value = video.jxUrls
  } else {
    playList.value = []
  }
}
async function handlePlaylistPlay (idx: number) {
  const video = videoStore.video.video as VideoDetailType
  index.value = idx || 0
  await playFromZY(video, idx, 0)
}

async function handleSwitchSites () {
  const sites = await db.all('sites')
  const list = sites.filter(i => i.isActive)
  siteList.value = []
  list.forEach(async site => {
    const res = await search(site.api, name.value)
    if (res) {
      siteList.value.push(...res)
    }
  })
  siteListShow.value = true
}
async function handlePlaySitelistPlay (v: VideoDetailType) {
  const data = { video: v, index: 0, type: 'zy' }
  const { setVideo } = videoStore
  const time = video.currentTime
  setVideo(data)
  return await playFromZY(v, 0, time)
}
async function handleHistory () {
  const list = await db.all('history')
  if (list && list.length) {
    historyList.value = list.reverse()
  } else {
    historyList.value = []
  }
  historyShow.value = true
}
async function handleHistoryPlay (item: History) {
  if (item.type === 'zy') {
    const detail = item.detail as VideoDetailType
    const data = { video: detail, index: item.index, type: 'zy' }
    const { setVideo } = videoStore
    setVideo(data)
    return await playFromZY(detail, item.index, item.time)
  }
  if (item.type === 'url') {
    const detail = item.detail as HistroyDetailType
    const data = { video: detail, index: item.index, type: 'url' }
    const { setVideo } = videoStore
    setVideo(data)
    return playFromURL({ name: detail.name, url: detail.url })
  }
}
// TODO
async function handleMenuSelect (key: string | number) {
  if (key === 'detail') {
    if (videoStore.video.type === 'zy') {
      bus.emit('bus.detail.show', videoStore.video.video)
    } else {
      message.warning('非资源视频，无详情介绍')
    }
    return false
  }
  if (key === 'download') {
    if (type.value === 'player') {
      const video = videoStore.video.video
      const url = video.urls[index.value]
      window.ipc.invoke(IpcDirective.COPY, { type: 'text', data: url })
    } else {
      message.warning('无法下载')
    }
    return false
  }
  if (key === 'otherPlayer') {
    const otherPlayer = await settingsDB.getSetting('player')
    if (!otherPlayer) {
      message.warning('请先设置播放器软件路径')
    } else {
      const video = videoStore.video.video
      const url = video.urls[index.value]
      window.ipc.invoke(IpcDirective.PLAY_WITH, { path: otherPlayer, urls: url })
    }
    return false
  }
  if (key === 'share') {
    if (videoStore.video.type === 'zy') {
      bus.emit('bus.share.show', videoStore.video.video)
    } else {
      message.warning('非资源视频，无法分享')
    }
    return false
  }
}

onMounted(() => {
  init()
  bus.on('bus.video.play', playVideo)
})
</script>
<style lang="scss" scoped>
.play{
  height: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  .header{
    height: 40px;
    display: flex;
    align-items: center;
    .index{
      margin-left: 10px;
      opacity: 0.5;
      font-size: 12px;
      vertical-align: baseline;
    }
  }
  .body{
    height: calc(100% - 80px);
    #video{
      width: 100%;
      height: 100%;
      background-color: #000;
      object-fit: contain;
    }
  }
  .footer{
    margin-top: 10px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
