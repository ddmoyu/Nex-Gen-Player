import { SetStores } from '../decorator'
import { VideoDetailType } from '@/typings/video'

@SetStores('id++, detail, index, time')
export class History {
  readonly id!: number
  readonly detail?: VideoDetailType
  readonly index?: number
  readonly time?: number
}
