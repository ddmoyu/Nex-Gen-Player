import Dexie from 'dexie'
import { initSettings } from './default'
// import { HistoryStores } from '../models/History'
import { Favorite } from '../models/Favorite'
import { getStores } from '../decorator'
import { History } from '../models/History'
import { Movie } from '../models/Movie'
import { IpTv } from '../models/IpTv'
import { Site } from '../models/Site'
import { Setting } from '../models/Setting'
export const tableSet = ['favorits', 'history', 'movies', 'iptv', 'settings', 'sites'] as const
export class Database extends Dexie {
  static db:Database
  constructor () {
    super('Database')
    this.version(1).stores({
      favorites: getStores(Favorite),
      history: getStores(History),
      movies: getStores(Movie),
      iptv: getStores(IpTv),
      sites: getStores(Site),
      settings: getStores(Setting)
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
