export class Site {
  id!: number
  key: string
  name: string
  jiexiUrl: string
  api: string
  download: string
  isActive: boolean
  group: string
  constructor () {
    this.key = ''
    this.name = ''
    this.api = ''
    this.download = ''
    this.jiexiUrl = ''
    this.isActive = false
    this.group = ''
  }
}

export const SiteStores = '++id, key, name, api, download, jiexiUrl, isActive, group'
