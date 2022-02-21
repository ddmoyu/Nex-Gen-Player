import { SetStores } from '../decorator'

@SetStores('id++, site, ids, name, index, update, detail')
export class Favorite {
  readonly id!: number
  readonly site?: string
  readonly ids?: number
  readonly name?: string
  readonly index?: number
  readonly detail?: string
  readonly update?: boolean
}
