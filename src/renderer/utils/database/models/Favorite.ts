import { VideoDetailType } from '@/typings/video'
import { SetStores } from '../../decorator'

@SetStores('id++, detail, hasUpdate,key')
export class Favorite {
  readonly id!: number
  readonly detail: VideoDetailType
  readonly hasUpdate?: boolean
  readonly key:string
}
