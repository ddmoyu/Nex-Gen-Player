<template>
  <div class="aside">
    <div class="top">
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('discovery')" :dashed="active === 'discovery'" :quaternary="active !== 'discovery'">
            <n-icon size="20"><PrismSharp /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('discovery') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('iptv')" :dashed="active === 'iptv'" :quaternary="active !== 'iptv'">
            <n-icon size="20"><Tv /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('tv') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('play')" :dashed="active === 'play'" :quaternary="active !== 'play'">
            <n-icon size="20"><Play /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('play') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('search')" :dashed="active === 'search'" :quaternary="active !== 'search'">
            <n-icon size="20"><Search /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('search') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('favorites')" :dashed="active === 'favorites'" :quaternary="active !== 'favorites'">
            <n-icon size="20"><Heart /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('favorites') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('history')" :dashed="active === 'history'" :quaternary="active !== 'history'">
            <n-icon size="20"><Time /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('history') }}</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('download')" :dashed="active === 'download'" :quaternary="active !== 'download'">
            <n-icon size="20"><ArrowDown /></n-icon>
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
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button circle type="primary" size="large" @click="goView('settings')" :dashed="active === 'settings'" :quaternary="active !== 'settings'">
            <n-icon size="20"><Settings /></n-icon>
          </n-button>
        </template>
        <span>{{ $t('settings') }}</span>
      </n-popover>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PrismSharp, Tv, Play, Search, Heart, Time, ArrowDown, Notifications, Settings } from '@vicons/ionicons5'
import { useRouter, useRoute, RouteRecordName } from 'vue-router'

const show = ref(true)
const router = useRouter()
const route = useRoute()
const active = ref<RouteRecordName>('discovery')

watch(() => route.name, (name) => {
  if (name) {
    active.value = name
  }
})

function goView (v: string) {
  router.push({ name: v })
}
</script>
<style lang="scss" scoped>
.aside{
  width: 60px;
  height: 100%;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  button{
    -webkit-app-region: no-drag;
  }
  .top{
    display: flex;
    flex-direction: column;
    align-items: center;
    button{
      margin-bottom: 10px;
    }
  }
  .bottom{
    display: flex;
    flex-direction: column;
    align-items: center;
    button{
      margin-top: 10px;
    }
  }
}
</style>
