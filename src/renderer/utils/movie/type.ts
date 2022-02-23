export type ClassType = {
  class: Array<{
    _t: string
    id: number
  }>
  list: {
    pagecount: number
    pagesize: number
    recordcount: number
  }
}

export type VideoDetailType = {
  id: number
  name: string
  type: string
  pic: string
  lang?: string
  area?: string
  year?: string
  total?: number
  content?: string
  actor?: string
  director?: string
  writer?: string
  douban_id?: number
  douban_score?: string
  duration?: string
  time?: string
  last?: string
  urls: Array<{
    label: string
    url: string
  }>
}
