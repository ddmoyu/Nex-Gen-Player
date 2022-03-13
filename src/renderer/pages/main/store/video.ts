import { VideoDetailType } from '@/typings/video'
import { defineStore } from 'pinia'

export const useStore = defineStore('video', {
  state: () => {
    return {
      view: 'discovery',
      video: {}
    }
  },
  actions: {
    setView (payload: string) {
      this.view = payload
    },
    setVideo (payload: VideoDetailType) {
      this.video = payload
    }
  }
})
