import { VideoDetailType } from '@/typings/video'
import { SetStores } from '../../decorator'

@SetStores('id++, detail, hasUpdate')
export class Favorite {
  readonly id!: number
  readonly detail?: VideoDetailType
  readonly hasUpdate?: boolean
}
