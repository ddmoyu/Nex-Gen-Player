<template>
<div class="play">
  <!-- <div class="header">{{name}}<span class="index" v-show="index !== 0">{{index}}</span></div> -->
  <div class="header">{{name}}<span class="index">{{index}}</span></div>
  <div class="body">
    <video v-show="type === 'player'" id="video" controls></video>
    <iframe v-show="type === 'iframe'" :src="iframeSrc" frameborder="0" width="100%" height="100%"></iframe>
  </div>
  <div class="footer">
    <n-space>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small">
            <n-icon size="22">
              <SyncCircleOutline />
            </n-icon>
          </n-button>
        </template>
        <span>Switch Site</span>
      </n-popover>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small">
            <n-icon size="22">
              <ListCircleOutline />
            </n-icon>
          </n-button>
        </template>
        <span>Playlist</span>
      </n-popover>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small">
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
    </n-space>
    <n-space>
      <n-dropdown :options="menuOptions">
        <n-button quaternary type="primary" size="small">
          <n-icon size="22">
            <Menu />
          </n-icon>
        </n-button>
      </n-dropdown>
    </n-space>
  </div>
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
import { getRealUrl } from '@/renderer/utils/movie'

// const route = useRoute()
const message = useMessage()
const videoStore = useStore()

let player: Hls = null
let video: HTMLMediaElement = null
const name = ref('')
const isFave = ref(false)
const index = ref(0)
const type = ref('player') // player || iframe
const iframeSrc = ref('')

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
  {
    label: 'Skip',
    key: 'skip',
    icon: renderIcon(PlaySkipForwardCircleOutline)
  },
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

async function checkHistoryTime (item: VideoBusPlay) {
  const key = item.video.name + item.video.id
  const res = await db.find<History>('history', { key })
  if (res) {
    return res.time
  } else {
    await db.put<History>('history', { type: item.type, detail: item.video, index: item.index, time: 0, key })
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

async function playVideo (item: VideoBusPlay) {
  const type = item.type
  if (type === 'zy') {
    const time = await checkHistoryTime(item)
    await checkFavorite()
    return playFromZY(item.video as VideoDetailType, item.index, time)
  }
  if (type === 'iptv') {
    return playFromIPTV(item.video as PlaylistItem)
  }
  if (type === 'url') {
    return playFromURL(item.video as HistroyDetailType)
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
  console.log('playFromZY video', item)
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
    if (!res) {
      url = res
    } else {
      type.value = 'iframe'
      iframeSrc.value = item.jiexi + url
    }
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
  }
  .body{
    flex: 1;
    #video{
      width: 100%;
      height: 100%;
      background-color: #000;
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
