<template>
  <n-layout class="detail">
    <div class="wrapper">
      <div class="header">
        <span>Detail</span>
        <n-button text @click="handleClose"><n-icon size="24"><Close /></n-icon></n-button>
      </div>
      <div class="main">
        <n-scrollbar>
          <div class="item info">
            <div class="left">
              <img :src="video && video.pic" alt="">
            </div>
            <div class="middle">
              <div class="li name">{{video && video.name}}</div>
              <div class="li">导演: {{video && video.director}}</div>
              <div class="li">主演: {{video && video.actor}}</div>
              <div class="li">类型: {{video && video.class}}</div>
              <div class="li">地区: {{video && video.area}}</div>
              <div class="li">语言: {{video && video.lang}}</div>
              <div class="li">上映: {{video && video.year}}</div>
              <div class="li">更新: {{video && video.last}}</div>
              <div class="li">备注: {{video && video.note}}</div>
            </div>
            <div class="right" v-if="ratingList">
              <div class="li" v-for="(i, j) in ratingList" :key="j">
                <div class="l name">
                  <img :src="require(`../assets/img/${i.name}.svg`)" alt="">
                  <span>{{i.name}}</span>
                </div>
                <div class="l rating">{{i.rating || 0}}</div>
                <div class="l votes">{{i.votes}} votes</div>
              </div>
            </div>
          </div>
          <div class="item operate">
            <div class="left">
              <n-button quaternary type="primary" size="small" @click="handlePlay()">
                <n-icon size="22">
                  <Play />
                </n-icon>
              </n-button>
              <n-button quaternary type="primary" size="small" @click="handleFavorite">
                <n-icon size="22">
                  <Heart v-show="favShow"/>
                  <HeartOutline v-show="!favShow"/>
                </n-icon>
              </n-button>
            </div>
            <div class="right">
              <n-dropdown :options="onlineOptions" placement="top-end" @select="handleOnlineSelect">
                <n-button quaternary type="primary" size="small">
                  <n-icon size="22"><Globe /></n-icon>
                </n-button>
              </n-dropdown>
              <n-dropdown :options="menuOptions" placement="top-end" @select="handleMenuSelect">
                <n-button quaternary type="primary" size="small">
                  <n-icon size="22"><Menu /></n-icon>
                </n-button>
              </n-dropdown>
            </div>
          </div>
          <div class="item description" v-if="video && video.content">
            {{ filterContent(video) }}
          </div>
          <div class="item list" v-if="video && video.urls.length > 1">
            <n-button quaternary type="primary" size="small" v-for="(i, j) in video.urls" :key="j" @click="handlePlay(j)">
              第 {{j + 1}} 集
            </n-button>
          </div>
        </n-scrollbar>
      </div>
    </div>
  </n-layout>
</template>
<script lang="ts" setup>
import { VideoDetailType } from '@/typings/video'
import bus from '../pages/main/plugins/mitt'
import { NIcon, useMessage } from 'naive-ui'
import { getRating } from '../utils/movie'
import { Close, Globe, Heart, HeartOutline, Play, ArrowDownCircleOutline, ShareSocialOutline, PlayCircleOutline, Menu } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { db } from '../utils/database/controller/DBTools'
import { Favorite } from '../utils/database/models/Favorite'
import { IpcDirective } from '@/main/ipcEnum'
import { settingsDB } from '../utils/database/controller/settingsDB'

const router = useRouter()
const video = ref<VideoDetailType>()
const props = defineProps<{ detail: VideoDetailType }>()
const ratingList = ref([])
const favShow = ref(false)
const message = useMessage()

const renderIcon = (icon: any) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    })
  }
}

const onlineOptions = ref([
  {
    label: 'Download',
    key: 'download'
  },
  {
    label: 'Other Player',
    key: 'otherPlayer'
  },
  {
    label: 'Share',
    key: 'share'
  }
])

