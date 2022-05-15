export interface BaseType<T = any> {
  code: number
  message: string
  result: T
  method?: string
  params?:any
  path?: string
  status?: number
  timestamp?: string
}
export interface ListType<T = any> {
  list: T
  total: number
  pageSize: number
  pageNum: number
}
