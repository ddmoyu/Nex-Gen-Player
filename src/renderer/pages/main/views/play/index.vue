<template>
<div class="play">
  <div class="header"></div>
  <div class="body">
    <div id="player" class="player"></div>
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
import { IPlayerOptions } from 'xgplayer'
import HLS from 'xgplayer-hls.js'
import { SyncCircleOutline, ListCircleOutline, Time, Heart, HeartOutline, ArrowDownCircleOutline, ShareSocialOutline, PlayCircleOutline, PlaySkipForwardCircleOutline, DocumentTextOutline, Menu } from '@vicons/ionicons5'
import { NIcon, useMessage } from 'naive-ui'
import bus from '../../plugins/mitt'
import { VideoDetailType } from '@/typings/video'
import { useStore } from '../../store/video'

let player: HLS
const config = ref<IPlayerOptions>({
  id: 'player',
  url: '',
  lang: 'en',
  width: '100%',
  height: '100%',
  pip: true,
  autoplay: true,
  defaultPlaybackRate: 1,
  playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5]
})

const store = useStore()
const message = useMessage()
const detail = ref<VideoDetailType>()

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
  const view = store.view
  const video = store.video as VideoDetailType
  if (!video.urls.length) return message.warning('视频地址解析失败，请换源后重新尝试~')
  player = new HLS(config.value as IPlayerOptions)
  message.success('视频地址解析成功，等待加载播放~')
  if (view === 'discovery') {
    const url = video.urls[0]
    player.src = url
    player.play()
  }
}

function playVideo (item: VideoDetailType) {
  detail.value = item
  if (!item.urls.length) return message.warning('视频地址解析失败，请换源后重新尝试~')
  if (!player) {
    player = new HLS(config.value as IPlayerOptions)
  }
  const url = item.urls[0]
  player.src = url
  player.play()
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
  }
  .footer{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
