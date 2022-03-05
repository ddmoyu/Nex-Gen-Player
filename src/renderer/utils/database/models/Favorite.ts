import { VideoDetailType } from '@/typings/video'
import { SetStores } from '../decorator'

@SetStores('id++, detail, update ')
export class Favorite {
  readonly id!: number
  readonly detail?: VideoDetailType[]
  // readonly site?: string
  // readonly ids?: number
  // readonly name?: string
  // readonly index?: number
  // readonly detail?: string
  readonly update?: boolean
}
