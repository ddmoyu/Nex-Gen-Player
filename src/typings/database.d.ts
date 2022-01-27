export interface History {
  id: number
  site: string
  ids: number
  name: string
  type: string
  year: string
  index: number
  time: string
  detail: string
}

export interface Favorites {
  id: number
  site: string
  ids: number
  name: string
  index: number
  detail: string
  update: boolean
}

export interface Movies {
  id: number
  key: string
  logo: string
  name: string
  api: string
  description: string
  download: boolean
  active: boolean
  group: string
}

export interface Iptv {
  id: number
  name: string
  url: string
  active: boolean
  group: string
}

export interface Play {
  multiple: boolean
  minimize: boolean
  switch: boolean
}
export interface LocalKey {
  [key: string]: string
}
export interface Shortcut {
  toggle: boolean,
  localKey: LocalKey
}
export interface Exclude {
  type: string[]
  txt: string[]
}
export interface Proxy {
  toggle: boolean
  agree: string
  ip: string
  port: string
}
export interface Password {
  toggle: boolean
  tips: string
  password: string
}
export interface Settings {
  id: number
  view: string
  windows: boolean
  play: Play
  theme: string
  language: string
  shortcut: Shortcut
  search: boolean
  player: string
  downloader: string
  exclude: Exclude
  proxy: Proxy,
  password: Password
}
