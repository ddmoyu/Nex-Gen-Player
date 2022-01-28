export class Favorite {
  id!: number
  site: string
  ids: number
  name: string
  index: number
  detail: string
  update: boolean
  constructor () {
    this.site = ''
    this.ids = -1
    this.name = ''
    this.index = -1
    this.detail = ''
    this.update = false
  }
}

export const FavoriteStores = 'id++, site, ids, name, index, update, detail'
