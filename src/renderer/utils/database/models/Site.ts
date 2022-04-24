import { SetStores } from '../../decorator'

@SetStores('++id, key, name, api, download, jiexiUrl, isActive, group, state, loading')
export class Site {
  readonly id?: number
  readonly key?: string
  readonly name?: string
  readonly api?: string
  readonly jiexi?: string
  readonly jsonApi?: string
  isActive?: boolean
  readonly group?: string
  state?: boolean
  loading?: boolean
}
