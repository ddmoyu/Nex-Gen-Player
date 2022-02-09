<template>
  <n-config-provider :theme="darkTheme">
    <Frame />
    <div class="main">
      <Aside />
      <div class="router-view">
        <router-view />
      </div>
    </div>
    <div class="footer"></div>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { darkTheme } from 'naive-ui'
</script>
<style lang="scss">
html,body,#app{
  height: 100%;
}
.n-config-provider{
  height: 100%;
  display: flex;
  flex-direction: column;
  .main{
    flex: 1;
    display: flex;
    .router-view{
      flex: 1;
      border: 1px solid #000;
      border-radius: 10px 0 0 10px;
    }
  }
  .footer{
    height: 40px;
    -webkit-app-region: drag;
  }
}
</style>
