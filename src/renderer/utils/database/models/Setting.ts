import { SetStores } from '../../decorator'

@SetStores('id, view, windows, play, theme, language, os, shortcut, player, downlaoder, exclude, proxy, password, siteUrls')
export class Setting {
  readonly id?: number
  readonly view?: string
  readonly windows?: boolean
  readonly play?: {[key:string]:any}
  readonly theme: 'dark' | 'light' | 'system'
  readonly language: string
  readonly os?: string
  readonly shortcut?: {[key:string]:any}
  readonly player?: string
  readonly downloader?: string
  readonly exclude?: {[key:string]:any}
  readonly proxy?: {[key:string]:any}
  readonly password?: {[key:string]:any}
  readonly siteUrls?: {[key:string]:any}[]
}
