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
  class: string
  pic: string
  lang?: string
  area?: string
  year?: string
  total?: number
  content?: string
  actor?: string
  director?: string
  writer?: string
  duration?: string
  last?: string
  note?: string
  urls: string[]
}

export type VideoFromType = {
  detail: VideoDetailType
  from: string
}
