export class Setting {
  id:number
  view:string
  windows:boolean
  play:{[key:string]:any}
  theme:'dark'|'light'
  language:'en'|'cn'
  shortcut:{[key:string]:any}
  search:string
  player:string
  downlaoder:string
  exclude:{[key:string]:any}
  proxy:{[key:string]:any}
  password:{[key:string]:any}
  constructor () {
    this.id = 0
    this.view = ''
    this.windows = false
    this.play = {}
    this.theme = 'dark'
    this.language = 'en'
    this.shortcut = {}
    this.search = ''
    this.player = ''
    this.downlaoder = ''
    this.exclude = {}
    this.proxy = {}
    this.password = {}
  }
}

export const SettingStores = 'id, view, windows, play, theme, language, shortcut, search, player, downlaoder, exclude, proxy, password'
