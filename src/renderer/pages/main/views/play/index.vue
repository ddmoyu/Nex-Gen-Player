<template>
<div class="play">
  <div class="header"></div>
  <div class="body">
    <video id="video" controls></video>
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
          <n-button quaternary type="primary" size="small">
            <n-icon size="22">
              <Heart />
              <HeartOutline />
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
import { NIcon } from 'naive-ui'
import bus from '../../plugins/mitt'
import { VideoBusPlay, VideoDetailType, HistroyDetailType } from '@/typings/video'
import { useStore } from '../../store/video'
// import { useRoute } from 'vue-router'
import type { PlaylistItem } from 'iptv-playlist-parser'
import Hls from 'hls.js'

// const route = useRoute()
// const message = useMessage()
const videoStore = useStore()

let player: Hls = null
let video: HTMLMediaElement = null
const detail = ref<VideoBusPlay>()
let oldType = ''

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
  detail.value = videoStore.video
  playVideo(detail.value)
}

function playVideo (item: VideoBusPlay) {
  const type = item.type
  if (type === 'zy') {
    return playFromZY(item.video as VideoDetailType, oldType === type)
  }
  if (type === 'iptv') {
    return playFromIPTV(item.video as PlaylistItem, oldType === type)
  }
  if (type === 'url') {
    return playFromURL(item.video as HistroyDetailType, oldType === type)
  }
}

function playError () {
  player.once(Hls.Events.ERROR, (e, d) => {
    console.log('=== playError ===', e, d)
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
          console.log('=== player error ===', player)
          break
      }
    }
  })
}

async function playFromZY (item: VideoDetailType, flag: boolean) {
  console.log('playFromZY video', item)
  const url = item.urls[0]
  if (!url) return false
  if (!flag && oldType !== '') {
    console.log('0000')
    video.pause()
    player.destroy()
    player = new Hls()
  }
  nextTick(() => {
    player.attachMedia(video)
    player.once(Hls.Events.MEDIA_ATTACHED, () => {
      player.loadSource(url)
      video.play()
      oldType = 'zy'
    })
    playError()
  })
}
async function playFromIPTV (item: HistroyDetailType, flag: boolean) {
  console.log('playFromIPTV item', item)
  const url = item.url
  if (!url) return false
  if (!flag && oldType !== '') {
    console.log('1111')
    video.pause()
    player.destroy()
    player = new Hls()
  }
  nextTick(() => {
    player.attachMedia(video)
    player.once(Hls.Events.MEDIA_ATTACHED, () => {
      player.loadSource(url)
      video.play()
      oldType = 'iptv'
    })
    playError()
  })
}
async function playFromURL (video: HistroyDetailType, flag: boolean) {
  console.log('playFromURL video', video, flag)
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
  }
  .body{
    flex: 1;
    #video{
      width: 100%;
      height: 100%;
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
