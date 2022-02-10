<template>
  <div class="settings">
    <n-button @click="changeTheme('dark')">Dark Theme</n-button>
    <n-button @click="changeTheme('light')">light Theme</n-button>
  </div>
</template>
<script lang="ts" setup>
import bus from '../../plugins/mitt'

function changeTheme (theme: string) {
  bus.emit('bus.settings.theme', theme)
}

</script>
<style lang="scss" scoped></style>
