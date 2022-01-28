export class Movie {
  id!: number
  key: string
  logo: string
  name: string
  api: string
  description: string
  download: boolean
  active: boolean
  group: string
  constructor () {
    this.key = ''
    this.logo = ''
    this.name = ''
    this.api = ''
    this.description = ''
    this.download = false
    this.active = false
    this.group = ''
  }
}

export const MovieStores = 'id++, key, logo, name, api, description, download, active, group'
