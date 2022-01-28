export class IpTv {
  id!: number
  name: string
  url: string
  active: boolean
  group: string
  constructor () {
    this.name = ''
    this.url = ''
    this.active = false
    this.group = ''
  }
}

export const IpTvStores = 'id++, name, url, active, group'
