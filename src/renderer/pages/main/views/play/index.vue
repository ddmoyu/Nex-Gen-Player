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
              <DocumentTextOutline />
            </n-icon>
          </n-button>
        </template>
        <span>Detail</span>
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
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small">
            <n-icon size="22">
              <ArrowDownCircleOutline />
            </n-icon>
          </n-button>
        </template>
        <span>Download</span>
      </n-popover>
      <n-popover trigger="hover" placement="top-start">
        <template #trigger>
          <n-button quaternary type="primary" size="small">
            <n-icon size="22">
              <PlaySkipForwardCircleOutline />
              <PlaySkipForwardCircle />
            </n-icon>
          </n-button>
        </template>
        <span>Skip</span>
      </n-popover>
    </n-space>
    <n-space>
      <n-dropdown :options="menuOptions">
        <n-button>More</n-button>
      </n-dropdown>
    </n-space>
  </div>
</div>
</template>
<script lang="ts" setup>
import { IPlayerOptions } from 'xgplayer'
import HLS from 'xgplayer-hls.js'
import { SyncCircleOutline, ListCircleOutline, Time, Heart, HeartOutline, ArrowDownCircleOutline, ShareSocialOutline, PlayCircleOutline, PlaySkipForwardCircleOutline, PlaySkipForwardCircle, DocumentTextOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'

let player: HLS
const config = ref<IPlayerOptions>({
  id: 'player',
  url: '',
  lang: 'en',
  width: '100%',
  height: '100%',
  pip: true,
  autoplay: true,
  videoInit: true,
  airplay: true,
  defaultPlaybackRate: 1,
  playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5]
})

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const menuOptions = ref([
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
  player = new HLS(config.value as IPlayerOptions)
  nextTick(() => {
    player.src = 'https://v1.cdtlas.com/20210927/cECAezBY/index.m3u8'
    player.play()
  })
}

onMounted(() => {
  init()
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
