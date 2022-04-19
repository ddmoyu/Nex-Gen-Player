<template>
  <n-layout class="detail">
    <div class="wrapper">
      <div class="header">
        <span>Detail</span>
        <n-button text @click="handleClose"><n-icon size="24"><Close /></n-icon></n-button>
      </div>
      <div class="main">
        <n-scrollbar>
          <div class="item info">
            <div class="left">
              <img :src="video && video.pic" alt="">
              <!-- <img src="../assets/default.png" alt=""> -->
            </div>
            <div class="middle">
              <div class="li name">{{video && video.name}}</div>
              <div class="li">导演: {{video && video.director}}</div>
              <div class="li">主演: {{video && video.actor}}</div>
              <div class="li">类型: {{video && video.class}}</div>
              <div class="li">地区: {{video && video.area}}</div>
              <div class="li">语言: {{video && video.lang}}</div>
              <div class="li">上映: {{video && video.year}}</div>
              <div class="li">更新: {{video && video.last}}</div>
              <div class="li">备注: {{video && video.note}}</div>
            </div>
            <div class="right">
              <div class="li">豆瓣: 10</div>
              <div class="li">IDMB: 10</div>
              <div class="li">烂番茄: 10</div>
            </div>
          </div>
          <div class="item operate">
            <n-button>Play</n-button>
          </div>
          <div class="item description">
            {{video && video.content}}
          </div>
          <div class="item list">
            {{video && video.urls}}
          </div>
        </n-scrollbar>
      </div>
    </div>
  </n-layout>
</template>
<script lang="ts" setup>
import { VideoDetailType } from '@/typings/video'
import { Close } from '@vicons/ionicons5'
import bus from '../pages/main/plugins/mitt'

const video = ref<VideoDetailType>()
const props = defineProps<{ detail: VideoDetailType }>()

function handleClose () {
  bus.emit('bus.detail.show')
}

onMounted(async () => {
  if (props.detail) {
    video.value = props.detail
  }
})
</script>
<style lang="scss" scoped>
.detail{
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header{
      margin-top: 10px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      span{
        font-size: 18px;
      }
    }
    .main{
      flex: 1;
      position: relative;
      overflow-y: auto;
      .item{
        margin: 10px;
        padding: 10px;
        border: 1px solid #63e2b766;
      }
      .info{
        display: flex;
        justify-content: space-between;
        .left{
          width: 240px;
          height: 100%;
          img{
            width: 100%;
            height: auto;
            vertical-align: middle;
          }
        }
        .middle{
          flex: 1;
          margin-left: 30px;
          .name{
            font-size: 20px;
            font-weight: bold;
          }
          .li{
            margin-bottom: 10px;
            word-break:break-all;
            letter-spacing: 1px;
          }
        }
        .right{
          margin-left: 20px;
          width: 100px;
          text-align: justify;
          text-align-last: justify;
          padding-top: 42px;
          .li{
            text-align: justify;
          }
        }
      }
    }
  }
}
</style>
