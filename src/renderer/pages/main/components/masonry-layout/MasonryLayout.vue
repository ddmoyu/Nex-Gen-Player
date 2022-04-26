<template>
  <div class="ma-l">
    <div class="img-cn" v-for="item in 15" :key="item">
      <span class="mark">{{item}}</span>
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
<style lang="scss" scoped>
.ma-l{
  columns: 4;
  gap:10px;
}
.img-cn{
  position: relative;
  .mark{
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px;
    background-color: #000;
  }
  img{
    width:100%;
  }
}
</style>