const menuOptions = ref([
  {
    label: 'Download',
    key: 'download',
    icon: renderIcon(ArrowDownCircleOutline)
  },
  {
    label: 'Other Player',
    key: 'otherPlayer',
    icon: renderIcon(PlayCircleOutline)
  },
  {
    label: 'Share',
    key: 'share',
    icon: renderIcon(ShareSocialOutline)
  }
])

function handleClose () {
  bus.emit('bus.detail.show')
}

function handleOnlineSelect (key: string | number) {
  console.log('=== key ===', key)
}

function handleMenuSelect (key: string | number) {
  if (key === 'otherPlayer') {
    return handleOtherPlay()
  }
}

async function handleOtherPlay () {
  const res = await settingsDB.getSetting('player')
  if (!video.value.urls.length) {
    message.warning('未发现视频链接')
    return false
  }
  const urls = video.value.urls.toString()
  if (res) {
    window.ipc.invoke(IpcDirective.PLAY_WITH, { path: res, urls })
  } else {
    message.warning('未设置第三方播放器')
  }
}

function filterContent (video: VideoDetailType) {
  if (video && video.content) {
    let c = video.content
    c = c.replace(/<\/?.+?>/g, '').trim()
    c = c.replace(/&nbsp;/g, '')
    return c
  }
}

function handlePlay (index?: number) {
  handleClose()
  router.push({ name: 'play' })
  const data = { video: video.value, index, type: 'zy' }
  bus.emit('bus.video.play', data)
}

// TODO
async function getThisVideoRating (name: string) {
  console.log(' get rating ')
  ratingList.value = await getRating(name)
  // ratingList.value = [
  //   { name: 'Douban', rating: 4, votes: 10 },
  //   { name: 'IMDB', rating: 5, votes: 21 },
  //   { name: 'Rotten', rating: 1, votes: 32 }
  // ]
}

async function checkFavorite (): Promise<boolean> {
  const key = video.value.name + video.value.id
  const res = await db.find<Favorite>('favorites', { key })
  if (res) {
    favShow.value = true
  } else {
    favShow.value = false
  }
  return favShow.value
}

async function handleFavorite () {
  const flag = await checkFavorite()
  const key = video.value.name + video.value.id
  if (flag) {
    const res = await db.find<Favorite>('favorites', { key })
    await db.delete('favorites', res.id)
    favShow.value = false
    message.success('取消收藏成功')
  } else {
    await db.put<Favorite>('favorites', { detail: toRaw(video.value), hasUpdate: false, key }, { key })
    favShow.value = true
    message.success('收藏成功')
  }
}

onMounted(async () => {
  if (props.detail) {
    video.value = props.detail
    checkFavorite()
    getThisVideoRating(props.detail.name)
  }
})
</script>
<style lang="scss" scoped>
.detail{
  position: absolute;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header{
      margin-top: 10px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      span{
        font-size: 18px;
      }
    }
    .main{
      flex: 1;
      position: relative;
      overflow-y: auto;
      .item{
        margin: 10px;
        padding: 10px;
        border: 1px solid #63e2b766;
      }
      .info{
        display: flex;
        justify-content: space-between;
        .left{
          width: 240px;
          height: 100%;
          img{
            width: 100%;
            height: auto;
            vertical-align: middle;
          }
        }
        .middle{
          flex: 1;
          margin-left: 30px;
          .name{
            font-size: 20px;
            font-weight: bold;
          }
          .li{
            margin-bottom: 10px;
            word-break:break-all;
            letter-spacing: 1px;
          }
        }
        .right{
          margin-left: 20px;
          width: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: flex-start;
          .li{
            .name{
              display: flex;
              align-items: center;
              img{
                width: 28px;
              }
              span{
                margin-left: 6px;
              }
            }
            .rating{
              margin: 2px 0;
              font-size: 20px;
            }
            .votes{
              font-size: 12px;
              opacity: 0.6;
            }
          }
        }
      }
      .operate{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
