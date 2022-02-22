export type XMLToJSON = {
  class: Array<{ _t: string, id: number }>
  list: {
    video: Array<{
      dt: string
      id: number
      last: string
      name: string
      note: string
      tid: number
      type: string
    }>
    page: number,
    pagecount: number,
    pagesize:number,
    recordcount:number
  }
}

export type ClassType = {
  class: Array<{
    _t: string,
    id: number
  }>,
  list: {
    pagecount: number,
    pagesize: number,
    recordcount: number
  }
}
