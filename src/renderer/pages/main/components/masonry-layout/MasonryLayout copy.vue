<template>
  <div class="waterfall-container" ref="waterfallContainer">
    <div class="loading top" v-if="isLoading && list.length === 0">
      <div class="dot-falling"></div>
    </div>
    <template v-if="imgColumn.length > 0">
      <div class="column-container" v-for="(columnItem, c) in imgColumn"
        :style="`width:calc(${100 / column}% - ${gap}px)`" :key="c + 'column'">
        <div class="img-container" v-for="(imgItem, i ) in columnItem" :key="'img' + c + i">
          <!-- <div class="img-container" v-for="(imgItem, i ) in columnItem" :key="'img' + c + i"
          :style="`height:${imgItem.height}px`"> -->
          <span class="mark">{{ i * 4 + c + 1 }}</span>
          <img class="column-img" :src="imgItem.target[srcKey]" :data-index="[c, i]"
            :data-origin="imgItem.target[srcKey]" @load="loaded">
          <div class="supernatant">
            <slot name="supernatant" v-bind="imgItem"></slot>
          </div>
        </div>
      </div>
    </template>
    <div :class="['loading', 'bottom', { opacity: isLoading && list.length > 0 }]" ref="obTarget">
      <div class="dot-falling"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import 'three-dots/dist/three-dots.css'
import { useDebounceFn } from '@vueuse/core'

type Props = {
  column?: number,
  list?: any[]
  srcKey?: string,
  gap?: number,
  isLoading: boolean,
}
const props = withDefaults(defineProps<Props>(), {
  srcKey: 'pic',
  column: 4,
  isLoading: false,
  gap: 10,
  list: () => []
})

const emits = defineEmits(['scrollReachBottom'])

const imgColumn: any[][] = reactive([])
watchEffect(() => {
  for (let index = 0; index < props.column; index++) {
    imgColumn.push([])
  }
})

// watchEffect(() => {
//   if (props.list.length === 0) {
//     imgColumn.forEach(item => { item.length = 0 })
//   }
//   const length = imgColumn.reduce((a, b) => a + b.length, 0)
//   for (let index = length; index < props.list.length; index++) {
//     const i = index % props.column
//     imgColumn[i].push({
//       target: props.list[index],
//       height: 0
//     })
//   }
// })
const columnNum = []
watchEffect(() => {
  if (props.list.length === 0) {
    columnNum.length = 0
  }
  const length = imgColumn.reduce((a, b) => a + b.length, 0)
  let rem = length % props.column
  const num = (length - rem) / props.column
  for (let index = 0; index < props.column; index++) {
    if (rem > 0) {
      columnNum.push(num + 1)
    } else {
      columnNum.push(num)
    }
    rem--
  }
})

function loaded (e: Event) {
  const target = e.target as HTMLImageElement
  const { dataset, height } = target
  const [c, i] = dataset.index.split(',')
  imgColumn[c][i].height = height
}

const waterfallContainer = ref<HTMLDivElement>()
const obTarget = ref<HTMLDivElement>()
function observerDom () {
  if (!obTarget.value) return
  const options = {
    threshold: 1
  }
  const observer = new IntersectionObserver((enters) => {
    enters.forEach(item => {
      if (item.isIntersecting) {
        if (props.list.length === 0 || props.isLoading) return
        emits('scrollReachBottom')
      }
    })
  }, options)
  observer.observe(obTarget.value)
}

/** watch resize event   */
function watchResize (watch = true) {
  const resizeHandle = useDebounceFn(() => {
    console.log([waterfallContainer.value])
  }, 500)
  watch ? window.addEventListener('resize', resizeHandle) : window.removeEventListener('resize', resizeHandle)
}

onMounted(() => {
  observerDom()
  watchResize()
})
</script>
<style lang="scss" scoped>
.waterfall-container {
  display: flex;
  overflow: unset;
  padding: 0 60px 20px 60px;
  min-height: 100%;
  position: relative;

  .column-container {
    display: flex;
    flex-direction: column;

    &:not(:first-child) {
      margin-left: 10px;
    }

    .img-container {
      position: relative;
      margin-bottom: 10px;
      transition: height ease-in 0.7s;
      overflow: hidden;

      .mark {
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px;
        background-color: #000;
      }

      .column-img {
        width: 100%;
        object-fit: contain;
        vertical-align: bottom;
      }

      .supernatant {
        // position: absolute;
        z-index: 10;
        width: 100%;
        bottom: 0;
      }
    }

  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 20px;
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
    width: 150px;
    overflow: hidden;
  }

  .top {
    top: 20px;
  }

  .bottom {
    bottom: 20px;
    opacity: 0;

  }

  .opacity {
    opacity: 1;
  }
}
</style>
