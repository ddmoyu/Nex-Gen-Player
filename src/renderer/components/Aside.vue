<template>
  <div class="aside">
    <div class="top">
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20"><PrismSharp /></n-icon>
          </n-button>
        </template>
        <span>Discovery</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20"><Tv /></n-icon>
          </n-button>
        </template>
        <span>TV</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20"><Search /></n-icon>
          </n-button>
        </template>
        <span>Search</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20"><Heart /></n-icon>
          </n-button>
        </template>
        <span>Favorites</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20"><Time /></n-icon>
          </n-button>
        </template>
        <span>History</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20"><ArrowDown /></n-icon>
          </n-button>
        </template>
        <span>Download</span>
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
        <span>Notifications</span>
      </n-popover>
      <n-popover trigger="hover" placement="right">
        <template #trigger>
          <n-button quaternary circle type="primary" size="large">
            <n-icon size="20"><Settings /></n-icon>
          </n-button>
        </template>
        <span>Settings</span>
      </n-popover>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PrismSharp, Tv, Search, Heart, Time, ArrowDown, Notifications, Settings } from '@vicons/ionicons5'
const show = ref(true)
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
