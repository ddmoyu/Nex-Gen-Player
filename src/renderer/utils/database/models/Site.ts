import { SetStores } from '../../decorator'

@SetStores('++id, key, name, api, download, jiexiUrl, isActive, group, state')
export class Site {
  readonly id?: number
  readonly key?: string
  readonly name?: string
  readonly api?: string
  readonly jiexi?: string
  readonly jsonApi?: string
  isActive?: boolean
  group?: string
  state?: boolean
}
