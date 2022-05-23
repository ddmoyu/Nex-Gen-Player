<template>
  <div class="about">
    <n-scrollbar>
      <div class="wrapper">
        <div class="logo">
          <img src="../../../../assets/logo.png" alt="">
        </div>
        <div class="name">Nex-Gen Player 次时代播放器 <span>v0.1.0-beta.1</span></div>
        <div class="link">
          <n-button text @click="linkOpen('https://github.com/ddmoyu/tv')">官网</n-button>
          <n-button text @click="linkOpen('https://github.com/ddmoyu/tv')">Github</n-button>
          <n-button text @click="linkOpen('https://github.com/ddmoyu/tv/releases')">更新日志</n-button>
          <n-button text @click="linkOpen('https://github.com/ddmoyu/tv/discussions')">常见问题</n-button>
          <n-button text @click="linkOpen('https://support.qq.com/product/408964')">问题反馈</n-button>
        </div>
        <div class="donate">
          捐助
        </div>
        <div class="disclaimers">
          所有资源来自网上, 该软件不参与任何制作, 上传, 储存等内容, 禁止传播违法资源. 该软件仅供学习参考, 请于安装后24小时内删除.
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { IpcDirective } from '@/main/ipcEnum'
function linkOpen (url: string) {
  window.ipc.invoke(IpcDirective.SHELL, { url })
}
</script>
<style lang="scss" scoped>
.about{
  flex: 1;
  display: flex;
  padding: 10px;
  overflow-y: auto;
  .wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo{
      margin-top: 40px;
      img{
        width: 140px;
      }
    }
    .name{
      margin-top: 10px;
      font-size: 24px;
      font-weight: bold;
      span{
        font-size: 16px;
        font-weight: 100;
      }
    }
    .link{
      margin-top: 20px;
      button{
        margin: 0 10px;
      }
    }
    .donate{
      margin-top: 20px;
    }
    .disclaimers{
      margin-top: 20px;
      color: red;
      opacity: 0.8;
    }
  }
}
</style>
