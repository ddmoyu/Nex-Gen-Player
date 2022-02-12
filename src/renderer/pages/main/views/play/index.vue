<template>
  <div class="header"></div>
  <div class="body">
    <div id="player" class="player"></div>
  </div>
  <div class="footer"></div>
</template>
<script lang="ts" setup>
import { IPlayerOptions } from 'xgplayer'
import HLS from 'xgplayer-hls.js'

let player
const config = ref<IPlayerOptions>({
  id: 'player',
  url: 'https://v1.cdtlas.com/20210927/cECAezBY/index.m3u8',
  lang: 'en',
  width: '100%',
  height: '100%',
  pip: true,
  autoplay: false,
  videoInit: true,
  airplay: true,
  defaultPlaybackRate: 1,
  playbackRate: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5]
})

function init () {
  player = new HLS(config.value)
  // player.src = ''
}

onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
.header{
  height: 40px;
}
.body{
  flex: 1;
}
.footer{
  height: 40px;
}
</style>
