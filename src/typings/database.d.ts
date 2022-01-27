export interface History {
  id: number
  site: string
  ids: number
  name: string
  type: string
  year: string
  index: number
  time: string
  detail: string
}

export interface Favorites {
  id: number
  site: string
  ids: number
  name: string
  index: number
  detail: string
  hasUpdate: boolean
}
