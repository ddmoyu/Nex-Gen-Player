<template>
  <div class="about">
    <n-scrollbar>
      <div class="wrapper">
        <div class="logo">logo</div>
        <div class="name">tv player <span>v0.1.0-alpha.1</span></div>
        <div class="link">
          <span>官网</span>
          <span>Github</span>
          <span>更新日志</span>
          <span>常见问题</span>
          <span>问题反馈</span>
          <span>腾讯兔小巢</span>
        </div>
        <div class="donate">
          捐助
        </div>
        <div class="disclaimers">
          免责声明
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>
<script lang="ts" setup></script>
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
  }
}
</style>
