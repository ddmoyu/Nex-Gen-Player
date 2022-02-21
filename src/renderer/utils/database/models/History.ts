import { SetStores } from '../decorator'

@SetStores('id++, site, ids, name, type, year, index, time, detail')
export class History {
  readonly id?: number

  readonly site?: string

  readonly ids?: number

  readonly name?: string

  readonly type?: string

  readonly year?: string

  readonly index?: number

  readonly time?: number

  readonly detail?: string
}
