import Dexie from 'dexie'
import { initSettings } from './default'
import { HistoryStores } from '../models/History'
import { MovieStores } from '../models/Movie'
import { IpTvStores } from '../models/IpTv'
import { FavoriteStores } from '../models/Favorite'

export const tableSet = ['favorits', 'history', 'movies', 'iptv', 'settings'] as const
export class Database extends Dexie {
  static db:Database
  constructor () {
    super('Database')
    this.version(1).stores({
      favorites: FavoriteStores,
      history: HistoryStores,
      movies: MovieStores,
      iptv: IpTvStores,
      settings: 'id, view, windows, play, theme, language, shortcut, search, player, downlaoder, exclude, proxy, password'
    })
  }

  static getDB () {
    if (Database.db) {
      return Database.db
    } else {
      const db = Database.db = new Database()
      db.open()
      db.on('populate', () => {
        db.table('settings').bulkAdd(initSettings)
      })
      return db
    }
  }
}
