import Dexie from 'dexie'
import { initSettings } from './default'
import { HistoryStores } from '../models/History'
import { MovieStores } from '../models/Movie'
import { IpTvStores } from '../models/IpTv'
import { FavoriteStores } from '../models/Favorite'
import { SiteStores } from '../models/Site'
import { SettingStores } from '../models/Setting'

export const tableSet = ['favorits', 'history', 'movies', 'iptv', 'settings', 'sites'] as const
export class Database extends Dexie {
  static db:Database
  constructor () {
    super('Database')
    this.version(1).stores({
      favorites: FavoriteStores,
      history: HistoryStores,
      movies: MovieStores,
      iptv: IpTvStores,
      sites: SiteStores,
      settings: SettingStores
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
