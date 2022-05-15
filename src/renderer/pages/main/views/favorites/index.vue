<template>
  <div class="favorites">
    <div class="header">
      <div class="left">
        <n-button tertiary type="primary" @click="getFavorites">Import</n-button>
        <n-button tertiary type="primary" @click="getFavorites">Export</n-button>
      </div>
      <div class="right">
        <n-button tertiary type="primary" @click="getFavorites">Clear</n-button>
      </div>
    </div>
    <div class="body">
      <n-scrollbar id="v_lazy_root_f" class="custom-scrollbar">
        <n-empty v-if="emptyVideoList" :description="emptyVideoList"></n-empty>
        <MasonryLayout :list="list" :isLoading="isLoading" @itemClick="handleDetail" :breakWidth="200" srcKey="detail.pic" rootId="v_lazy_root_f">
          <template #supernatant="item">
            <div class="masonry-layout">
              <div class="btns">
                <div class="btns-wrapper">
                  <span @click.stop="handlePlay(item.detail)">Play</span>
                  <span @click.stop="handleDelete(item.detail)">Delete</span>
                </div>
              </div>
              <n-card class="card" embedded content-style="padding: 8px 6px 10px;" @click="handleDetail(item.detail)">
                <n-ellipsis class="name" style="max-width: 100%">
                  {{ item.detail.name }}
                </n-ellipsis>
                <div class="info">
                  <span>{{ item.detail.area }}</span>
                  <span>{{ item.detail.class }}</span>
                  <span>{{ item.detail.note }}</span>
                </div>
              </n-card>
            </div>
          </template>
        </MasonryLayout>
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

const list = ref<Favorite[]>([])
const emptyVideoList = ref('')
const isLoading = ref(false)
const isOver = ref(false)

const router = useRouter()
const message = useMessage()

async function getFavorites () {
  isOver.value = false
  isLoading.value = true
  const favList = await db.all('favorites')
  if (!favList.length) {
    emptyVideoList.value = 'No favorites'
  } else {
    list.value = favList.reverse()
  }
  isOver.value = true
  isLoading.value = false
}

function handleDetail (item: Favorite | VideoDetailType) {
  function isFav (target: Favorite | VideoDetailType): target is Favorite {
    return (item as Favorite).detail !== undefined
  }
  if (isFav(item)) {
    bus.emit('bus.detail.show', item.detail)
  } else {
    bus.emit('bus.detail.show', item)
  }
}

function handlePlay (item: VideoDetailType) {
  const videoStore = useStore()
  const { setVideo } = videoStore
  const data = { video: item, index: 0, type: 'zy' }
  setVideo(data)
  router.push({ name: 'play' })
}

async function handleDelete (item: VideoDetailType) {
  const key = item.name + item.id
  const res = await db.find<Favorite>('favorites', { key })
  await db.delete('favorites', res.id)
  message.success('删除成功')
  await getFavorites()
}

onActivated(() => {
  getFavorites()
})
</script>
<style lang="scss" scoped>
.favorites {
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  padding: 10px;

  .header {
    height: 44px;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;

      .select {
        width: 180px;
        margin-right: 20px;
      }
    }

    .right {
      .searchInput {
        width: 220px;
      }
    }
  }

  .body {
    height: calc(100% - 44px);

    .custom-scrollbar {
      padding: 20px;
    }

    .masonry-layout {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: flex-end;
      position: relative;
      cursor: pointer;

      .btns {
        display: none;
        position: absolute;
        bottom: 65px;
        height: 36px;
        width: 100%;
        z-index: 10;
        transition: all 0.3s ease;

        .btns-wrapper {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: space-between;

          span {
            cursor: pointer;
            flex: 0.5;
            display: flex;
            color: #cdcdcd;
            align-items: center;
            justify-content: center;
            background-color: rgba(45, 45, 45, 0.7);

            &:hover {
              color: #dedede;
              background-color: rgba(7, 7, 7, 0.8);
            }
          }
        }
      }
    }

    :deep(.img-container) {
      &:hover {
        .btns {
          display: block;
        }
      }
    }

    .card {
      width: 100%;
      cursor: pointer;

      :deep(.n-card-cover) {
        position: relative;
        overflow: unset;

      }

      .info {
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
