<template>
  <div class="waterfall-container">
    <div class="column-container" v-for="(column, c) in imgColumn" :key="c + 'column'">
      <div class="img-container" v-for="(imgItem, i ) in column" :key="'img' + c + i">
        <span class="mark">{{ i * 4 + c + 1 }}</span>
        <img class="column-img" :src="imgItem[srcKey]" @load="loaded" alt="">
        <div class="supernatant">
          <slot name="supernatant" v-bind="imgItem"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
type Props = {
  column?: number,
  list?:any[]
  srcKey?:string
}
const props = withDefaults(defineProps<Props>(), {
  srcKey: 'pic',
  column: 4,
  list: () => []
})
/** computed data --s */
const imgColumn = computed(() => {
  const arr: any[][] = []
  for (let index = 0; index < props.column; index++) {
    arr.push([])
  }
  return arr
})

/** compted data --e */
// const imgList = reactive([])
// for (let index = 1; index <= 15; index++) {
//   imgList.push(require(`./img/${index}.png`))
// }
watchEffect(() => {
  props.list.forEach((item, index) => {
    const i = index % props.column
    imgColumn.value[i].push(item)
  })
})
function loaded () {
  console.log(111)
}
</script>
<style lang="scss" scoped>
.waterfall-container {
  display: flex;

  .column-container {
    width: 24%;
    display: flex;
    flex-direction: column;

    &:not(:first-child) {
      margin-left: 10px;
    }

    .img-container {
      position: relative;
      margin-bottom: 10px;
      .mark {
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px;
        background-color: #000;

        img {
          width: 100%;
        }
      }

      .column-img {
        width: 100%;
        object-fit: contain;
      }
      .supernatant{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

  }
}
</style>
