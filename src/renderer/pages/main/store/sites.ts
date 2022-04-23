import { db } from '@/renderer/utils/database/controller/DBTools'
import { Site } from '@/renderer/utils/database/models/Site'
import { getClass } from '@/renderer/utils/movie'
import { ClassType } from '@/typings/video'
import { defineStore } from 'pinia'

export const useSites = defineStore('app-sites', {
  state: () => ({
    sites: [] as Site[],
    classCache: new Map() as Map<string, ClassType>
  }),
  getters: {
    // :{label:string, value:number}[]
    getSiteOptions: ({ sites }) => {
      return sites.map(item => ({
        label: item.name,
        value: item.id
      }))
    }
  },
  actions: {
    async assignSites () {
      const dbSites = await db.all<Site>('sites')
      this.sites = dbSites.filter(f => f.isActive)
      return this.sites
    },
    async assignClassList (site:Site) {
      if (!site.key) {
        // error handling
        return []
      }
      const cache = this.classCache.get(site.key)
      if (cache) {
        // TODO:后续决定是否需要再次发送请求刷新缓存
        return cache.class.map(item => ({
          label: item._t, value: item.id
        }))
      } else {
        const res = await getClass(site.api)
        if (res) {
          this.classCache.set(site.key, res)
          return res.class.map(item => ({
            label: item._t, value: item.id
          }))
        } else {
          // error handling
          return []
        }
      }
    }
  }
})
