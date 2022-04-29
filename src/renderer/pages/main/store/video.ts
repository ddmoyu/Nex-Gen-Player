import { VideoBusPlay } from '@/typings/video'
import { defineStore } from 'pinia'
import bus from '../plugins/mitt'

export const useStore = defineStore('aap-video', {
  state: () => {
    return {
      view: 'discovery',
      video: {} as VideoBusPlay
    }
  },
  actions: {
    setView (payload: string) {
      this.view = payload
    },
    setVideo (payload: VideoBusPlay) {
      this.video = payload
      bus.emit('bus.video.play', payload)
    }
  }
})
