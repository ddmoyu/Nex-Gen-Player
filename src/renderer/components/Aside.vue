<template>
  <div class="aside">
    <div class="top">
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('discovery')" :dashed="active === 'discovery'"
            :quaternary="active !== 'discovery'">
            <n-icon size="20">
              <PrismSharp />
            </n-icon>
          </n-button>
        </template>
        <span>{{ $t('discovery') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('iptv')" :dashed="active === 'iptv'"
            :quaternary="active !== 'iptv'">
            <n-icon size="20">
              <Tv />
            </n-icon>
          </n-button>
        </template>
        <span>{{ $t('tv') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('play')" :dashed="active === 'play'"
            :quaternary="active !== 'play'">
            <n-icon size="20">
              <Play />
            </n-icon>
          </n-button>
        </template>
        <span>{{ $t('play') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('favorites')" :dashed="active === 'favorites'"
            :quaternary="active !== 'favorites'">
            <n-icon size="20">
              <Heart />
            </n-icon>
          </n-button>
        </template>
        <span>{{ $t('favorites') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('history')" :dashed="active === 'history'"
            :quaternary="active !== 'history'">
            <n-icon size="20"><Time /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('history') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('download')" :dashed="active === 'download'"
            :quaternary="active !== 'download'">
            <n-icon size="20">
              <ArrowDownCircleOutline />
            </n-icon>
          </n-button>
        </template>
        <span>{{ $t('download') }}</span>
      </n-popover>
    </div>
    <div class="bottom">
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20">
              <Notifications />
              <n-badge dot :show="show"></n-badge>
            </n-icon>
          </n-button>
        </template>
        <span>{{ $t('notifications') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right-end">
        <template #trigger>
          <n-button circle type="primary" size="large"
            :quaternary="!['settings', 'siteManager', 'liveManager'].includes(active)"
            :dashed="['settings', 'siteManager', 'liveManager'].includes(active)">
            <n-icon size="20">
              <Menu />
            </n-icon>
          </n-button>
        </template>
        <template #default>
          <n-button @click="goView('settings')" text><template #icon>
              <n-icon size="16">
                <Settings />
              </n-icon>
            </template>Settings</n-button>
          <div style="height: 10px;"></div>
          <n-button @click="goView('siteManager')" text><template #icon>
              <n-icon size="16">
                <ConstructOutline />
              </n-icon>
            </template>Site Manager</n-button>
          <div style="height: 10px;"></div>
          <n-button @click="goView('liveManager')" text><template #icon>
              <n-icon size="16">
                <Build />
              </n-icon>
            </template>Live Manager</n-button>
          <div style="height: 10px;"></div>
          <n-button @click="goView('about')" text><template #icon>
              <n-icon size="16">
                <WaterOutline />
              </n-icon>
            </template>About</n-button>
        </template>
      </n-popover>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PrismSharp, Tv, Play, Heart, Time, ArrowDownCircleOutline, Notifications, Settings, Menu, ConstructOutline, Build, WaterOutline } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'

const show = ref(true)
const router = useRouter()
const route = useRoute()
const active = ref<string>('discovery')

watch(() => route.name, (name) => {
  if (typeof name === 'string') {
    active.value = name
  }
})

function goView (v: string) {
  router.push({ name: v })
}
</script>
<style lang="scss" scoped>
.aside {
  width: 60px;
  height: 100%;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  button {
    -webkit-app-region: no-drag;
  }

  .top {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-bottom: 10px;
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-top: 10px;
    }
  }
}
</style>
