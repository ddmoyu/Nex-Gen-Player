import { SetStores } from '../decorator'

@SetStores('id++, key, logo, name, api, description, download, active, group')
export class Movie {
  readonly id?: number
  readonly key?: string
  readonly logo?: string
  readonly name?: string
  readonly api?: string
  readonly description?: string
  readonly download?: boolean
  readonly active?: boolean
  readonly group?: string
}
