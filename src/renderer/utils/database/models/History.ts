import { SetStores } from '../../decorator'
import { VideoDetailType, HistroyDetailType } from '@/typings/video'

@SetStores('id++, type, detail, index, time')
export class History {
  readonly id?: number
  readonly type: string
  readonly detail?: VideoDetailType | HistroyDetailType
  readonly index?: number
  readonly time?: number
}
