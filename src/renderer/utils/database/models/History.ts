
export class History {
  id!: number
  site: string
  ids: number
  name: string
  type: string
  year: string
  index: number
  time: string
  detail: string
  constructor () {
    this.site = ''
    this.ids = -1
    this.name = ''
    this.type = ''
    this.year = ''
    this.index = -1
    this.time = ''
    this.detail = ''
  }
}
// use in indexDB stores init
export const HistoryStores = 'id++, site, ids, name, type, year, index, time, detail'
