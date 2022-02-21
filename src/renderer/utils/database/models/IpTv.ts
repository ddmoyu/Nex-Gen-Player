import { SetStores } from '../decorator'

@SetStores('id++, name, url, active, group')
export class IpTv {
  readonly id?: number
  readonly name?: string
  readonly url?: string
  readonly active?: boolean
  readonly group?: string
}
