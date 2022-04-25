<template>
  <div class="notice">
    <div class="" v-for="item in 15" :key="item">
      <img :src="imgList[item-1]" alt="">
    </div>
  </div>
</template>
<script lang="ts" setup>
const imgList = reactive([])
for (let index = 1; index <= 15; index++) {
  imgList.push(require(`./img/${index}.png`))
}
</script>
<style lang="scss" scoped></style>
