import { db } from '@/renderer/utils/database/controller/DBTools'
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'
import { Site } from '@/renderer/utils/database/models/Site'
import { getClass } from '@/renderer/utils/movie'
import { ClassType } from '@/typings/video'
import { differenceBy } from 'lodash'
import { defineStore } from 'pinia'

export const useSites = defineStore('app-sites', {
  state: () => ({
    sites: [] as Site[],
    classCache: new Map() as Map<string, ClassType>
  }),
  getters: {
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
        return []
      }
      const cache = this.classCache.get(site.key)
      const exclude = await settingsDB.getSetting('exclude')
      if (cache) {
        if (exclude.classToggle) {
          try {
            const els = exclude.class.split(',').map((item: string, idx: number) => ({ _t: item, id: idx }))
            const arr = differenceBy(cache.class, els, '_t')
            return arr.map(item => ({ label: item._t, value: item.id }))
          } catch (_) {
            const res = await getClass(site.api)
            if (res) {
              this.classCache.set(site.key, res)
              return res.class.map(item => ({ label: item._t, value: item.id }))
            } else {
              return []
            }
          }
        } else {
          return cache.class.map(item => ({ label: item._t, value: item.id }))
        }
      } else {
        const res = await getClass(site.api)
        if (res) {
          if (exclude.classToggle) {
            const els = exclude.class.split(',').map((item: string, idx: number) => ({ _t: item, id: idx }))
            const arr = differenceBy(res.class, els, '_t')
            return arr.map(item => ({ label: item._t, value: item.id }))
          } else {
            this.classCache.set(site.key, res)
            return res.class.map(item => ({ label: item._t, value: item.id }))
          }
        } else {
          return []
        }
      }
    }
  }
})
