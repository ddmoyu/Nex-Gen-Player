<template>
  <div class="favorites">
    <div class="header">
      <div class="left">
        <n-button @click="getFavorites">getFavorites</n-button>
      </div>
      <div class="right"></div>
    </div>
    <div class="body">
      <n-scrollbar class="custom-scrollbar">
        <v3-waterfall
          :list="list"
          :colWidth="220"
          :isLoading="isLoading"
          :isMounted="isMounted">
          <template #default="slot">
            <n-card class="card" embedded content-style="padding: 8px 6px 10px;" @click="handleDetail(slot.item)">
              <template #cover>
                <!-- <img :src="slot.item.detail.pic" alt=""> -->
                <img src="../../../../assets/default.png" alt="">
                <div class="btns">
                  <div class="btns-wrapper">
                    <span @click.stop="handlePlay(slot.item)">Play</span>
                    <span @click.stop="handleDelete(slot.item)">Delete</span>
                  </div>
                </div>
              </template>
              <n-ellipsis class="name" style="max-width: 100%">
                {{slot.item.detail.name}}
              </n-ellipsis>
              <div class="info">
                <span>{{slot.item.detail.area}}</span>
                <span>{{slot.item.detail.class}}</span>
                <span>{{slot.item.detail.note}}</span>
              </div>
            </n-card>
          </template>
        </v3-waterfall>
      </n-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { VideoDetailType } from '@/typings/video'
import { useRouter } from 'vue-router'
import { useStore } from '../../store/video'
import bus from '../../plugins/mitt'
import { db } from '@/renderer/utils/database/controller/DBTools'
import { Favorite } from '@/renderer/utils/database/models/Favorite'
import { useMessage } from 'naive-ui'

const list = ref<VideoDetailType[]>([])
const emptyVideoList = ref('empty')
const isLoading = ref(false)
const isMounted = ref(false)
const isOver = ref(false)

const store = useStore()
const router = useRouter()
const message = useMessage()

async function getFavorites () {
  isOver.value = false
  isLoading.value = true
  const favList = await db.all('favorites')
  if (!favList.length) {
    emptyVideoList.value = 'No favorites'
  } else {
    list.value = favList
  }
  isOver.value = true
  isLoading.value = false
}

function handleDetail (item: VideoDetailType) {
  console.log(item)
  // router.push({ name: 'play' })
  // store.setVideo(item)
}

function handlePlay (item: VideoDetailType) {
  store.setVideo(item)
  router.push({ name: 'play' })
  bus.emit('bus.video.play', item)
  // console.log('=== handlePlay item ===', item)
}

async function handleDelete (item: Favorite) {
  await db.delete('favorites', item.id)
  message.success('删除成功')
  await getFavorites()
}

// TODO: 瀑布流失效
onMounted(() => {
  isMounted.value = true
  getFavorites()
})
</script>
<style lang="scss" scoped>
.favorites{
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  padding: 10px;
  .header{
    height: 44px;
    display: flex;
    justify-content: space-between;
    .left{
      display: flex;
      .select{
        width: 180px;
        margin-right: 20px;
      }
    }
    .right{
      .searchInput{
        width: 220px;
      }
    }
  }
  .body{
    height: calc(100% - 44px);
    width: 100%;
    .waterfall{
      width: 100%;
    }
    .card{
      width: 100%;
      cursor: pointer;
      :deep(.n-card-cover){
        position: relative;
        .btns{
          display: none;
          position: absolute;
          bottom: 0;
          height: 36px;
          width: 100%;
          transform: 0.3s;
          .btns-wrapper{
            display: flex;
            height: 100%;
            width: 100%;
            justify-content: space-between;
            span{
              flex: 0.5;
              display: flex;
              height: 100%;
              color: #cdcdcd;
              align-items: center;
              justify-content: center;
              background-color: rgba(45, 45, 45, 0.7);
              &:hover{
                color: #dedede;
                background-color: rgba(7, 7, 7, 0.8);
              }
            }
          }
        }
      }
      &:hover{
        .btns{
          display: block;
        }
      }
      .info{
        margin-top: 4px;
        font-size: 12px;
        opacity: 0.9;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
