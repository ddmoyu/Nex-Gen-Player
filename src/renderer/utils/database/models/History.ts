import { Init, InitAble } from '../decorator'

@InitAble
export class History {
  id!: number

  @Init('')
  site!: string

  @Init(0)
  ids!: number

  @Init('')
  name!: string

  @Init('')
  type!: string

  @Init('')
  year!: string

  @Init(-1)
  index!: number

  @Init('')
  time!: number

  @Init('')
  detail!: string
}
export const HistoryStores = 'id++, site, ids, name, type, year, index, time, detail'
