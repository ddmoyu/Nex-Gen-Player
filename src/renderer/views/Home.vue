<template>
  <n-layout class="container">
    <n-layout-header>
      <Frame />
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider :width="60">
        <Aside />
      </n-layout-sider>
      <n-layout-content>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </n-layout-content>
      <!-- <n-drawer v-model:show="detailShow" placement="right" width="90%">
        <n-drawer-content title="Detail">
          <detail :detail="videoDetail" />
        </n-drawer-content>
      </n-drawer> -->
      <!-- <Share :detail="videoDetail" v-if="shareShow" v-on-click-outside="handleCloseShare" /> -->
    </n-layout>
    <n-layout-footer>
      <Footer />
    </n-layout-footer>
  </n-layout>
</template>
<script lang="ts" setup>
import { settingsDB } from '../utils/database/controller/settingsDB'
import { useMessage } from 'naive-ui'
// import { IpcDirective } from '@/main/ipcEnum'
// import { useI18n } from 'vue-i18n'
import bus from '../plugins/mitt'
import { VideoDetailType } from '../../../typings/video'
import { vOnClickOutside } from '@vueuse/components'

// window.$message = useMessage()

// const { locale } = useI18n()
const detailShow = ref(false)
const shareShow = ref(false)
const videoDetail = ref<VideoDetailType>()

onMounted(async () => {
  // getSystemLanguage()
  bus.on('bus.detail.show', handleDetailShow)
  bus.on('bus.share.show', handleShareShow)
})

// async function getSystemLanguage() {
//   const lang = await settingsDB.getSetting('language')
//   if (!lang) {
//     window.ipc.invoke(IpcDirective.SYS_LANGUAGE)
//     window.ipc.once(IpcDirective.SYS_LANGUAGE_REPLAY, (e, args) => {
//       if (args === 'zh-CN') {
//         locale.value = 'zh-CN'
//       } else {
//         locale.value = 'en-US'
//       }
//       settingsDB.updateSetting({ language: locale.value })
//     })
//   } else {
//     locale.value = lang
//   }
// }

function handleDetailShow(detail?: VideoDetailType) {
  if (detail) videoDetail.value = detail
  detailShow.value = !detailShow.value
}

function handleShareShow(detail: VideoDetailType) {
  videoDetail.value = detail
  shareShow.value = true
}

function handleCloseShare() {
  shareShow.value = false
}
</script>
<style lang="scss">
html,
body,
#app,
.n-config-provider {
  height: 100%;
}
.container {
  height: 100%;
  .n-layout-scroll-container {
    display: flex;
    flex-direction: column;
  }
  .slide-enter-active {
    animation: slide-in-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  @keyframes slide-in-right {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .slide-leave-active {
    animation: slide-out-right 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
  }
  @keyframes slide-out-right {
    0% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }
}
</style>
