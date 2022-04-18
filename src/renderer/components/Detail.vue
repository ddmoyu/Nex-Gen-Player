<template>
  <n-layout class="detail">
    <div class="header" v-if="show">
      <span>Detail</span>
      <n-button text><n-icon size="24"><Close /></n-icon></n-button>
    </div>
    <div class="item info">
      <div class="left">
        <!-- <img :src="video && video.pic" alt=""> -->
        <img src="../assets/default.png" alt="">
      </div>
      <div class="right">
        <div class="li">{{video && video.name}}</div>
        <div class="li">{{video && video.director}}</div>
        <div class="li">{{video && video.actor}}</div>
        <div class="li">{{video && video.class}}</div>
        <div class="li">{{video && video.area}}</div>
        <div class="li">{{video && video.lang}}</div>
        <div class="li">{{video && video.year}}</div>
        <div class="li">{{video && video.last}}</div>
        <div class="li">{{video && video.note}}</div>
      </div>
    </div>
    <div class="item operate">
      <n-button>Play</n-button>
    </div>
    <div class="item description">
      <!-- {{video && video.content}} -->
    </div>
    <div class="item list">
      <!-- {{video && video.urls}} -->
    </div>
  </n-layout>
</template>
<script lang="ts" setup>
import { VideoDetailType } from '@/typings/video'
import { Close } from '@vicons/ionicons5'
import { db } from '../utils/database/controller/DBTools'

const video = ref<VideoDetailType>()
const show = ref(false)

onMounted(async () => {
  const res = await db.get('favorites', 1)
  video.value = res.detail
  show.value = true
  console.log('=== video ===', video.value)
})
</script>
<style lang="scss" scoped>
.detail{
  position: absolute;
  top: 0;
  left: 60px;
  z-index: 90;
  width: calc(100% - 60px);
  height: 100%;
  box-sizing: border-box;
  .header{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }
  .item{
    margin: 10px;
    padding: 10px;
    border: 1px solid #63e2b766;
  }
  .info{
    display: flex;
  }
}
</style>
