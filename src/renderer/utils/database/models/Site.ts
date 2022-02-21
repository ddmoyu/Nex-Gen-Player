import { SetStores } from '../decorator'

@SetStores('++id, key, name, api, download, jiexiUrl, isActive, group')
export class Site {
  readonly id?: number
  readonly key?: string
  readonly name?: string
  readonly jiexiUrl?: string
  readonly api?: string
  readonly download?: string
  readonly isActive?: boolean
  readonly group?: string
}
