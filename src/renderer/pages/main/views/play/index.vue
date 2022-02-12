<template>
  <div id="play" class="play">play</div>
</template>
<script lang="ts" setup>
import 'xgplayer'
import HLS from 'xgplayer-hls.js'
onMounted(() => {
  const p = new HLS({
    id: 'play',
    url: ''
  })
  console.log(p)
})
</script>
<style lang="scss" scoped></style>
