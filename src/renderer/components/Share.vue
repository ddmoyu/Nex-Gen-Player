<template>
  <n-layout class="share">
    <div class="share-wrapper">
      <div class="left">
        <img :src="video.pic" alt="">
      </div>
      <div class="right">
        <div class="title">{{video.name}}</div>
        <QRCodeVue3 myclass="qrcode" imgclass="qrcodeImg"
          :qrOptions="{ errorCorrectionLevel: 'L' }"
          :dotsOptions="{ type: 'rounded' }"
          :cornersSquareOptions="{ type: 'square' }"
          :cornersDotOptions="{ type: 'square' }"
          :value="link" :width="160" :height="160" />
        <div class="tips">
          <p>长按二维码，识别播放。</p>
          <p><img src="@/renderer/assets/logo.png"></p>
          <p class="zy">『Nex-Gen Player』严禁传播违法资源。</p>
        </div>
      </div>
    </div>
  </n-layout>
</template>
<script lang="ts" setup>
import { VideoDetailType } from '@/typings/video'
import QRCodeVue3 from 'qrcode-vue3'
import html2canvas from 'html2canvas'
import { IpcDirective } from '@/main/ipcEnum'

const props = defineProps<{ detail: VideoDetailType }>()
const video = ref<VideoDetailType>()
const link = ref('')

onBeforeMount(() => {
  video.value = props.detail
  link.value = 'http://hunlongyu.gitee.io/zy-player-web?url=' + video.value.urls[0]
  console.log('link', link.value)
})

onMounted(() => {
  const dom = document.querySelector('.share') as HTMLElement
  setTimeout(() => {
    html2canvas(dom, { useCORS: true }).then(res => {
      const png = res.toDataURL('image/png')
      window.ipc.invoke(IpcDirective.COPY, { type: 'image', data: png })
    })
  }, 1000)
})
</script>
<style lang="scss">
.qrcode{
  display: flex;
  justify-content: center;
}
</style>
<style lang="scss" scoped>
.share{
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 540px;
  height: 360px;
  z-index: 9999;
  .n-layout-scroll-container {
    width: 100%;
    .share-wrapper{
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      height: 100%;
      .left{
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          height: 320px;
          width: auto;
          max-width: 240px;
        }
      }
      .right{
        width: 50%;
        height: calc(100% - 20px);
        padding: 10px;
        .title{
          font-size: 18px;
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: center;
        }
        .tips{
          font-size: 14px;
          text-align: center;
          img{
            width: 50px;
          }
          .zy{
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
