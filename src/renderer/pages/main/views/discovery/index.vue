<template>
  <div class="discovery">
    discovery
    <button @click="go">go download</button>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function go () {
  router.push({ name: 'download' })
}
</script>
<style lang="scss" scoped></style>
