<template>
  <div class="discovery">
    <n-button @click="go">go download</n-button>
    {{sum}}{{dbSum}}
    <n-button @click="add"> + </n-button>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
function go () {
  router.push({ name: 'download' })
}
const sum = ref(0)
const dbSum = computed(() => sum.value * 2)
function add () {
  sum.value++
}
</script>
<style lang="scss" scoped></style>
