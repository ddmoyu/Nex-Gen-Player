import { SetStores } from '../../decorator'
import { PlaylistItem } from 'iptv-playlist-parser'

@SetStores('id++, name, url, active, group, loading, state')
export class IpTv {
  readonly id?: number
  readonly name?: string
  readonly url?: string
  active?: boolean
  loading?: boolean
  state?: boolean
  note?: string
  list?: PlaylistItem[]
}
