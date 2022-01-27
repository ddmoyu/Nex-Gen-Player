import Dexie from 'dexie'
import type {
  Favorites,
  History,
  Iptv,
  Movies,
  Settings
} from '@/typings/database'
import { initSettings } from './default'

export class Database extends Dexie {
  favorits: Dexie.Table<Favorites, number>
  history: Dexie.Table<History, number>
  movies: Dexie.Table<Movies, number>
  iptv: Dexie.Table<Iptv, number>
  settings: Dexie.Table<Settings, number>

  constructor () {
    super('Database')

    this.version(1).stores({
      favorits: 'id++, site, ids, name, index, update, detail',
      history: 'id++, site, ids, name, type, year, index, time, detail',
      movies: 'id++, key, logo, name, api, description, download, active, group',
      iptv: 'id++, name, url, active, group',
      settings: 'id, view, windows, play, theme, language, shortcut, search, player, downlaoder, exclude, proxy, password'
    })

    this.favorits = this.table('favorits')
    this.history = this.table('history')
    this.movies = this.table('movies')
    this.iptv = this.table('iptv')
    this.settings = this.table('settings')
  }
}

const db = new Database()
db.open()

db.on('populate', () => {
  db.settings.bulkAdd(initSettings)
})

export default db
