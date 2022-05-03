<template>
  <div class="waterfall-container" ref="waterfallContainer">
    <div class="loading top" v-if="isLoading && list.length === 0">
      <div class="dot-falling"></div>
    </div>
    <template v-if="columnNum.length > 0">
      <div class="column-container" v-for="(columnItem, c) in columns" :style="`width:calc(${100 / columns}% - ${gap}px)`"
        :key="c + 'column'">
        <template v-for="(imgItem, i ) in columnNum[c]" :key="'img' + c + i">
          <div class="img-container">
            <img class=" column-img" v-lazy :data-origin="list[i * columns + c][srcKey]" style="transform: scale(0);"
              :data-index="i * columns + c" @load="loaded" @error="loadError">
            <div class="supernatant">
              <slot name="supernatant" v-bind="list[i * columns + c]"></slot>
            </div>
          </div>
        </template>
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
import { vLazy } from '@/renderer/directives/vLazy'
type Props = {
  list?: any[]
  srcKey?: string,
  gap?: number,
  isLoading: boolean,
  breakWidth?: number
}
const props = withDefaults(defineProps<Props>(), {
  srcKey: 'pic',
  isLoading: false,
  gap: 10,
  breakWidth: 250,
  list: () => []
})

const emits = defineEmits(['scrollReachBottom'])
/** 图片每列的排列状态 */
const columnNum = reactive([])
/** 图片的加载状态 */
const columns = ref(0)
const loadState = reactive([])
watchEffect(() => {
  const length = props.list.length
  columnNum.length = 0
  if (length === 0) return
  let rem = length % columns.value
  const num = (length - rem) / columns.value
  for (let index = 0; index < columns.value; index++) {
    if (rem > 0) {
      columnNum.push(num + 1)
    } else {
      columnNum.push(num)
    }
    rem--
  }
  loadState.length = length
})

function loaded (e: Event) {
  const target = e.target as HTMLImageElement
  target.setAttribute('style', 'transform: scale(1)')
}

function loadError (e: Event) {
  const target = e.target as HTMLImageElement
  // const { index } = target.dataset
}

const obTarget = ref<HTMLDivElement>()
let disconnectCb: Function | null = null
function observerDom () {
  if (!obTarget.value) return
  const root = document.querySelector('#v_lazy_root')
  const options = {
    root: root || null,
    threshold: 1
  }
  const observer = new IntersectionObserver((enters) => {
    enters.forEach(item => {
      if (item.isIntersecting) {
        const { top } = item.boundingClientRect
        const { height } = item.rootBounds
        if (top < height) return
        if (props.list.length === 0 || props.isLoading) return
        emits('scrollReachBottom')
      }
    })
  }, options)
  observer.observe(obTarget.value)
  disconnectCb = () => {
    observer.disconnect()
  }
}

/** watch resize event   */
const waterfallContainer = ref<HTMLDivElement>()
function computedColumns () {
  if (!waterfallContainer.value) return
  columns.value = Math.floor(waterfallContainer.value.clientWidth / props.breakWidth)
  console.log(columns.value)
}
function watchResize (watch = true) {
  const resizeHandle = useDebounceFn(() => {
    computedColumns()
  }, 500)
  watch ? window.addEventListener('resize', resizeHandle) : window.removeEventListener('resize', resizeHandle)
}

onMounted(() => {
  computedColumns()
  observerDom()
  watchResize()
})
onUnmounted(() => {
  watchResize(false)
  disconnectCb()
})
</script>
<style lang="scss" scoped>
.waterfall-container {
  display: flex;
  overflow: unset;
  padding: 0 60px 20px 60px;
  min-height: 100%;
  position: relative;

  // transform: translateZ(0);
  .column-container {
    display: flex;
    flex-direction: column;

    &:not(:first-child) {
      margin-left: 10px;
    }

    .img-container {
      position: relative;
      margin-bottom: 10px;
      overflow: hidden;

      .column-img {
        width: 100%;
        min-height: 300px;
        object-fit: contain;
        vertical-align: bottom;
        transition: all ease-in 0.3s;
        position: relative;
        z-index: 2;
        // position: absolute;
        // top: 0;
        // bottom: 0;
        // left: 0;
        // right: 0;
        // z-index: 11;
      }

      .supernatant {
        // position: absolute;
        z-index: 10;
        width: 100%;
        bottom: 0;
      }

      .img-loading {
        min-height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
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
    bottom: 5px;
    opacity: 0;

  }

  .opacity {
    opacity: 1;
  }
}
</style>
